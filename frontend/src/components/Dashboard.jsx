import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Admin.css";
import { FaShoppingCart, FaChartLine, FaUsers, FaCog } from "react-icons/fa";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalSubmissions: 0,
    pendingSubmissions: 0,
    completedSubmissions: 0,
    totalUsers: 0, // Added field for total users
    recentSubmissions: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get("http://localhost:3000/api/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  return (
    <div className="admin-dashboard-container">
      {/* Main Content */}
      <div className="admin-content">
        {/* Metrics Section */}
        <div className="admin-dashboard-metrics">
          <div className="admin-metric-card">
            <h2>Total Submissions</h2>
            <p>{dashboardData.totalSubmissions}</p>
          </div>
          <div className="admin-metric-card">
            <h2>Pending Submissions</h2>
            <p>{dashboardData.pendingSubmissions}</p>
          </div>
          <div className="admin-metric-card">
            <h2>Completed Submissions</h2>
            <p>{dashboardData.completedSubmissions}</p>
          </div>
          <div className="admin-metric-card">
            <h2>Total Users</h2> {/* Added Total Users */}
            <p>{dashboardData.totalUsers}</p>
          </div>
        </div>

        {/* Recent Submissions Section */}
        <div className="admin-dashboard-details">
          <section className="admin-recent-submissions">
            <h2>Recent Submissions</h2>
            <table className="admin-submission-table">
              <thead>
                <tr>
                  <th>Submission ID</th>
                  <th>Student Name</th>
                  <th>Status</th>
                  <th>Items</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentSubmissions.map((submission) => (
                  <tr key={submission._id}>
                    <td>{submission._id}</td>
                    <td>{submission.userId?.fullName || "Unknown"}</td>
                    <td className={submission.status === "Pending" ? "pending-status" : "completed-status"}>
                      {submission.status}
                    </td>
                    <td>{submission.numberOfClothes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
