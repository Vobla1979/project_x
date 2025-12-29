import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

type UserProfile = {
  id: number;
  email: string;
  username: string;
  role: string;
};

type Post = {
  id: number;
  title: string;
  content: string;
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [username, setUsername] = useState("");
  const [favorites, setFavorites] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState("");

  const loadProfile = async () => {
    try {
      const data = await apiRequest("/users/me");
      setProfile(data);
      setUsername(data.username);
    } catch (e) {
      console.error(e);
    }
  };

  const loadFavorites = async () => {
    try {
      const data = await apiRequest("/users/me/favorites");
      setFavorites(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (user) {
      loadProfile();
      loadFavorites();
    }
  }, [user]);

  if (!user) {
    return <p>Чтобы просмотреть профиль, войдите в аккаунт.</p>;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSavedMessage("");
    if (!username.trim()) {
      setError("Имя пользователя не может быть пустым");
      return;
    }
    try {
      const updated = await apiRequest("/users/me", {
        method: "PATCH",
        body: JSON.stringify({ username: username.trim() }),
      });
      setProfile(updated);
      setSavedMessage("Профиль обновлён");
    } catch (err: any) {
      setError(err?.data?.detail || "Ошибка при сохранении");
    }
  };

  return (
    <div>
      <h1>Профиль</h1>
      {profile && (
        <>
          <p>Email: {profile.email}</p>
          <p>Роль: {profile.role}</p>
        </>
      )}

      <h2>Редактировать профиль</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {savedMessage && <div style={{ color: "green" }}>{savedMessage}</div>}
      <form onSubmit={handleSave}>
        <div>
          <input
            placeholder="Имя пользователя"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <button type="submit">Сохранить</button>
      </form>

      <h2>Избранные посты</h2>
      {favorites.length === 0 && <p>Нет избранных постов</p>}
      <ul>
        {favorites.map(post => (
          <li key={post.id}>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
