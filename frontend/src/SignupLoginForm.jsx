
import React, { useEffect, useRef, useState } from 'react';
import './SignupLoginForm.css';
import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min';
import { useNavigate } from 'react-router-dom';
import Home from './user/Home.jsx'

const SignupLoginForm = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [role, setRole] = useState('customer');
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);
  const navigate = useNavigate();

  const toggleMode = () => setIsSignup(!isSignup);

  useEffect(() => {
    if (!vantaEffect.current) {
      vantaEffect.current = NET({
        el: vantaRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0x46668e,
        backgroundColor: 0x040720,
        points: 10,
        maxDistance: 20,
        spacing: 15,
        showDots: false,
      });
    }

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  const handleSubmit = (e) => {
  e.preventDefault();

  if (role === 'manufacturer') {
    // Navigate to dashboard
    navigate('/manufacturer-dashboard');
  } else {
    // You can change this alert to actual navigation later
    //alert(`Customer ${isSignup ? "sign up" : "login"} successful!`);
    navigate('/home');
    alert("Customer login successful");
  }
};


  return (
    <div ref={vantaRef} className="fullscreen-wrapper">
      <div className="signup-form-container">
        <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <input type="text" placeholder="Name" required />
              <input type="tel" placeholder="Phone Number" required />
            </>
          )}

          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />

          {isSignup && (
            <>
              <label>Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} required>
                <option value="customer">Customer</option>
                <option value="manufacturer">Manufacturer</option>
              </select>

              {role === 'customer' && (
                <>
                  <input type="text" placeholder="Car Model" required />
                  <input type="text" placeholder="Charger Model" required />
                </>
              )}

              {role === 'manufacturer' && (
                <>
                  <input type="text" placeholder="Company Name" required />
                  <input type="email" placeholder="Business Email" required />
                  <input type="text" placeholder="Business License Number" required />
                  <input type="text" placeholder="EV Manufacturer Type" required />
                </>
              )}
            </>
          )}

          <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
        </form>

        <p className="toggle-text">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={toggleMode}>
            {isSignup ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupLoginForm;

