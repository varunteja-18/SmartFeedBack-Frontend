import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import './Login.css';
import axiosInstance from "../../api/axiosInstance";

export default function Login(){
    const [formData, setFormData ] = useState( {email : '', password :''});
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/auth/login", formData);

      // Save token and user info
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("role", response.data.role);

      setModalMessage("✅ Login successful!");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate(response.data.role === "admin" ? "/admin" : "/user");
      }, 1500);
    } catch (error: any) {
      setModalMessage(error.response?.data?.message || "❌ Login failed");
      setShowModal(true);
    }
  };

    const handleChange = (e: any) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
    return (
      <div className="loginContainer">
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          {showModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <p>{modalMessage}</p>
              </div>
            </div>
          )}
          {/* {error && <p className="error-color">{error}</p>} */}
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
          />
          <br />
          <button type="submit">Login</button>
          <p>
            Don't have Account? <Link to="/Register">Register</Link>
          </p>
        </form>
      </div>
    );
}