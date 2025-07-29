import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';
import { BrowserRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import { vi } from 'vitest';

// Mocking axios and toastify
vi.mock('../../api/axiosInstance');
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />,
}));

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders all form inputs and labels', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });

  test('initial input values should be empty', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    expect(screen.getByPlaceholderText(/email/i)).toHaveValue('');
    expect(screen.getByPlaceholderText(/password/i)).toHaveValue('');
  });

  test('shows error for empty email and password', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Email and password are required!');
    });
  });

  test('shows error for invalid email format', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'invalidemail' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'ValidPass1!' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please enter a valid email address!');
    });
  });

  test('shows error for weak password', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'weakpass' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Password must be 8+ characters with uppercase, lowercase, number, and special character.'
      );
    });
  });

  test('successful login for user navigates to /Feedback', async () => {
  const history = createMemoryHistory();

  (axiosInstance.post as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
    data: {
      token: 'mockToken',
      role: 'user',
      email: 'user@example.com',
      username: 'user1',
    },
  });

  render(
    <Router location={history.location} navigator={history}>
      <Login />
    </Router>
  );

  fireEvent.change(screen.getByPlaceholderText(/email/i), {
    target: { value: 'user@example.com' },
  });

  fireEvent.change(screen.getByPlaceholderText(/password/i), {
    target: { value: 'Password1!' },
  });

  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  await waitFor(() => {
    expect(toast.success).toHaveBeenCalledWith('Login successful!');
  });

  await waitFor(() => {
    expect(history.location.pathname).toBe('/Feedback');
  },
   { timeout: 2000 }
);
  
});

  test('successful login for admin navigates to /AllFeedBacks', async () => {
  const history = createMemoryHistory();

  (axiosInstance.post as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
    data: {
      token: 'mockToken',
      role: 'admin',
      email: 'admin@example.com',
      username: 'admin1',
    },
  });

  render(
    <Router location={history.location} navigator={history}>
      <Login />
    </Router>
  );

  fireEvent.change(screen.getByPlaceholderText(/email/i), {
    target: { value: 'admin@example.com' },
  });
  fireEvent.change(screen.getByPlaceholderText(/password/i), {
    target: { value: 'Admin@1234' },
  });

  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  await waitFor(() => {
    expect(toast.success).toHaveBeenCalledWith('Login successful!');
  });

  // Wait until navigation is expected to occur
  await waitFor(
    () => {
      expect(history.location.pathname).toBe('/AllFeedBacks');
    },
    { timeout: 2000 } // allows time for setTimeout to finish
  );
});


  test('shows error toast when login API fails', async () => {
    (axiosInstance.post as unknown as ReturnType<typeof vi.fn>).mockRejectedValue({
      response: {
        data: {
          message: 'Invalid credentials',
        },
      },
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'WrongPass1!' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
    });
  });
});
