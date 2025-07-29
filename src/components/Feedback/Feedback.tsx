import { useState } from 'react';
import NavBar from '../NavBar/NavBar'
import './Feedback.css'
import axiosInstance from '../../api/axiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Feedback = () => {
  const [formData, setFormData ] = useState( {category:'', comment:'' });
  // const [showModal, setShowModal] = useState(false);
  // const [modalMessage, setModalMessage] = useState('');

const handleSubmit = async (event: any) => {
  event.preventDefault();

  // try {
  //   await axiosInstance.post("/feedback", formData); // API endpoint must exist in backend

  //   setModalMessage("✅ Feedback submitted successfully!");
  //   setShowModal(true);
  //   setFormData({ category: "", comment: "" });

  //   setTimeout(() => setShowModal(false), 1500);
  // } catch (error) {
  //   setModalMessage("❌ Submission failed. Try again.");
  //   setShowModal(true);
  //   setTimeout(() => setShowModal(false), 2000);
  // }
   if (!formData.category || !formData.comment.trim()) {
    toast.warning(" Please select a category and write your feedback.");
    return;
  }
  try {
      await axiosInstance.post("/feedback", formData);
      toast.success("Feedback submitted successfully!");
      setFormData({ category: "", comment: "" });
    } catch (error) {
      toast.error("Submission failed. Try again.");
    }
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
          {/* {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p>{modalMessage}</p>
                    </div>
                </div>
            )} */}
          <label htmlFor="category">Choose Category:</label>
          <select
            // value="{selectedOption}"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            // required
          >
            <option value="">--Select--</option>
            <option value="HR">HR</option>
            <option value="IT">IT</option>
            <option value="Manager">Manager</option>
          </select>
          <br />
          <label htmlFor="comment">Feedback:</label>
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
      {/* Toast notification container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default Feedback