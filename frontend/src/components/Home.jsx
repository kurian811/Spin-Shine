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
          {[...Array(10)].map((_, i) => (
            <span key={i} className="bubble"></span>
          ))}
        </div>

        {/* Text with Glow Effect */}
        <div className="text-body">
          <div className="layered-text">
            <p className="glow">Welcome to</p>
            <p className="shadow">Spin n Shine</p>
          </div>
        </div>

        {/* Washing Machine with Floating Animation */}
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
      <div class="bubble-container">
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
</div>


      {/* Calendar and Information Section with Waves */}
      <div className="calendar-container">
        <div className="calendar-section">
          <Calendar onChange={setDate} value={date} />
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
