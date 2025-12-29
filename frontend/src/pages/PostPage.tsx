import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiRequest } from "../api/client";
import { useAuth } from "../auth/AuthContext";

type Post = {
  id: number;
  title: string;
  content: string;
  author_id: number;
};

type Comment = {
  id: number;
  content: string;
  author_id: number;
  post_id: number;
};

export default function PostPage() {
  const { id } = useParams();
  const postId = Number(id);
  const { user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [favoriteStatus, setFavoriteStatus] = useState<"unknown" | "added" | "none">("unknown");

  const loadPost = async () => {
    const data = await apiRequest(`/posts/${postId}`);
    setPost(data);
  };

  const loadComments = async () => {
    const data = await apiRequest(`/posts/${postId}/comments`);
    setComments(data);
  };

  useEffect(() => {
    if (!postId) return;
    loadPost();
    loadComments();
  }, [postId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!commentText.trim()) {
      setError("Комментарий не может быть пустым");
      return;
    }
    try {
      await apiRequest(`/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({ content: commentText.trim() }),
      });
      setCommentText("");
      await loadComments();
    } catch (err: any) {
      setError(err?.data?.detail || "Ошибка при добавлении комментария");
    }
  };

  const toggleFavorite = async () => {
    if (!user) return;
    try {
      if (favoriteStatus === "added") {
        await apiRequest(`/posts/${postId}/favorite`, { method: "DELETE" });
        setFavoriteStatus("none");
      } else {
        await apiRequest(`/posts/${postId}/favorite`, { method: "POST" });
        setFavoriteStatus("added");
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!post) {
    return <p>Загрузка поста...</p>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>

      {user && (
        <button onClick={toggleFavorite} style={{ marginBottom: "10px" }}>
          {favoriteStatus === "added" ? "Удалить из избранного" : "В избранное"}
        </button>
      )}

      <h2>Комментарии</h2>
      {comments.length === 0 && <p>Комментариев пока нет</p>}
      <ul>
        {comments.map(c => (
          <li key={c.id}>{c.content}</li>
        ))}
      </ul>

      {user ? (
        <form onSubmit={handleAddComment}>
          {error && <div style={{ color: "red" }}>{error}</div>}
          <textarea
            placeholder="Напишите комментарий"
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
          />
          <br />
          <button type="submit">Отправить</button>
        </form>
      ) : (
        <p>Чтобы оставить комментарий, войдите в аккаунт.</p>
      )}
    </div>
  );
}
