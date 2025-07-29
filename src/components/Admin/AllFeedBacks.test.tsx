import { render, screen, waitFor } from '@testing-library/react';
import AllFeedBacks from './AllFeedBacks';
import { BrowserRouter as Router } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { vi } from 'vitest';

vi.mock('../../api/axiosInstance');

// Mock useNavigate
const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual: any = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe('AllFeedBacks Component - Admin Feedback View', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders heading correctly', () => {
    render(
      <Router>
        <AllFeedBacks />
      </Router>
    );
    expect(screen.getAllByText(/User/i).length).toBeGreaterThan(0);
  });

  test('renders table with all feedbacks when API returns data', async () => {
    const mockData = [
      { username: 'admin1', category: 'HR', comment: 'Great environment' },
      { username: 'user123', category: 'IT', comment: 'Need better systems' },
    ];

    (axiosInstance.get as any).mockResolvedValue({ data: mockData });

    render(
      <Router>
        <AllFeedBacks />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('admin1')).toBeInTheDocument();
      expect(screen.getByText('user123')).toBeInTheDocument();
      expect(screen.getByText('HR')).toBeInTheDocument();
      expect(screen.getByText('IT')).toBeInTheDocument();
      expect(screen.getByText('Great environment')).toBeInTheDocument();
      expect(screen.getByText('Need better systems')).toBeInTheDocument();
    });
  });

  test('displays message when no feedbacks are returned', async () => {
    (axiosInstance.get as any).mockResolvedValue({ data: [] });

    render(
      <Router>
        <AllFeedBacks />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(/No feedbacks submitted yet/i)).toBeInTheDocument();
    });
  });

  test('displays error when API call fails (403 or 500)', async () => {
    (axiosInstance.get as any).mockRejectedValue(new Error('Forbidden'));

    render(
      <Router>
        <AllFeedBacks />
      </Router>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Failed to load feedbacks. You may not be authorized/i)
      ).toBeInTheDocument();
    });
  });

  test('renders table headers correctly', async () => {
    const mockData = [
      { username: 'admin', category: 'HR', comment: 'Feedback' },
    ];
    (axiosInstance.get as any).mockResolvedValue({ data: mockData });

    render(
      <Router>
        <AllFeedBacks />
      </Router>
    );

    await waitFor(() => {
    expect(screen.getAllByText(/User/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Category/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Feedback/i).length).toBeGreaterThan(0);

});

  });

  test('does not render table when error occurs', async () => {
    (axiosInstance.get as any).mockRejectedValue(new Error('Internal Server Error'));

    render(
      <Router>
        <AllFeedBacks />
      </Router>
    );

    await waitFor(() => {
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });
  });

  // Optional: for role-based routing
  test.skip('redirects if user is not an admin (based on localStorage)', async () => {
    localStorage.setItem('role', 'user'); // simulate non-admin

    render(
      <Router>
        <AllFeedBacks />
      </Router>
    );

    await waitFor(() => {
      // expect some kind of redirect message or navigate call (if implemented)
    });
  });
});
