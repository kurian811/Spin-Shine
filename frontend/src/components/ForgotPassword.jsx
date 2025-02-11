import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Login.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value.trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      setTimeout(() => setErrorMessage(""), 5000);
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`http://localhost:3000/api/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send reset email.");
      }

      setSubmitted(true);
    } catch (error) {
      setErrorMessage(error.message || "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-body">
      <div className="forgot-password-container">
        {!submitted ? (
          <form className="forgot-password-form" onSubmit={handleSubmit}>
            <div className="forgot-password-head">
              <h1>Forgot Password</h1>
              <p>Enter your email to reset your password.</p>
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="forgot-password-input"
              value={email}
              onChange={handleChange}
              required
              disabled={loading}
              aria-label="Email"
            />
            <button
              type="submit"
              className="forgot-password-button"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
            {errorMessage && (
              <p
                className="forgot-password-error"
                aria-live="assertive"
                role="alert"
              >
                {errorMessage}
              </p>
            )}
          </form>
        ) : (
          <div className="forgot-password-success">
            <h2>Success!</h2>
            <p>A password reset link has been sent to your email.</p>
            <Link to="/login" className="back-to-login-link">
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
