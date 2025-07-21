import { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import "./AllFeedbacks.css";

interface FeedbackItem {
  username: string;
  category: string;
  comment: string;
}

const AllFeedBacks = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);

  useEffect(() => {
    const storedFeedbacks = localStorage.getItem("allFeedbacks");
    if (storedFeedbacks) {
      setFeedbacks(JSON.parse(storedFeedbacks));
    }
  }, []);

  return (
    <>
      <NavBar />
      <div className="all-feedbacks-container">
        <h2>All User Feedbacks</h2>
        {feedbacks.length > 0 ? (
          <table className="feedback-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Category</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((feedback, index) => (
                <tr key={index}>
                  <td>{feedback.username}</td>
                  <td>{feedback.category}</td>
                  <td>{feedback.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No feedbacks submitted yet.</p>
        )}
      </div>
    </>
  );
};

export default AllFeedBacks;
