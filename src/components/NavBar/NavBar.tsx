import { Link } from "react-router-dom";
import './Navbar.css';

export default function Navbar() {
    const userRole = localStorage.getItem("role"); // Assuming 'role' is stored in localStorage as 'admin' or 'user'

    return (
        <nav className="navbar">
            <h2 className="logo">MyApp</h2>
            <ul className="nav-links">
                {userRole === "admin" ? (
                    <>
                        <li><Link to="/AllFeedbacks">All Feedbacks</Link></li>
                        <li><Link to="/Analytics">Analytics</Link></li>
                        <li><Link to="/Login">Logout</Link></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/Feedback">Feedback</Link></li>
                        <li><Link to="/History">History</Link></li>
                        <li><Link to="/Login">Logout</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
}
