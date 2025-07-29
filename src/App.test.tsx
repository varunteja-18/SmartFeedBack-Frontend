import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';
import { MemoryRouter } from 'react-router-dom';

describe('App Routing', () => {
  it('redirects "/" to "/Login"', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('renders Register page', () => {
    render(
      <MemoryRouter initialEntries={['/Register']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/User Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

  });

  it('renders Feedback page', () => {
    render(
      <MemoryRouter initialEntries={['/Feedback']}>
        <App />
      </MemoryRouter>
    );
    // Prefer unique and reliable queries
  expect(screen.getByLabelText(/choose category/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/feedback:/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it('renders History page', () => {
    render(
      <MemoryRouter initialEntries={['/History']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/feedback history/i)).toBeInTheDocument();
  });

  it('renders AllFeedbacks page', () => {
    render(
      <MemoryRouter initialEntries={['/AllFeedbacks']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/all user feedbacks/i)).toBeInTheDocument();
  });

  it('renders Analytics page', () => {
    render(
      <MemoryRouter initialEntries={['/Analytics']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Feedback Category Distribution/i)).toBeInTheDocument();
  });

  it('handles unknown route and shows 404 page', () => {
    render(
      <MemoryRouter initialEntries={['/unknown']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/404|page not found/i)).toBeInTheDocument();
  });
});
