import React from "react";
import "../styles/Home.css";
const Home = () => {
  return (
    <>
      <div className="home-container">
        <div className="text-body">
          <div className="layered-text">
            <p>Welcome to</p>
            <p className="shadow">Spin n Shine</p>
          </div>
        </div>
        <div className="box-canvas">
          <div className="machine">
            <div className="drawer"></div>
            <div className="panel"></div>
            <div className="door">
              <div className="drum"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
