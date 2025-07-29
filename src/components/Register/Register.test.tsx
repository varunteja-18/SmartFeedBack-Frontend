import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "./Register";
import { BrowserRouter, Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { vi } from "vitest";

// Mock axios and toast
vi.mock("../../api/axiosInstance");
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />,
}));

describe("Register Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders register form elements", () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    expect(screen.getByRole("heading", { name: /register/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/user name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
    expect(screen.getByText(/already registered/i)).toBeInTheDocument();
  });

  test("initial inputs are empty", () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/name/i)).toHaveValue("");
    expect(screen.getByPlaceholderText(/email/i)).toHaveValue("");
    expect(screen.getByPlaceholderText(/password/i)).toHaveValue("");
  });

  test("shows error if fields are empty", async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("All fields are required!");
    });
  });

  test("shows error for invalid email", async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/name/i), {
      target: { value: "TestUser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "invalidemail" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "ValidPass1!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Please enter a valid email address!");
    });
  });

  test("shows error for weak password", async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/name/i), {
      target: { value: "TestUser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "weak" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Password must be 8+ characters with uppercase, lowercase, number, and special character."
      );
    });
  });

  test("successful registration redirects to /login", async () => {
    const history = createMemoryHistory();

    (axiosInstance.post as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { message: "Registration successful!" },
    });

    render(
      <Router location={history.location} navigator={history}>
        <Register />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText(/name/i), {
      target: { value: "TestUser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "ValidPass1!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Registration successful!");
    });

    await waitFor(() => {
      expect(history.location.pathname).toBe("/login");
    }, { timeout: 2000 });
  });

  test("shows error if registration API fails", async () => {
    (axiosInstance.post as unknown as ReturnType<typeof vi.fn>).mockRejectedValue({
      response: {
        data: { message: "User already exists" },
      },
    });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/name/i), {
      target: { value: "ExistingUser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "existing@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "Password1!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("User already exists");
    });
  });
});
