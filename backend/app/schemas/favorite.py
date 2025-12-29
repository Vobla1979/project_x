from pydantic import BaseModel


class FavoriteBase(BaseModel):
    user_id: int
    post_id: int


class FavoriteOut(FavoriteBase):
    id: int

    class Config:
        from_attributes = True
