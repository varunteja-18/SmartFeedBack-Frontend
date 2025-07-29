import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import axiosInstance from "../../api/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const { email, password } = formData;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!email || !password) {
      toast.error("Email and password are required!");
      return;
    }

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address!");
      return;
    }

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be 8+ characters with uppercase, lowercase, number, and special character."
      );
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/login", formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      const userData = {
        email: response.data.email,
        username: response.data.username,
      };
      localStorage.setItem("user", JSON.stringify(userData));

      toast.success("Login successful!");
      setTimeout(() => {
        navigate(
          response.data.role === "admin" ? "/AllFeedBacks" : "/Feedback"
        );
      }, 1500);
    } catch (error: any) {
      toast.error(error.response?.data?.message || " Login failed");
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="loginContainer">
      <form onSubmit={handleSubmit}>
        <ToastContainer position="top-right" autoClose={3000} />
        <h1>Login</h1>

        <label className="form-label">Email address</label>
        <input
          type="text"
          name="email"
          onChange={handleChange}
          value={formData.email}
          placeholder="Email"
          // required
        />
        <br />

        <label className="form-label">Password</label>
        <input
          type="password"
          name="password"
          onChange={handleChange}
          value={formData.password}
          placeholder="Password"
          // required
        />
        <br />

        <button type="submit">Login</button>
        <p>
          Don't have an account? <Link to="/Register">Register</Link>
        </p>
      </form>
    </div>
  );
}
