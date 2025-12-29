from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: str | None = None

class UserOut(UserBase):
    id: int
    role: str

    class Config:
        orm_mode = True
