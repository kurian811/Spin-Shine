import React, { useState } from "react";
import "../styles/Login.css";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  // State for form inputs
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    roomNumber: "",
    laundryId: "",
    phone: "",
  });

  // State for validation and server messages
  const [validationMessage, setValidationMessage] = useState("");
  const [serverMessage, setServerMessage] = useState("");

  // Helper function to validate password strength
  const validatePassword = (password) => {
    const minLength = 6;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);

    if (password.length < minLength) {
      return "Password must be at least 6 characters long.";
    }
    if (!hasUppercase) {
      return "Password must include at least one uppercase letter.";
    }
    if (!hasLowercase) {
      return "Password must include at least one lowercase letter.";
    }
    if (!hasNumber) {
      return "Password must include at least one number.";
    }
    if (!hasSpecialChar) {
      return "Password must include at least one special character.";
    }

    return ""; // Password is valid
  };

  // Helper function to validate phone number
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return "Phone number must be 10 digits long.";
    }
    return ""; // Phone number is valid
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Real-time password validation
    if (name === "password") {
      const message = validatePassword(value);
      setValidationMessage(message);
    }

    // Real-time confirm password validation
    if (name === "confirmPassword") {
      if (formData.password !== value) {
        setValidationMessage("Passwords do not match.");
      } else {
        setValidationMessage("Passwords match!");
      }
    }

    // Real-time phone number validation
    if (name === "phone") {
      const message = validatePhoneNumber(value);
      setValidationMessage(message);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate required fields
    if (Object.values(formData).some((value) => !value)) {
      setServerMessage("Please fill in all fields.");
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      setValidationMessage("Passwords do not match.");
      return;
    }
  
    try {
      console.log("Sending data:", formData);
  
      const response = await fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          roomNumber: formData.roomNumber,
          laundryId: formData.laundryId,
          phone: formData.phone,
        }),
      });
  
      const data = await response.json();
      console.log("Response data:", data);
  
      if (response.ok) {
        setServerMessage("Signup successful! Redirecting...");
        setTimeout(() => navigate("/Login"), 2000);
      } else {
        setServerMessage(data.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("Error during signup:", err);
      setServerMessage("An error occurred. Please try again later.");
    }
  };
  

  return (
    <div className="signup-body">
      <StyledWrapper>
        <button onClick={() => navigate("/Login")}>
          <svg
            height={16}
            width={16}
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            viewBox="0 0 1024 1024"
          >
            <path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z" />
          </svg>
          <span>Back</span>
        </button>
      </StyledWrapper>

      <div className="signup-container">
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="signup-head">
            <span>Sign up</span>
            <p>Create a free account with your email.</p>
          </div>
          <div className="signup-inputs">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />
            <input
              type="text"
              name="roomNumber"
              placeholder="Room Number"
              value={formData.roomNumber}
              onChange={handleChange}
            />
            <input
              type="text"
              name="laundryId"
              placeholder="Laundry Id"
              value={formData.laundryId}
              onChange={handleChange}
            />
          </div>
          {validationMessage && <p className="validation-message">{validationMessage}</p>}
          {serverMessage && <p className="server-message">{serverMessage}</p>}
          <button className="signup-btn" type="submit">Sign up</button>
        </form>
        <div className="signup-form-footer">
          <p>
            Have an account? <Link to="/Login">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const StyledWrapper = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;

  button {
    display: flex;
    height: 3em;
    width: 100px;
    align-items: center;
    justify-content: center;
    background-color: #eeeeee4b;
    border-radius: 3px;
    letter-spacing: 1px;
    transition: all 0.2s linear;
    cursor: pointer;
    border: none;
    background: #fff;
  }

  button > svg {
    margin-right: 5px;
    margin-left: 5px;
    font-size: 20px;
    transition: all 0.4s ease-in;
  }

  button:hover > svg {
    font-size: 1.2em;
    transform: translateX(-5px);
  }

  button:hover {
    box-shadow: 9px 9px 33px #d1d1d1, -9px -9px 33px #ffffff;
    transform: translateY(-2px);
  }
`;

export default Signup;
