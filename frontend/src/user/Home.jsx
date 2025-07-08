import React, { useRef, useEffect, useState } from "react";
import './Home.css';
import { useNavigate } from 'react-router-dom';
import StationMap from "./StationMap";


import pumpImg from './userAssets/pump.png';
import routeImg from './userAssets/route.png';
import dashImg from './userAssets/dash.png';

import * as THREE from "three";
import GLOBE from "vanta/dist/vanta.globe.min";


const Home = () => {
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);
  const navigate = useNavigate();


  useEffect(() => {
  if (!vantaEffect.current) {
    vantaEffect.current = GLOBE({
      el: vantaRef.current,
      THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
      color: 0x468928,
      backgroundColor: 0x000000,
    });
  }

  return () => {
    if (vantaEffect.current) {
      vantaEffect.current.destroy();
      vantaEffect.current = null;
    }
  };
}, []);


  return (
    <div ref={vantaRef} className="home-vanta-wrapper">

    <div  className="home-container">
      <header className="home-header">
        <div className="logo-name">EVerse</div>
        <div className="header-icons">
          <button className="notification-btn" aria-label="Notifications">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="white"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11c0-2.485-1.355-4.64-3.5-5.74V4a1.5 1.5 0 00-3 0v1.26C8.355 6.36 7 8.515 7 11v3.159c0 .538-.214 1.055-.595 1.436L5 17h5m5 0v1a3 3 0 01-6 0v-1m6 0H9"

              />
            </svg>
          </button>
          <button className="notification-btn" aria-label="Profile">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="white"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="50"
    height="50"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5.121 17.804A8.966 8.966 0 0112 15c2.075 0 3.97.707 5.423 1.896M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
</button>


        </div>
      </header>

      <main className="home-main">
        <h1>Welcome back!</h1>
        <div className="card-container">
          <div className="card" onClick={()=>navigate('/user/map')}>
            <img src={pumpImg} alt="Charging Map" />
            <h3>Charging Map</h3>
            <p>Find charging stations near you or along your route.</p>
          </div>
          <div className="card" onClick={()=>navigate('/RoutePlanner')}>
            <img src={routeImg} alt="Route Planner" />
            <h3>Route Planner</h3>
            <p>Plan your trip with charging stops and estimated travel time.</p>
          </div>
          <div className="card">
            <img src={dashImg} alt="Dashboard" />
            <h3>Dashboard</h3>
            <p>View your vehicle’s status, charging history, and more.</p>
          </div>
        </div>
        
      </main>
    </div>
    </div>
  );
};

export default Home;