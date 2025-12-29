import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "../pages/LoginPage";
import { AuthProvider } from "../auth/AuthContext";
import { BrowserRouter } from "react-router-dom";

test("validation error on empty submit", () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </BrowserRouter>
  );
  const button = screen.getByText("Войти");
  fireEvent.click(button);
  expect(screen.getByText(/Заполните все поля/i)).toBeInTheDocument();
});
