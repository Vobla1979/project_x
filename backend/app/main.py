from fastapi import FastAPI
from app.api import auth, posts, users, comments

app = FastAPI()
app.include_router(auth.router)
app.include_router(posts.router)
app.include_router(users.router)
app.include_router(comments.router)
