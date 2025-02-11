import React from "react";
import "../styles/Footer.css";
import logo from "../assets/logo.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section logo">
          <img src={logo} alt="Logo" className="footer-logo" />
        </div>
        <div className="footer-section about">
          <h2>About Us</h2>
          <p>
            Our hostel offers convenient and affordable laundry services to make
            your life easier. With well-maintained washing machines, dryers, and
            a dedicated laundry team, students can easily get their laundry done
            without leaving the campus. Enjoy hassle-free service for your
            clothing needs!
          </p>
        </div>
        <div className="footer-section links">
          <h2>Quick Links</h2>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/services">Services</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Spin n Shine. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
