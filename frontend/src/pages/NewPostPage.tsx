import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/client";
import { useAuth } from "../auth/AuthContext";

export default function NewPostPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return <p>Чтобы создать пост, войдите в аккаунт.</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !content.trim()) {
      setError("Заполните заголовок и текст");
      return;
    }

    try {
      const data = await apiRequest("/posts/", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
        }),
      });
      navigate(`/posts/${data.id}`);
    } catch (err: any) {
      setError(err?.data?.detail || "Ошибка при создании поста");
    }
  };

  return (
    <div>
      <h1>Новый пост</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            placeholder="Заголовок"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <div>
          <textarea
            placeholder="Текст поста"
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </div>
        <button type="submit">Опубликовать</button>
      </form>
    </div>
  );
}
