import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Заполните все поля");
      return;
    }
    try {
      await login(username, password);
      navigate("/");
    } catch (err: any) {
      setError(err.data?.detail || "Ошибка входа");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Вход</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <input
        placeholder="Имя пользователя"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button type="submit">Войти</button>
    </form>
  );
}
