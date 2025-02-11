import React, { useState, useEffect } from "react";
import { FaHome, FaUsers, FaSyncAlt, FaBell, FaSignOutAlt, FaUserCircle, FaMoon, FaSun } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import swal from 'sweetalert';
import "../styles/Admin.css";
import EditUsers from "./EditUsers";
import LaundryStatusUpdate from "./LaundryStatusUpdate";
import Dashboard from "./Dashboard";

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user || user.role !== "admin") {
      swal({
        title: "Access Denied",
        text: "You must be an admin to view this page.",
        icon: "error",
        button: "OK",
      });
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    swal({
      title: "You have been logged out!",
      icon: "success",
      button: "OK",
    });

    navigate("/login");
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case "Dashboard":
        return <Dashboard />;
      case "Edit Users":
        return <EditUsers />;
      case "Update Status":
        return <LaundryStatusUpdate />; // Render the UpdateLaundryStatus component
      default:
        return (
          <section className="admin-section">
            {/* <h2>Welcome to the Admin Dashboard</h2> */}
          </section>
        );
    }
  };

  return (
    <div className={`admin-dashboard ${darkMode ? "dark-mode" : "light-mode"}`}>
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <img src="/logo.png" alt="Logo" className="sidebar-logo-img" />
          <h2 className="sidebar-logo-text">Spin & Shine</h2>
        </div>
        <ul className="sidebar-menu">
          <li
            className={`sidebar-item ${activeSection === "Dashboard" ? "active" : ""}`}
            onClick={() => setActiveSection("Dashboard")}
          >
            <FaHome className="sidebar-icon" /> Dashboard
          </li>
          <li
            className={`sidebar-item ${activeSection === "Edit Users" ? "active" : ""}`}
            onClick={() => setActiveSection("Edit Users")}
          >
            <FaUsers className="sidebar-icon" /> Edit Users
          </li>
          <li
            className={`sidebar-item ${activeSection === "Update Status" ? "active" : ""}`}
            onClick={() => setActiveSection("Update Status")}
          >
            <FaSyncAlt className="sidebar-icon" /> Update Laundry Status
          </li>
        </ul>
        <div className="sidebar-footer">
          <button className="sidebar-logout" onClick={handleLogout}>
            <FaSignOutAlt className="sidebar-icon" /> Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <nav className="admin-navbar">
          <div className="navbar-section">
            <h1 className="navbar-heading">{activeSection}</h1>
          </div>
          <div className="navbar-actions">
            <button className="navbar-theme-toggle" onClick={toggleDarkMode}>
              {darkMode ? <FaSun className="navbar-icon" /> : <FaMoon className="navbar-icon" />}
            </button>
            {/* <button className="navbar-profile">
              <FaUserCircle className="navbar-icon" /> Profile
            </button> */}
          </div>
        </nav>
        {renderSectionContent()}
      </main>
    </div>
  );
}

export default AdminDashboard;
