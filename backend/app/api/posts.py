from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.core.security import get_db, get_current_user, get_current_admin
from app.schemas.post import PostCreate, PostOut, PostUpdate
from app.models.post import Post
from app.models.favorite import Favorite

router = APIRouter(prefix="/posts", tags=["posts"])

@router.post("/", response_model=PostOut)
def create_post(post_in: PostCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    post = Post(title=post_in.title, content=post_in.content, author_id=current_user.id)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post

@router.get("/", response_model=list[PostOut])
def list_posts(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = Query(10, le=100),
    search: str | None = None,
):
    query = db.query(Post)
    if search:
        query = query.filter(or_(Post.title.ilike(f"%{search}%"), Post.content.ilike(f"%{search}%")))
    return query.offset(skip).limit(limit).all()

@router.get("/{post_id}", response_model=PostOut)
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).get(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.put("/{post_id}", response_model=PostOut)
def update_post(post_id: int, post_in: PostUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    post = db.query(Post).get(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.author_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not allowed")
    for field, value in post_in.model_dump(exclude_unset=True).items():
        setattr(post, field, value)
    db.commit()
    db.refresh(post)
    return post

@router.delete("/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    post = db.query(Post).get(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.author_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not allowed")
    db.delete(post)
    db.commit()
    return {"detail": "Deleted"}

@router.post("/{post_id}/favorite")
def add_favorite(post_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    if not db.query(Post).get(post_id):
        raise HTTPException(status_code=404, detail="Post not found")
    fav = Favorite(user_id=current_user.id, post_id=post_id)
    db.add(fav)
    try:
        db.commit()
    except Exception:
        db.rollback()
    return {"detail": "OK"}

@router.delete("/{post_id}/favorite")
def remove_favorite(post_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    fav = db.query(Favorite).filter_by(user_id=current_user.id, post_id=post_id).first()
    if fav:
        db.delete(fav)
        db.commit()
    return {"detail": "OK"}
