import { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import "./History.css";
import axiosInstance from "../../api/axiosInstance";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FeedbackItem {
  username: string;
  category: string;
  comment: string;
}

const History = () => {
  const [userFeedbacks, setUserFeedbacks] = useState<FeedbackItem[]>([]);
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axiosInstance.get("/feedback/user"); // API must return user's feedback
        setUserFeedbacks(response.data);
      } catch (error) {
        // console.error("Failed to fetch feedback history", error);
        toast.error("Failed to fetch feedback history: "+error);
      }
    };

    fetchFeedback();
  }, []);

  return (
    <>
      <NavBar />
      <div className="history-container">
        <h2>Your Feedback History</h2>
        {userFeedbacks.length > 0 ? (
          <table className="feedback-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Feedback</th>
              </tr>
            </thead>
            <tbody>
              {userFeedbacks.map((feedback, index) => (
                <tr key={index}>
                  <td>{feedback.category}</td>
                  <td>{feedback.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No feedback submitted yet.</p>
        )}
      </div>
    </>
  );
};

export default History;
