import { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import "./History.css";

interface FeedbackItem {
  username: string;
  category: string;
  comment: string;
}

const History = () => {
  const [userFeedbacks, setUserFeedbacks] = useState<FeedbackItem[]>([]);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const allFeedbacks = JSON.parse(
      localStorage.getItem("allFeedbacks") || "[]"
    );

    const filtered = allFeedbacks.filter(
      (feedback: FeedbackItem) => feedback.username === currentUser.username
    );

    setUserFeedbacks(filtered);
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
                <th>Comment</th>
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
