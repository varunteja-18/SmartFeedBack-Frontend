import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import './Login.css';

export default function Login(){
    const [formData, setFormData ] = useState( {email : '', password :''});
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const navigate = useNavigate();
    const handleSubmit =(e:any) =>{
        e.preventDefault();
        // console.log(e.target.email.value);
        const storedUserString = localStorage.getItem('user');
        if(storedUserString)
        {
            const storedUser = JSON.parse(storedUserString);
            if (storedUser.email === formData.email && storedUser.password === formData.password) {
                setModalMessage('✅ Login Successful!');
                setShowModal(true);
                setTimeout(() => {
                    setShowModal(false);
                    navigate("/Dashboard");
                }, 1500);
            } 
            else if(!(storedUser.email === formData.email && storedUser.password === formData.password)) {
                setModalMessage('❌ Invalid Email or Password');
                setShowModal(true);
                setTimeout(() => setShowModal(false), 1500);
            }
            else if (formData.email==="admin@gmail.com" && formData.password==="admin@123") {
                setModalMessage('✅ Admin Login Successful!');
                setShowModal(true);
                setTimeout(() => {
                    setShowModal(false);
                    navigate("/AdminDashboard");
                }, 1500);
            } else {
                setModalMessage('❌ Invalid Email or Password');
                setShowModal(true);
                setTimeout(() => setShowModal(false), 1500);
            }
        } else {
            setModalMessage('❌ User not found. Please register first.');
            setShowModal(true);
            setTimeout(() => setShowModal(false), 1500);
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