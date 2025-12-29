import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import RegisterPage from "../pages/RegisterPage";
import { AuthProvider } from "../auth/AuthContext";

const renderWithProviders = () =>
  render(
    <BrowserRouter>
      <AuthProvider>
        <RegisterPage />
      </AuthProvider>
    </BrowserRouter>
  );

test("показывает ошибку, если пароли не совпадают", () => {
  renderWithProviders();

  fireEvent.change(screen.getByPlaceholderText(/Email/i), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(screen.getByPlaceholderText(/Имя пользователя/i), {
    target: { value: "testuser" },
  });
  fireEvent.change(screen.getByPlaceholderText("Пароль"), {
    target: { value: "pass1" },
  });
  fireEvent.change(screen.getByPlaceholderText("Повторите пароль"), {
    target: { value: "pass2" },
  });

  fireEvent.click(screen.getByText("Зарегистрироваться"));

  expect(screen.getByText(/Пароли не совпадают/i)).toBeInTheDocument();
});
