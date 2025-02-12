import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/Home.css";

const Home = () => {
  const [date, setDate] = useState(new Date());

  return (
    <>
      <div className="home-container">
        {/* Floating Bubbles */}
        <div className="bubbles">
          {[...Array(15)].map((_, i) => (
            <span key={i} className="bubble"></span>
          ))}
        </div>

        {/* Text with Glow and Wave Effect */}
        <div className="text-body">
          <div className="layered-text">
            <p className="glow">Welcome to</p>
            <p className="shadow wave">Spin n Shine</p>
          </div>
        </div>

        {/* Washing Machine with Floating and Rotating Animation */}
        <div className="box-canvas">
          <div className="machine floating">
            <div className="drawer"></div>
            <div className="panel"></div>
            <div className="door">
              <div className="drum spinning"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Floating Bubbles */}
      <div className="bubble-container">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bubble"></div>
        ))}
      </div>

      {/* Calendar and Information Section with Waves */}
      <div className="calendar-container">
        <div className="calendar-section">
          <Calendar onChange={setDate} value={date} className="animated-calendar" />
        </div>
        <div className="calendar-info">
          <h2 className="wave-text">Make Laundry Effortless!</h2>
          <p>
            Schedule your laundry day with ease and enjoy our premium wash & fold service.
          </p>
          <p>
            We ensure freshness, cleanliness, and convenience—so you can focus on what matters.
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;
