import { useState } from 'react';
import NavBar from '../NavBar/NavBar'
import './Feedback.css'

const Feedback = () => {
  const [formData, setFormData ] = useState( {category:'', comment:'' });
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const handleSubmit = (event:any) => {
    event.preventDefault();
    localStorage.setItem('feedback',JSON.stringify(formData));
    setModalMessage('✅ feedback successfull!');
        setShowModal(true);
        setFormData({ category: '', comment: '' });
        setTimeout(() => { setShowModal(false); }, 1500);
    // alert("feedback successfull");
    
    // console.log(formData);
    // console.log(event.target.comment.value);
  };
  const handleChange =(e:any) =>{
          const {name,value}=e.target;
          setFormData({...formData,[name]:value})
      };
  return (
    <>
      <NavBar />
      <div className="Feedback">
        <form onSubmit={handleSubmit}>
          <h2>Feedback</h2>
          {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p>{modalMessage}</p>
                    </div>
                </div>
            )}
          <label htmlFor="dropdown">Choose Category:</label>
          <select
            // value="{selectedOption}"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">--Select--</option>
            <option value="HR">HR</option>
            <option value="IT">IT</option>
            <option value="Manager">Manager</option>
          </select>
          <br />
          <label htmlFor="comment">Comment:</label>
          <textarea
            id="comment"
            name="comment"
             value={formData.comment}
            onChange={handleChange}
            placeholder="Write your feedback here..."
          ></textarea>
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}

export default Feedback