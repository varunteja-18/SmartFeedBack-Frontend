import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import './Register.css';


export default function Register(){
    const [formData, setFormData ] = useState( {username:'', email : '', password :''});
    // useEffect(() => { setFormData({username:'', email: '', password: '' });}, []);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    // const [error, setError] = useState('');
    const handleSubmit =(e:any) =>{
        e.preventDefault();
        localStorage.setItem('user', JSON.stringify(formData));
        setModalMessage('✅ Registration successfull!');
        setShowModal(true);
        setTimeout(() => {
                    setShowModal(false);
                    navigate("/login");  // Redirect to Login page after registration
                }, 1500);
    }
    const handleChange =(e:any) =>{
        const {name,value}=e.target;
        setFormData({...formData,[name]:value})
    }
    return(
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
            type="username"
            name="username"
            onChange={handleChange}
            value={formData.username}
            placeholder="Name"
            required
             />
             <br/>
            <label className="form-label">Email address</label>
            <input 
            type="email"
            name="email"
            onChange={handleChange}
            value={formData.email}
            placeholder="email"
            required
             />
             <br/>
            <label className="form-label">Password</label>
             <input 
            type="password"
            name="password"
            onChange={handleChange}
            value={formData.password}
            placeholder="password"
            required
             />
             <br/>
             <button type="submit">Register</button>
             <p>Already Registered ? <Link to="/Login">Login</Link></p>
        </form>
        </div>
    )
}