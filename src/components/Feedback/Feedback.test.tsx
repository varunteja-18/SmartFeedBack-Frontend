import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import Feedback from './Feedback';
import { BrowserRouter } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { vi } from 'vitest';
import { toast } from 'react-toastify';

// Mock toast
vi.mock('react-toastify', async () => {
  const mod = await vi.importActual<typeof import('react-toastify')>('react-toastify');
  return {
    ...mod,
    toast: {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
    },
  };
});

// Mock axiosInstance
vi.mock('../../api/axiosInstance');

describe('Feedback Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders form elements correctly', () => {
    render(
      <BrowserRouter>
        <Feedback />
      </BrowserRouter>
    );
    // const form = screen.getByRole('form'); // This might not work directly if your form doesn't have a role
    // // Safer fallback:
    // const formElement = screen.getByText(/choose category/i).closest('form');
    // const formScope = within(formElement!);
    // expect(screen.getByRole('heading', { name: /feedback/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/choose category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/feedback:/i)).toBeInTheDocument(); // For textarea
    expect(screen.getByPlaceholderText(/write your feedback here/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('shows warning if fields are empty', async () => {
    render(
      <BrowserRouter>
        <Feedback />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(toast.warning).toHaveBeenCalledWith(' Please select a category and write your feedback.');
    });
  });

  test('submits form and shows success toast', async () => {
    (axiosInstance.post as any).mockResolvedValue({ data: { success: true } });

    render(
      <BrowserRouter>
        <Feedback />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/choose category/i), {
      target: { value: 'HR' },
    });

    fireEvent.change(screen.getByPlaceholderText(/write your feedback here/i), {
      target: { value: 'Great support from HR team.' },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith('/feedback', {
        category: 'HR',
        comment: 'Great support from HR team.',
      });
      expect(toast.success).toHaveBeenCalledWith('Feedback submitted successfully!');
    });
  });

  test('shows error toast on submission failure', async () => {
    (axiosInstance.post as any).mockRejectedValue(new Error('Network error'));

    render(
      <BrowserRouter>
        <Feedback />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/choose category/i), {
      target: { value: 'IT' },
    });

    fireEvent.change(screen.getByPlaceholderText(/write your feedback here/i), {
      target: { value: 'System issue not resolved.' },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Submission failed. Try again.');
    });
  });
});