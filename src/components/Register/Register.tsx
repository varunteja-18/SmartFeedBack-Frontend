import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import './Login.css';


export default function Register(){
    const [formData, setFormData ] = useState( {username:'', email : '', password :''});
    const navigate = useNavigate();
    // const [error, setError] = useState('');
    const handleSubmit =(e:any) =>{
        e.preventDefault();
        localStorage.setItem('user', JSON.stringify(formData));
        alert('Registration successfull!');
        navigate('/login');  // Redirect to Login page after registration
    }
    const handleChange =(e:any) =>{
        const {name,value}=e.target;
        setFormData({...formData,[name]:value})
    }
    return(
        <div className="loginContainer">
        <form onSubmit={handleSubmit}>
            <h1>Register</h1>
            <label className="form-label">UserName</label>
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