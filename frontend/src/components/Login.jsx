import React, { useState } from "react";
import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

const Login = () => {
  const navigate = useNavigate();

  // State for form inputs, loading, and error messages
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Email validation regex
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate email before sending request
    if (!validateEmail(formData.email)) {
      setErrorMessage("Invalid email format. Please enter a valid email.");
      setTimeout(() => setErrorMessage(""), 5000);
      return;
    }

    setLoading(true); // Start loading spinner

    try {
      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok) {
        const user = data.user;
        if (user && user.role) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(user));

          if (user.role === "admin") {
            navigate("/AdminDashboard");
          } else {
            navigate("/"); // Home page for non-admin
          }
        } else {
          setErrorMessage("Unexpected response structure.");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <div>
      <div className="login-body">
        <StyledWrapper>
          <button onClick={() => navigate("/")}>
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

        <div className="login-container">
          <form className="login-form" onSubmit={handleLogin}>
            <div className="login-head">
              <span>Log in</span>
              <p>Access your account with your email and password.</p>
            </div>
            <div className="login-inputs">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                minLength="8"
                maxLength="20"
                required
              />

            </div>
            <button className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </button>
            <StyledForgotPassword>
                <Link to="/forgot-password">Forgot password?</Link>
              </StyledForgotPassword>
          </form>
          {loading && (
            <div className="loading-container">
              <div className="spinner"></div>
            </div>
          )}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="login-form-footer">
            <p>
              Don't have an account? <Link to="/Signup">Sign up</Link>
            </p>
          </div>
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

const StyledForgotPassword = styled.div`
  margin-top: 8px;
  text-align: right;

  a {
    color: #7C6666;
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.2s;
  }

  a:hover {
    color: #0056b3;
    text-decoration: underline;
  }
`;

export default Login;
