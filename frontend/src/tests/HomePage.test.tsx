import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import { AuthProvider } from "../auth/AuthContext";

// мокаем apiRequest
vi.mock("../api/client", () => ({
  apiRequest: vi.fn(),
}));

import { apiRequest } from "../api/client";

const renderWithProviders = () =>
  render(
    <BrowserRouter>
      <AuthProvider>
        <HomePage />
      </AuthProvider>
    </BrowserRouter>
  );

test("отображает список постов после загрузки", async () => {
  (apiRequest as jest.Mock).mockResolvedValueOnce([
    { id: 1, title: "Post 1", content: "Content 1", author_id: 1 },
    { id: 2, title: "Post 2", content: "Content 2", author_id: 1 },
  ]);

  renderWithProviders();

  await waitFor(() => {
    expect(screen.getByText("Post 1")).toBeInTheDocument();
    expect(screen.getByText("Post 2")).toBeInTheDocument();
  });
});

test("отправляет запрос поиска при submit формы", async () => {
  (apiRequest as jest.Mock).mockResolvedValue([]);

  renderWithProviders();

  const input = screen.getByPlaceholderText(/Поиск по заголовку/i);
  fireEvent.change(input, { target: { value: "FastAPI" } });
  fireEvent.submit(input.closest("form") as HTMLFormElement);

  await waitFor(() => {
    expect(apiRequest).toHaveBeenCalled();
  });
});
