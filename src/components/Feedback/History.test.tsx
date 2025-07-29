import { render, screen, waitFor } from '@testing-library/react';
import History from './History';
import { BrowserRouter as Router } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { vi } from 'vitest';
import { toast } from 'react-toastify';

// Mock toast
vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
  },
}));

// Mock axios
vi.mock('../../api/axiosInstance');

describe('History Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders heading and table with user feedbacks', async () => {
    const mockData = [
      { username: 'user1', category: 'HR', comment: 'Great work environment.' },
      { username: 'user1', category: 'IT', comment: 'Need better tools.' },
    ];

    (axiosInstance.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: mockData,
    });

    render(
      <Router>
        <History />
      </Router>
    );

    expect(screen.getByText(/your feedback history/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('HR')).toBeInTheDocument();
      expect(screen.getByText('IT')).toBeInTheDocument();
      expect(screen.getByText('Great work environment.')).toBeInTheDocument();
      expect(screen.getByText('Need better tools.')).toBeInTheDocument();
    });
  });

  test('renders "No feedback submitted yet." when no data is returned', async () => {
    (axiosInstance.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: [],
    });

    render(
      <Router>
        <History />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(/no feedback submitted yet/i)).toBeInTheDocument();
    });
  });

  test('shows error toast on API failure', async () => {
    (axiosInstance.get as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('Network error')
    );

    render(
      <Router>
        <History />
      </Router>
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to fetch feedback history: Error: Network error');
    });
  });
});
