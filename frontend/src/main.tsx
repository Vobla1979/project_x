import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NewPostPage from "./pages/NewPostPage";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";

const API_URL = "http://localhost:8000";

async function apiRequest(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  
  const resp = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!resp.ok) {
    const data = await resp.json().catch(() => ({}));
    throw { status: resp.status, data };
  }
  return resp.json();
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/posts/new" element={<NewPostPage />} />
          <Route path="/posts/:id" element={<PostPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
