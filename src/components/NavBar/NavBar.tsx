import { Link } from "react-router-dom";
import './Navbar.css';

export default function Navbar() {
    return (
        <nav className="navbar">
            <h2 className="logo">MyApp</h2>
            <ul className="nav-links">
                {/* <li><Link to="/">Home</Link></li> */}
                <li><Link to="/Feedback">Feedback</Link></li>
                <li><Link to="/History">History</Link></li>
                <li><Link to="/Login">Logout</Link></li>
            </ul>
        </nav>
    );
}
