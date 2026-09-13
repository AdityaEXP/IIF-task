from fastapi import APIRouter, HTTPException, Depends

from app.schemas.auth import SignupSchema, LoginSchema, TokenResponse, UserOut
from app.routes.auth.auth_service import signup_user, login_user, get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=TokenResponse)
async def signup(data: SignupSchema):
    user = await signup_user(data.username, data.email, data.password, data.admin_code)
    if not user:
        raise HTTPException(status_code=400, detail="Username or email already registered")

    result = await login_user(data.email, data.password)
    return TokenResponse(
        access_token=result["access_token"],
        user=UserOut(**dict(result["user"])),
    )


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginSchema):
    result = await login_user(data.email, data.password)
    if not result:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return TokenResponse(
        access_token=result["access_token"],
        user=UserOut(**dict(result["user"])),
    )


@router.get("/me", response_model=UserOut)
async def me(current_user=Depends(get_current_user)):
    return UserOut(**dict(current_user))
