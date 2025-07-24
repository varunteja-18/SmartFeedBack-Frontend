import { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import "./AllFeedbacks.css";
import axiosInstance from "../../api/axiosInstance";

interface FeedbackItem {
  username: string;
  category: string;
  comment: string;
}

const AllFeedBacks = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axiosInstance.get("/feedback/all"); 
        setFeedbacks(response.data);
      } catch (err: any) {
        console.error("Failed to fetch feedbacks:", err);
        setError("Failed to load feedbacks. You may not be authorized.");
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <>
      <NavBar />
      <div className="all-feedbacks-container">
        <h2>All User Feedbacks</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

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
        ) : !error ? (
          <p>No feedbacks submitted yet.</p>
        ) : null}
      </div>
    </>
  );
};

export default AllFeedBacks;
