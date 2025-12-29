from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class CommentBase(BaseModel):
    content: str = Field(..., min_length=1, max_length=1000)


class CommentCreate(CommentBase):
    pass


class CommentUpdate(BaseModel):
    content: Optional[str] = Field(None, min_length=1, max_length=1000)


class CommentOut(CommentBase):
    id: int
    author_id: int
    post_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
