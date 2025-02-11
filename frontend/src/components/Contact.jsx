import React, { useState } from "react";
import swal from "sweetalert"; // Import SweetAlert
import "../styles/Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.target;
    const formAction = "https://formspree.io/f/xjkgyrpr"; // Replace with your Formspree form endpoint

    // Show sending notification using swal
    swal({
      title: "Sending...",
      text: "Please wait while we send your message.",
      icon: "info",
      buttons: false,
      closeOnClickOutside: false,
    });

    fetch(formAction, {
      method: "POST",
      body: new FormData(form),
      mode: "no-cors", // Bypass CORS restrictions
    })
    .then((response) => {
      console.log("Response:", response);
      swal({
        title: "Success",
        text: "Your message has been sent successfully!",
        icon: "success",
        button: "OK",
      });
      setFormData({ name: "", email: "", message: "" });
    })
    .catch((error) => {
      console.error("Error sending form data:", error);
    });
    
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>We’d love to hear from you! Get in touch with us through the form or our contact details below.</p>
      </div>

      <div className="contact-content">
        {/* Contact Form */}
        <div className="contact-form">
          <h2>Send Us a Message</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn-submit">Send Message</button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="contact-info">
          <h2>Contact Details</h2>
          <p><strong>Address:</strong> Marian College Kuttikkanam Autonomous, Idukki, Kerala</p>
          <p><strong>Phone:</strong> <a href="tel:+919496511863">+919496511863</a></p>
          <p><strong>Email:</strong> <a href="mailto:spinnshine@gmail.com">spinnshine@gmail.com</a></p>
          <h2>Find Us Here</h2>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3934.1378132834493!2d76.96905737450417!3d9.583387080065835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b064dc8bda5cb29%3A0x3d161914b6967f9!2sMarian%20College%20Kuttikkanam%20(Autonomous)!5e0!3m2!1sen!2sin!4v1733552570654!5m2!1sen!2sin"
            width="100%"
            height="250"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
