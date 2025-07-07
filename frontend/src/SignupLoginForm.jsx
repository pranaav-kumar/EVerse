import React, { useEffect, useRef, useState } from 'react';
import './SignupLoginForm.css';
import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min';
import { useNavigate } from 'react-router-dom';

const SignupLoginForm = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [role, setRole] = useState('customer');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    carModel: '',
    chargerModel: '',
    companyName: '',
    businessEmail: '',
    licenseNumber: '',
    manufacturerType: '',
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login';
    const url = `http://localhost:5000${endpoint}`;

    const payload = {
      email: formData.email,
      password: formData.password,
      role,
      ...(isSignup && {
        name: formData.name,
        phone: formData.phone,
        carModel: formData.carModel,
        chargerModel: formData.chargerModel,
        companyName: formData.companyName,
        businessEmail: formData.businessEmail,
        licenseNumber: formData.licenseNumber,
        manufacturerType: formData.manufacturerType,
      }),
    };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Error');
        return;
      }

      if (!isSignup) {
        localStorage.setItem('token', data.token);
        alert('Login successful');
      } else {
        alert('Signup successful');
      }

      navigate(data.role === 'manufacturer' ? '/manufacturer-dashboard' : '/home');

    } catch (err) {
      alert('Network error');
      console.error(err);
    }
  };

  return (
    <div ref={vantaRef} className="fullscreen-wrapper">
      <div className="signup-form-container">
        <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <input name="name" type="text" placeholder="Name" value={formData.name} onChange={handleChange} required />
              <input name="phone" type="tel" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
            </>
          )}

          <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />

          {isSignup && (
            <>
              <label>Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} required>
                <option value="customer">Customer</option>
                <option value="manufacturer">Manufacturer</option>
              </select>

              {role === 'customer' && (
                <>
                  <input name="carModel" type="text" placeholder="Car Model" value={formData.carModel} onChange={handleChange} required />
                  <input name="chargerModel" type="text" placeholder="Charger Model" value={formData.chargerModel} onChange={handleChange} required />
                </>
              )}

              {role === 'manufacturer' && (
                <>
                  <input name="companyName" type="text" placeholder="Company Name" value={formData.companyName} onChange={handleChange} required />
                  <input name="businessEmail" type="email" placeholder="Business Email" value={formData.businessEmail} onChange={handleChange} required />
                  <input name="licenseNumber" type="text" placeholder="Business License Number" value={formData.licenseNumber} onChange={handleChange} required />
                  <input name="manufacturerType" type="text" placeholder="EV Manufacturer Type" value={formData.manufacturerType} onChange={handleChange} required />
                </>
              )}
            </>
          )}

          <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
        </form>

        <p className="toggle-text">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button type="button" onClick={toggleMode}>
            {isSignup ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupLoginForm;
