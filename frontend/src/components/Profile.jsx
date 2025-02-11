import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const navigate = useNavigate(); // For navigation

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    roomNumber: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/users/profile", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUser(data);
        setFormData({
          fullName: data.fullName,
          email: data.email,
          phone: data.phone || "",
          roomNumber: data.roomNumber || "",
        });
      } catch (err) {
        setErrorMessage(err.message || "An error occurred while fetching the user data.");
        localStorage.removeItem("token"); // Clear invalid token
        navigate("/login"); // Redirect to login
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,  // Update the specific field
    }));
  };
  

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formData.fullName || !formData.email) {
      setErrorMessage("Name and Email are required!");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        setErrorMessage("Unauthorized. Please log in again.");
        navigate("/login");
        return;
      }
  
      // Send update request to the server
      const response = await fetch("http://localhost:3000/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData), // Send form data
      });
  
      if (response.ok) {
        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          setUser(data); // Update the user state with the response data
          setEditMode(false); // Exit edit mode
          setErrorMessage(""); // Clear any existing error messages
        } else {
          console.error("Expected JSON, but got", response);
        }
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Error:", err);
      setErrorMessage(err.message || "An error occurred while updating your profile.");
    }
  };
  
  
  

  const handlePasswordSave = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage("New password and confirmation do not match.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      
      // Send only password-related data (not the full form data)
      const response = await fetch("http://localhost:3000/api/users/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error changing password:", errorData);
        setErrorMessage(errorData.message || "Failed to change password.");
        return;
      }
  
      setPasswordMode(false);
      setErrorMessage(""); // Clear any existing error messages
    } catch (err) {
      console.error("Error:", err);
      setErrorMessage(err.message || "An error occurred while changing the password.");
    }
  };
  
  
  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setPasswordMode(false);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone || "",
      roomNumber: user.roomNumber || "",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  if (!user) {
    return <p className="error-message">{errorMessage || "Loading..."}</p>;
  }

  return (
    <div className="profile-container">
      <h2 className="profile-heading">Profile</h2>

      {editMode ? (
        <div className="edit-form">
          <label>
            Name:
            <input
              className="input-field"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Email:
            <input
              className="input-field"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Phone Number:
            <input
              className="input-field"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Room Number:
            <input
              className="input-field"
              type="text"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
            />
          </label>
          <br />
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button className="save-btn" onClick={handleSave}>Save</button>
          <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
        </div>
      ) : passwordMode ? (
        <div className="password-form">
          <label>
            Current Password:
            <input
              className="input-field"
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
            />
          </label>
          <br />
          <label>
            New Password:
            <input
              className="input-field"
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
            />
          </label>
          <br />
          <label>
            Confirm Password:
            <input
              className="input-field"
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
            />
          </label>
          <br />
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button className="save-btn" onClick={handlePasswordSave}>Save Password</button>
          <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
        </div>
      ) : (
        <div className="profile-info">
          <p>Name: {user.fullName}</p>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>
          <p>Room Number: {user.roomNumber}</p>
          <button className="edit-btn" onClick={handleEdit}>Edit</button>
          <button className="change-password-btn" onClick={() => setPasswordMode(true)}>Change Password</button>
        </div>
      )}

      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;
