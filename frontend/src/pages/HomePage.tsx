import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api/client";
import { useAuth } from "../auth/AuthContext";

type Post = {
  id: number;
  title: string;
  content: string;
  author_id: number;
};

export default function HomePage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const limit = 5;

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("skip", String(page * limit));
      params.set("limit", String(limit));
      if (search.trim()) {
        params.set("search", search.trim());
      }
      const data = await apiRequest(`/posts/?${params.toString()}`);
      setPosts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    loadPosts();
  };

  return (
    <div>
      <h1>Лента постов</h1>

      <form onSubmit={handleSearchSubmit}>
        <input
          placeholder="Поиск по заголовку и тексту"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button type="submit">Искать</button>
      </form>

      {user && (
        <div style={{ marginTop: "10px" }}>
          <Link to="/posts/new">Написать пост</Link>
        </div>
      )}

      {isLoading && <p>Загрузка...</p>}

      {!isLoading && posts.length === 0 && <p>Постов пока нет</p>}

      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <h3>
              <Link to={`/posts/${post.id}`}>{post.title}</Link>
            </h3>
            <p>{post.content.slice(0, 150)}...</p>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: "10px" }}>
        <button
          disabled={page === 0}
          onClick={() => setPage(p => Math.max(0, p - 1))}
        >
          Назад
        </button>
        <span style={{ margin: "0 10px" }}>Страница {page + 1}</span>
        <button
          disabled={posts.length < limit}
          onClick={() => setPage(p => p + 1)}
        >
          Вперед
        </button>
      </div>
    </div>
  );
}
