import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import './Login.css';

export default function Login(){
    const [formData, setFormData ] = useState( {email : '', password :''});
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleSubmit =(e:any) =>{
        e.preventDefault();
        // console.log(e.target.email.value);
        const storedUserString = localStorage.getItem('user');
        if(storedUserString)
        {
            const storedUser = JSON.parse(storedUserString);
            if(storedUser && storedUser.email === formData.email && storedUser.password === formData.password)
            {
                alert("login succefull");
                navigate("/Dashboard");
            }
            else{
                setError("Invalid email or password");
            }
        }
        else{
            setError("User not found. Please register first.");
        }
        
    }
    const handleChange =(e:any) =>{
        const {name,value}=e.target;
        setFormData({...formData,[name]:value})
    }
    return(
        <div className="loginContainer">
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            {error && <p>{error}</p>}
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
             <button type="submit">Login</button>
             <p>Don't have Account? <Link to="/Register">Register</Link></p>
        </form>
        </div>
    )
}