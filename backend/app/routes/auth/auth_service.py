import bcrypt
import jwt
from datetime import datetime, timedelta

from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.database.db import database
from app.core.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, ADMIN_CODE

security_scheme = HTTPBearer()


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def check_password(password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))


def create_access_token(user_id: int, role: str) -> str:
    payload = {
        "user_id": user_id,
        "role": role,
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


async def get_user_by_email(email: str):
    async with database.pool.acquire() as connection:
        return await connection.fetchrow("SELECT * FROM users WHERE email = $1", email)


async def get_user_by_id(user_id: int):
    async with database.pool.acquire() as connection:
        return await connection.fetchrow("SELECT * FROM users WHERE id = $1", user_id)


async def signup_user(username: str, email: str, password: str, admin_code: str | None):
    existing = await get_user_by_email(email)
    if existing:
        return None

    hashed = hash_password(password)
    role = "admin" if admin_code and admin_code == ADMIN_CODE else "student"

    async with database.pool.acquire() as connection:
        try:
            row = await connection.fetchrow(
                """
                INSERT INTO users (username, email, hashed_password, role)
                VALUES ($1, $2, $3, $4)
                RETURNING id, username, email, role
                """,
                username, email, hashed, role,
            )
            return row
        except Exception as e:
            print(f"signup_user failed: {e}")
            return None


async def login_user(email: str, password: str):
    user = await get_user_by_email(email)
    if not user:
        return None

    if not check_password(password, user["hashed_password"]):
        return None

    token = create_access_token(user["id"], user["role"])
    return {
        "access_token": token,
        "user": user,
    }


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security_scheme)):
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = await get_user_by_id(payload.get("user_id"))
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user


async def require_admin(current_user=Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user
