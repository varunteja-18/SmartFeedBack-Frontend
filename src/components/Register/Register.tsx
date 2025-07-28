import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import axiosInstance from "../../api/axiosInstance";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setModalMessage(
        "❌ Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/register", formData);
      setModalMessage(response.data.message || "✅ Registration successful!");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate("/login");
      }, 1500);
    } catch (error: any) {
      setModalMessage(
        error.response?.data?.message || "❌ Registration failed"
      );
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate("/Register");
      }, 1500);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="RegisterContainer">
      <form onSubmit={handleSubmit}>
        <h1>Register</h1>
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <p>{modalMessage}</p>
            </div>
          </div>
        )}
        <label className="form-label">User Name</label>
        <input
          type="text"
          name="username"
          onChange={handleChange}
          value={formData.username}
          placeholder="Name"
          required
        />
        <br />
        <label className="form-label">Email address</label>
        <input
          type="email"
          name="email"
          onChange={handleChange}
          value={formData.email}
          placeholder="email"
          required
        />
        <br />
        <label className="form-label">Password</label>
        <input
          type="password"
          name="password"
          onChange={handleChange}
          value={formData.password}
          placeholder="password"
          required
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$"
          title="Use 8+ characters with uppercase, lowercase, number, and special character"
        />
        <br />
        <button type="submit">Register</button>
        <p>
          Already Registered ? <Link to="/Login">Login</Link>
        </p>
      </form>
    </div>
  );
}
