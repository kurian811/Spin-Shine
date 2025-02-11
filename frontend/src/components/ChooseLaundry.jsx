import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using react-router for navigation
import "../styles/SubmitLaundry.css";

const ChooseLaundry = () => {
  return (
    <div className="center-buttons-container">
      <Link to="/SubmitLaundry" className="center-button">
        Submit Laundry
      </Link>
      <Link to="/laundryStatus" className="center-button">
        View Laundry Status
      </Link>
    </div>
  );
};

export default ChooseLaundry;
