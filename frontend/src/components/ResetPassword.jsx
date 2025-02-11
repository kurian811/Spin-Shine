import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import "../styles/Login.css";

const ResetPassword = () => {
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);

  const navigate = useNavigate();
  const { token } = useParams();

  const validatePasswordStrength = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return "Password must be at least 8 characters long";
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter";
    }
    if (!hasLowerCase) {
      return "Password must contain at least one lowercase letter";
    }
    if (!hasNumbers) {
      return "Password must contain at least one number";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Using token:', token);
    const { newPassword, confirmPassword } = passwords;

    // Validate password match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password strength
    const strengthError = validatePasswordStrength(newPassword);
    if (strengthError) {
      setError(strengthError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:3000/api/users/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      const data = await response.json();
      console.log('Response:', data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      setSuccess(true);
      // Store the token if returned from backend
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (error) {
      console.error("Reset password error:", error);
      if (error.message.includes("invalid") || error.message.includes("expired")) {
        setIsValidToken(false);
      }
      setError(error.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Add password requirements list
  const PasswordRequirements = () => (
    <div className="password-requirements">
      <p>Password must contain:</p>
      <ul>
        <li>At least 8 characters</li>
        <li>At least one uppercase letter</li>
        <li>At least one lowercase letter</li>
        <li>At least one number</li>
        <li>At least one special character (!@#$%^&*)</li>
      </ul>
    </div>
  );

  return (
    <div className="reset-password-body">
      <div className="reset-password-container">
        {!isValidToken ? (
          <div className="reset-password-error-container">
            <h2>Invalid or Expired Link</h2>
            <p>The password reset link is invalid or has expired.</p>
            <Link to="/forgot-password" className="reset-password-link">
              Request New Reset Link
            </Link>
          </div>
        ) : success ? (
          <div className="reset-password-success">
            <h2>Success!</h2>
            <p>Your password has been reset successfully.</p>
            <p>Redirecting to login page...</p>
          </div>
        ) : (
          <form className="reset-password-form" onSubmit={handleSubmit}>
            <div className="reset-password-head">
              <h1>Reset Password</h1>
              <p>Enter your new password below.</p>
            </div>

            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              className="reset-password-input"
              value={passwords.newPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              className="reset-password-input"
              value={passwords.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <PasswordRequirements />

            {error && <p className="reset-password-error">{error}</p>}

            <button
              type="submit"
              className="reset-password-button"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <Link to="/login" className="back-to-login-link">
              Back to Login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;