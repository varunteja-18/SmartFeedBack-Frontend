import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import Navbar from "./NavBar";

describe("Navbar Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  test("renders navbar with admin links when role is admin", () => {
    localStorage.setItem("role", "admin");

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText("Smart FeedBack")).toBeInTheDocument();
    expect(screen.getByText("All Feedbacks")).toBeInTheDocument();
    expect(screen.getByText("Analytics")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();

    // Ensure user links are not shown
    expect(screen.queryByText("Feedback")).not.toBeInTheDocument();
    expect(screen.queryByText("History")).not.toBeInTheDocument();
  });

  test("renders navbar with user links when role is user", () => {
    localStorage.setItem("role", "user");

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText("Smart FeedBack")).toBeInTheDocument();
    expect(screen.getByText("Feedback")).toBeInTheDocument();
    expect(screen.getByText("History")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();

    // Ensure admin links are not shown
    expect(screen.queryByText("All Feedbacks")).not.toBeInTheDocument();
    expect(screen.queryByText("Analytics")).not.toBeInTheDocument();
  });

  test("renders user links when no role is found", () => {
    // No role in localStorage
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    // Defaults to user links
    expect(screen.getByText("Feedback")).toBeInTheDocument();
    expect(screen.getByText("History")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  test("logo is displayed always", () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    expect(screen.getByText("Smart FeedBack")).toBeInTheDocument();
  });
});
