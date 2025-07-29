import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import axiosInstance from "../../api/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const { username, email, password } = formData;

    // Email and password regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!username || !email || !password) {
      toast.error("All fields are required!");
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
      const response = await axiosInstance.post("/auth/register", formData);
      toast.success(response.data.message || "Registration successful!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="RegisterContainer">
      <form onSubmit={handleSubmit}>
        <ToastContainer position="top-right" autoClose={3000} />
        <h1>Register</h1>

        <label htmlFor="username" className="form-label">User Name</label>
        <input
          id="username"
          type="text"
          name="username"
          onChange={handleChange}
          value={formData.username}
          placeholder="Name"
          // required
        />
        <br />
        <label htmlFor="email" className="form-label">Email address</label>
        <input
          id="email"
          type="text"
          name="email"
          onChange={handleChange}
          value={formData.email}
          placeholder="Email"
          // required
        />
        <br />
        <label htmlFor="password" className="form-label">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          onChange={handleChange}
          value={formData.password}
          placeholder="Password"
          // required
        />
        <br />
        <button type="submit">Register</button>
        <p>
          Already Registered? <Link to="/Login">Login</Link>
        </p>
      </form>
    </div>
  );
}
