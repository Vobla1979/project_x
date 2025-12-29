from app.core.db import Base, engine
from app.models import user, post, comment, favorite  # импортируй модели

target_metadata = Base.metadata
