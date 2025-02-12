import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Admin.css";
import { FaShoppingCart, FaChartLine, FaUsers, FaCog } from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#8884d8", "#ffc658", "#82ca9d"];

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalSubmissions: 0,
    pendingSubmissions: 0,
    completedSubmissions: 0,
    totalUsers: 0,
    recentSubmissions: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get("http://localhost:3000/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const statusData = [
    { name: "Submitted", value: dashboardData.totalSubmissions },
    { name: "Pending", value: dashboardData.pendingSubmissions },
    { name: "Completed", value: dashboardData.completedSubmissions },
  ];

  const StatusPieChart = () => {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={statusData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
          >
            {statusData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-content">
        <div className="admin-dashboard-metrics">
          <div className="admin-metric-card">
            <div className="metric-icon">
              <FaShoppingCart />
            </div>
            <h2>Total Submissions</h2>
            <p>{dashboardData.totalSubmissions}</p>
          </div>
          <div className="admin-metric-card">
            <div className="metric-icon">
              <FaChartLine />
            </div>
            <h2>Pending Submissions</h2>
            <p>{dashboardData.pendingSubmissions}</p>
          </div>
          <div className="admin-metric-card">
            <div className="metric-icon">
              <FaCog />
            </div>
            <h2>Completed Submissions</h2>
            <p>{dashboardData.completedSubmissions}</p>
          </div>
          <div className="admin-metric-card">
            <div className="metric-icon">
              <FaUsers />
            </div>
            <h2>Total Users</h2>
            <p>{dashboardData.totalUsers}</p>
          </div>
        </div>

        <div className="admin-dashboard-details">
          <section className="admin-status-piechart">
            <h2>Submission Status Overview</h2>
            <div className="graph-container">
              <StatusPieChart />
            </div>
          </section>
        </div>

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
                {dashboardData.recentSubmissions.length > 0 ? (
                  dashboardData.recentSubmissions.map((submission) => (
                    <tr key={submission._id}>
                      <td>{submission._id}</td>
                      <td>{submission.userId?.fullName || "Unknown"}</td>
                      <td className={submission.status === "Pending" ? "pending-status" : "completed-status"}>
                        {submission.status}
                      </td>
                      <td>{submission.numberOfClothes}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No recent submissions available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
