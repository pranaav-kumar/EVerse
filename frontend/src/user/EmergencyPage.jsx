import React from 'react';
import { Zap, AlertTriangle, FileText, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function EmergencyPage() {
  const handleNavigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6 border border-green-100">
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <Car className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <div className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1">
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Emergency</h1>
            <p className="text-gray-600 text-sm">EV Support & Assistance</p>
          </div>

          {/* Charging Status Indicator */}
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-center space-x-2">
              <Zap className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-700 font-medium">Emergency Services Active</span>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <button
              onClick={() => handleNavigate('/user/EmergencyRequest')}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-3"
            >
              <AlertTriangle className="w-5 h-5" />
              <span>Request Emergency</span>
            </button>

            <button
              onClick={() => handleNavigate('/user/RequestList')}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-3"
            >
              <FileText className="w-5 h-5" />
              <span>View Requests</span>
            </button>
          </div>
        </div>



        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            24/7 Emergency Support • Eco-Friendly Solutions
          </p>
        </div>
      </div>
    </div>
  );
}