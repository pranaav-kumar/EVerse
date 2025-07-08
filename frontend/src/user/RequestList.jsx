import React, { useState, useEffect } from "react";
import { 
  Zap, 
  Car, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Navigation, 
  Phone, 
  CheckCircle,
  XCircle,
  Filter,
  Search
} from "lucide-react";

const RequestList = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - in real app, this would come from an API
  useEffect(() => {
    const mockRequests = [
      {
        id: 1,
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        carModel: "Tesla Model 3",
        chargerType: "CCS",
        latitude: 12.9716,
        longitude: 77.5946,
        location: "Bangalore, Karnataka",
        status: "pending",
        priority: "high",
        batteryLevel: 5,
        requesterName: "Alex Johnson",
        phone: "+91 98765 43210"
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 900000), // 15 minutes ago
        carModel: "Nissan Leaf",
        chargerType: "Type 2",
        latitude: 12.9352,
        longitude: 77.6245,
        location: "Koramangala, Bangalore",
        status: "in-progress",
        priority: "medium",
        batteryLevel: 12,
        requesterName: "Priya Sharma",
        phone: "+91 87654 32109"
      },
      {
        id: 3,
        timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
        carModel: "Hyundai Ioniq 5",
        chargerType: "CCS",
        latitude: 12.9698,
        longitude: 77.7500,
        location: "Whitefield, Bangalore",
        status: "completed",
        priority: "low",
        batteryLevel: 8,
        requesterName: "Rajesh Kumar",
        phone: "+91 76543 21098"
      },
      {
        id: 4,
        timestamp: new Date(Date.now() - 600000), // 10 minutes ago
        carModel: "BMW iX",
        chargerType: "CCS",
        latitude: 12.9141,
        longitude: 77.6101,
        location: "HSR Layout, Bangalore",
        status: "pending",
        priority: "high",
        batteryLevel: 3,
        requesterName: "Sarah Wilson",
        phone: "+91 65432 10987"
      },
      {
        id: 5,
        timestamp: new Date(Date.now() - 1200000), // 20 minutes ago
        carModel: "Audi e-tron",
        chargerType: "Type 2",
        latitude: 12.9279,
        longitude: 77.6271,
        location: "Indiranagar, Bangalore",
        status: "cancelled",
        priority: "medium",
        batteryLevel: 15,
        requesterName: "Michael Chen",
        phone: "+91 54321 09876"
      }
    ];
    setRequests(mockRequests);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "in-progress": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "completed": return "bg-green-500/20 text-green-300 border-green-500/30";
      case "cancelled": return "bg-red-500/20 text-red-300 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4" />;
      case "in-progress": return <Zap className="w-4 h-4" />;
      case "completed": return <CheckCircle className="w-4 h-4" />;
      case "cancelled": return <XCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 60) {
      return `${minutes}m ago`;
    } else {
      return `${hours}h ${minutes % 60}m ago`;
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesFilter = filter === "all" || request.status === filter;
    const matchesSearch = request.carModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.requesterName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAcceptRequest = (requestId) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: "in-progress" } : req
    ));
  };

  const handleCompleteRequest = (requestId) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: "completed" } : req
    ));
  };

  const handleNavigate = (latitude, longitude) => {
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=15`;
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-8 px-4">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Emergency Requests
            </h1>
          </div>
          <p className="text-xl text-blue-200 font-light">
            Help fellow EV drivers in need
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-blue-500/20 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center gap-2 text-blue-300">
              <Filter className="w-5 h-5" />
              <span className="font-semibold">Filter:</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {["all", "pending", "in-progress", "completed", "cancelled"].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    filter === status 
                      ? "bg-blue-500 text-white" 
                      : "bg-slate-700/50 text-blue-300 hover:bg-slate-600/50"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Search className="w-5 h-5 text-blue-300" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 bg-slate-700/50 border border-blue-500/30 rounded-full text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Requests", value: requests.length, color: "from-blue-500 to-cyan-500" },
            { label: "Pending", value: requests.filter(r => r.status === "pending").length, color: "from-yellow-500 to-orange-500" },
            { label: "In Progress", value: requests.filter(r => r.status === "in-progress").length, color: "from-blue-500 to-purple-500" },
            { label: "Completed", value: requests.filter(r => r.status === "completed").length, color: "from-green-500 to-emerald-500" }
          ].map((stat, index) => (
            <div key={index} className="bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-blue-500/20 p-4">
              <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </div>
              <div className="text-blue-300 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Request List */}
        <div className="space-y-4">
          {filteredRequests.map(request => (
            <div key={request.id} className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-blue-500/20 p-6 hover:border-blue-400/40 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className={`w-2 h-16 rounded-full ${getPriorityColor(request.priority)}`}></div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{request.requesterName}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)} flex items-center gap-1`}>
                        {getStatusIcon(request.status)}
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-blue-200 text-sm">{formatTimeAgo(request.timestamp)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-400">{request.batteryLevel}%</div>
                  <div className="text-xs text-blue-300">Battery Level</div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl">
                  <Car className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="font-medium text-white">{request.carModel}</div>
                    <div className="text-sm text-blue-300">Vehicle</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <div>
                    <div className="font-medium text-white">{request.chargerType}</div>
                    <div className="text-sm text-blue-300">Charger Type</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl">
                  <MapPin className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="font-medium text-white">{request.location}</div>
                    <div className="text-sm text-blue-300">Location</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-300">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{request.phone}</span>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleNavigate(request.latitude, request.longitude)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 hover:bg-blue-500/30 transition-all duration-300"
                  >
                    <Navigation className="w-4 h-4" />
                    <span className="text-sm">Navigate</span>
                  </button>
                  
                  {request.status === "pending" && (
                    <button 
                      onClick={() => handleAcceptRequest(request.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 hover:bg-green-500/30 transition-all duration-300"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Accept</span>
                    </button>
                  )}
                  
                  {request.status === "in-progress" && (
                    <button 
                      onClick={() => handleCompleteRequest(request.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 hover:bg-purple-500/30 transition-all duration-300"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Complete</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-blue-300 mb-2">No requests found</h3>
            <p className="text-blue-200/60">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestList;