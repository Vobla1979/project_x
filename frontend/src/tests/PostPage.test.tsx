import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PostPage from "../pages/PostPage";
import { AuthProvider } from "../auth/AuthContext";

vi.mock("../api/client", () => ({
  apiRequest: vi.fn(),
}));

import { apiRequest } from "../api/client";

const renderWithProviders = () =>
  render(
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/posts/:id" element={<PostPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>,
    { initialEntries: ["/posts/1"] }
  );

test("показывает ошибку при пустом комментарии", async () => {
  (apiRequest as any)
    .mockResolvedValueOnce({ id: 1, title: "Post", content: "Content", author_id: 1 })
    .mockResolvedValueOnce([]);

  renderWithProviders();

  await waitFor(() => {
    expect(screen.getByText("Post")).toBeInTheDocument();
  });

  const button = screen.getByText("Отправить");
  fireEvent.click(button);

  expect(screen.getByText(/Комментарий не может быть пустым/i)).toBeInTheDocument();
});
