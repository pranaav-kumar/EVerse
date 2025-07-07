import React from 'react';
import './ManufacturerDashboard.css';
import { useNavigate } from 'react-router-dom';//import { ChartLine, Plus, Bell, CurrencyCircleDollar } from 'lucide-react';
import { ChartLine, Plus, Bell, DollarSign } from 'lucide-react';


const ManufacturerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-root">
      <div className="sidebar">
        <h1>EV Travel Assistant</h1>
        <div className="menu">
          <div className="menu-item">
            <ChartLine size={20} /> <span onClick={()=>navigate("/manufacturer/demand")}>Demand Prediction</span>
          </div>
          <div className="menu-item">
            <Plus size={20} /> <span onClick={()=>navigate("/addstations")}>Add Stations</span>
          </div>
          <div className="menu-item">
            <Bell size={20} /> <span onClick={()=>navigate("/maintenance")}>Maintenance Alerts</span>
          </div>
          <div className="menu-item">
  <DollarSign size={20} /> <span>Revenue & Billing</span>
</div>

        </div>
      </div>
      <div className="main">
        <h2>Dashboard Home</h2>
        <div className="stats">
          <div className="stat-card">
            <p>Total Demand</p>
            <h3>15,000</h3>
            <span className="green">+5%</span>
          </div>
          <div className="stat-card">
            <p>Average Demand Per Station</p>
            <h3>2,500</h3>
            <span className="green">+3%</span>
          </div>
          <div className="stat-card">
            <p>Predicted Growth</p>
            <h3>+12%</h3>
            <span className="green">+12%</span>
          </div>
        </div>
        <h3>Quick Actions</h3>
        <div className="actions">
          <button className="btn-dark">Add New Station</button>
          <button className="btn-dark">View Maintenance Schedule</button>
        </div>
        <h3>Next 30 Days</h3>
        <div className="forecast">
          <div className="forecast-card">
            <p>Demand Forecast</p>
            <h2>+12%</h2>
            <p>
              <span className="gray">This Month</span> <span className="green">+12%</span>
            </p>
            <img src="/demand-curve.svg" alt="Demand Graph" className="graph" />
            <div className="days">
              <span>Day 1</span><span>Day 5</span><span>Day 10</span><span>Day 15</span><span>Day 20</span><span>Day 25</span><span>Day 30</span>
            </div>
          </div>
        </div>
        <h3>Station-wise Demand Heatmap</h3>
        <div className="heatmap">
          <div className="heatmap-card">
            <p>Station Demand</p>
            <h2>+8%</h2>
            <p>
              <span className="gray">This Month</span> <span className="green">+8%</span>
            </p>
            <div className="bars">
              <div className="bar" style={{ height: '10%' }}></div>
              <div className="bar" style={{ height: '20%' }}></div>
              <div className="bar" style={{ height: '40%' }}></div>
              <div className="bar" style={{ height: '30%' }}></div>
              <div className="bar" style={{ height: '10%' }}></div>
              <div className="bar" style={{ height: '90%' }}></div>
              <div className="bar" style={{ height: '30%' }}></div>
            </div>
            <div className="stations">
              <span>Station A</span>
              <span>Station B</span>
              <span>Station C</span>
              <span>Station D</span>
              <span>Station E</span>
              <span>Station F</span>
              <span>Station G</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManufacturerDashboard;
