import { useEffect, useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Sector,
} from "recharts";
import NavBar from "../NavBar/NavBar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CSVLink } from "react-csv";
import "./Analytics.css";
import axiosInstance from "../../api/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FeedbackItem {
  username: string;
  category: string;
  comment: string;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// Custom active shape (no stroke box)
const renderActiveShape = (props: any) => {
  return <Sector {...props} stroke="none" />;
};

const Analytics = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  // const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(-1); // use -1 instead of null


  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axiosInstance.get("/feedback/all");
        setFeedbacks(response.data);
      } catch (error) {
        console.error("Failed to fetch feedbacks:", error);
      }
    };

    fetchFeedbacks();
  }, []);

  const pieData = useMemo(() => {
    const categoryCount: { [key: string]: number } = {};
    feedbacks.forEach((fb) => {
      categoryCount[fb.category] = (categoryCount[fb.category] || 0) + 1;
    });

    return Object.keys(categoryCount).map((key) => ({
      name: key,
      value: categoryCount[key],
    }));
  }, [feedbacks]);

  const handlePieClick = (_: any, index: number) => {
    setActiveIndex(index);
    setSelectedCategory(pieData[index].name);
  };

  const handleClearSelection = () => {
    setSelectedCategory(null);
    setActiveIndex(-1); // reset to -1
    toast.info("Selection cleared.");
  };

  const filteredFeedbacks = selectedCategory
    ? feedbacks.filter((fb) => fb.category === selectedCategory)
    : [];

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Feedbacks in "${selectedCategory}"`, 10, 10);
    const rows = filteredFeedbacks.map((fb) => [
      fb.username,
      fb.category,
      fb.comment,
    ]);
    autoTable(doc, {
      head: [["User", "Category", "Feedback"]],
      body: rows,
    });
    doc.save(`feedbacks_${selectedCategory}.pdf`);
    toast.success("📄 PDF exported successfully!");
  };

  return (
    <>
      <NavBar />
      <div className="analytics-container">
        <h2>Feedback Category Distribution</h2>
        <p className="total-count">📊 Total Feedbacks: {feedbacks.length}</p>

        {pieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={450}>
            <PieChart>
              <Pie
                dataKey="value"
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={130}
                label
                onClick={handlePieClick}
                // activeIndex={activeIndex}
                activeShape={renderActiveShape}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="none"
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p>No feedbacks available to analyze.</p>
        )}

        {selectedCategory && (
          <div className="feedback-table-section">
            <h3>Feedbacks in "{selectedCategory}"</h3>
            <div className="btn-row">
              <button onClick={handleClearSelection} className="btn clear-btn">
                Clear Selection
              </button>
              <button onClick={handleExportPDF} className="btn pdf-btn">
                Export PDF
              </button>
              <CSVLink
                data={filteredFeedbacks}
                headers={[
                  { label: "User", key: "username" },
                  { label: "Category", key: "category" },
                  { label: "Feedback", key: "comment" },
                ]}
                filename={`feedbacks_${selectedCategory}.csv`}
                className="btn csv-btn"
                onClick={() => toast.success("📁 CSV export initiated!")}
              >
                Export CSV
              </CSVLink>
            </div>

            <table className="feedback-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Category</th>
                  <th>Feedback</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeedbacks.map((fb, index) => (
                  <tr key={index}>
                    <td>{fb.username}</td>
                    <td>{fb.category}</td>
                    <td>{fb.comment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
};

export default Analytics;
