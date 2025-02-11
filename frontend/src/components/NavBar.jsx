import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.png";
import "../styles/NavBar.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";

const NavBar = ({ onToggleMenu }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser ? storedUser.id : null;

      if (userId) {
        setLoading(true);
        try {
          const response = await axios.get(
            `http://localhost:3000/api/notifications/user/${userId}`
          );
          setNotifications(response.data);
          setError(null);
        } catch (err) {
          console.error("Error fetching notifications:", err);
          setError("Failed to load notifications");
        } finally {
          setLoading(false);
        }
      } else {
        setNotifications([]);
        console.log("User ID is missing or incorrect in localStorage");
      }
    };

    if (isLoggedIn) {
      fetchNotifications();
    } else {
      setNotifications([]);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (onToggleMenu) {
      onToggleMenu(!isMenuOpen);
    }
  };

  const toggleDropdown = (event) => {
    event.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  };

  const markAsRead = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser ? storedUser.id : null;
  
      if (!userId) {
        console.error("User ID is missing. Cannot mark notifications as read.");
        return;
      }
  
      const response = await axios.put(
        `http://localhost:3000/api/notifications/markAsRead/${userId}`
      );
  
      console.log(response.data.message); // Log the server response
    } catch (err) {
      console.error("Error marking notifications as read:", err);
    }
  };
  
  const deleteRead = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser ? storedUser.id : null;
  
      if (!userId) {
        console.error("User ID is missing. Cannot delete read notifications.");
        return;
      }
  
      const response = await axios.delete(
        `http://localhost:3000/api/notifications/deleteRead/${userId}`
      );
  
      console.log(response.data.message); // Log the server response
    } catch (err) {
      console.error("Error deleting read notifications:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setNotifications([]);
    setError(null);
    setLoading(false);
    navigate("/Login");
  };

  const hasUnreadNotifications = notifications.some(
    (notification) => !notification.isRead
  );

  return (
    <div className={`navbar-container ${isMenuOpen ? "menu-open" : ""}`}>
      <div className="navbar-header">
        <Link to="/">
          <img src={logo} alt="Logo" className="nav-logo" />
        </Link>
        <button className="menu-toggle" onClick={toggleMenu}>
          <i
            className={isMenuOpen ? "bi bi-x" : "bi bi-list"}
            style={{ color: "#00b4d8" }}
          ></i>
        </button>
      </div>

      <nav className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "nav-links active" : "nav-links"
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/Contact"
              className={({ isActive }) =>
                isActive ? "nav-links active" : "nav-links"
              }
            >
              Contact
            </NavLink>
          </li>

          {!isLoggedIn ? (
            <li>
              <NavLink
                to="/Login"
                className={({ isActive }) =>
                  isActive ? "nav-links active" : "nav-links"
                }
              >
                Login
              </NavLink>
            </li>
          ) : (
            <li>
              <NavLink
                to="/Choose"
                className={({ isActive }) =>
                  isActive ? "nav-links active" : "nav-links"
                }
              >
                Submit Laundry
              </NavLink>
            </li>
          )}

          <li>
            <div className="navbar-icons">
              <div
                className="notification-bell"
                ref={dropdownRef}
                onClick={toggleDropdown}
              >
                <i className="bi bi-bell"></i>
                {hasUnreadNotifications && (
                  <span className="notification-dot"></span>
                )}
                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    {loading ? (
                      <p>Loading notifications...</p>
                    ) : error ? (
                      <p>{error}</p>
                    ) : notifications.length === 0 ? (
                      <p>No new notifications</p>
                    ) : (
                      <ul className="notification-class">
                        {notifications.map((notification) => (
                          <li
                            key={notification._id}
                            className={`notification-item ${
                              notification.isRead ? "read" : "unread"
                            }`}
                          >
                            <p className="notification-message">{notification.message}</p>
                            <small>
                              {new Date(notification.createdAt).toLocaleString()}
                            </small>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="dropdown-actions">
                      <button
                        className="dropdown-action-button"
                        onClick={markAsRead}
                        disabled={notifications.every((n) => n.isRead)}
                      >
                        Mark All as Read
                      </button>
                      <button
                        className="dropdown-action-button"
                        onClick={deleteRead}
                        disabled={notifications.every((n) => !n.isRead)}
                      >
                        Delete Read
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <Link to="/Profile">
                <i className="bi bi-person"></i>
              </Link>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
