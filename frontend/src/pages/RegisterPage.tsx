import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !username || !password || !password2) {
      setError("Заполните все поля");
      return;
    }
    if (password !== password2) {
      setError("Пароли не совпадают");
      return;
    }

    try {
      await register(email, username, password);
      navigate("/");
    } catch (err: any) {
      setError(err?.data?.detail || "Ошибка регистрации");
    }
  };

  return (
    <div>
      <h1>Регистрация</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            placeholder="Имя пользователя"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Повторите пароль"
            value={password2}
            onChange={e => setPassword2(e.target.value)}
          />
        </div>
        <button type="submit">Зарегистрироваться</button>
      </form>
      <p>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </div>
  );
}
