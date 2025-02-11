import React, { useState, useEffect } from "react";
import "../styles/SubmitLaundry.css";
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';

const LaundryForm = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [clothes, setClothes] = useState({
    Shirt: 0,
    Pant: 0,
    Jeans: 0,
    Tshirt: 0,
    PlayPant: 0,
    Bermuda: 0,
    InnerBan: 0,
    Bedsheet: 0,
    Blanket: 0,
    Lunkey: 0,
    Overcoat: 0,
    Thorth: 0,
    Turkey: 0,
    Pillow: 0,
    Sweater: 0,
  });
  const [totalClothes, setTotalClothes] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState(null);  // Track submission status

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setErrorMessage(err.message || "Failed to load user data.");
      }
    };

    const fetchLaundryStatus = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/laundry/status", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const statusData = await response.json();
          setSubmissionStatus(statusData.status);  // Set submission status (e.g., "Pending" or "Submitted")
        }
      } catch (err) {
        setErrorMessage("Failed to fetch laundry submission status.");
      }
    };

    fetchUserData();
    fetchLaundryStatus();
  }, []);

  const handleIncrement = (type) => {
    if (totalClothes >= 20) {
      setErrorMessage("Total clothes cannot exceed 20.");
      return;
    }
    setClothes((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }));
    setTotalClothes((prev) => prev + 1);
    setErrorMessage("");
  };

  const handleDecrement = (type) => {
    if (clothes[type] > 0) {
      setClothes((prev) => ({
        ...prev,
        [type]: prev[type] - 1,
      }));
      setTotalClothes((prev) => prev - 1);
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalClothes = Object.values(clothes).reduce((total, count) => total + count, 0);

    try {
      const response = await fetch("http://localhost:3000/api/laundry/submit", {      
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          numberOfClothes: totalClothes,
          items: clothes,
        }),
      });

      const data = await response.json();

      if (response.status === 400) {
        setErrorMessage(data.message || "You have already submitted laundry this month.");
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred while submitting laundry');
      } else {
        swal({
          title: "Good job!",
          text: "Laundry submission successful!",
          icon: "success",
          button: "Aww yiss!",
        }).then(() => {
          navigate('/');
        });
      }
    } catch (err) {
      setErrorMessage("An error occurred while submitting laundry.");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="laundry-form-container">
      <h2 className="laundry-form-heading">Submit Laundry</h2>
      {errorMessage && <p className="laundry-error">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="laundry-form">
        <label className="laundry-label">
          Name:
          <input type="text" value={user.fullName} readOnly className="readonly-field" />
        </label>
        <label className="laundry-label">
          Room Number:
          <input type="text" value={user.roomNumber} readOnly className="readonly-field" />
        </label>
        <label className="laundry-label">
          Laundry ID:
          <input type="text" value={user.laundryId} readOnly className="readonly-field" />
        </label>
        <div className="clothes-section">
          <p>Total Clothes: {totalClothes}</p>
          {Object.keys(clothes).map((type) => (
            <div key={type} className="clothes-item">
              <span className="clothes-item-span1">{type.replace(/([A-Z])/g, " $1")}</span>
              <button type="button" onClick={() => handleDecrement(type)} className="laundry-btn">-</button>
              <span className="clothes-item-span2">{clothes[type]}</span>
              <button type="button" onClick={() => handleIncrement(type)} className="laundry-btn">+</button>
            </div>
          ))}
        </div>
        <button type="submit" className="laundry-submit-btn">Submit Laundry</button>
      </form>

    </div>
  );
};

export default LaundryForm;
