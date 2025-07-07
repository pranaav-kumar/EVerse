import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function StationMap() {
  const [map, setMap] = useState(null);
  const [stations, setStations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const navigate = useNavigate();

  // 📍 Step 1: Get User Location
  useEffect(() => {
    const fetchLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        () => {
          alert("⚠️ Unable to access your location. Defaulting to Chennai.");
          setUserLocation([13.0827, 80.2707]);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    };

    navigator.permissions?.query({ name: "geolocation" }).then((result) => {
      if (result.state === "granted" || result.state === "prompt") {
        fetchLocation();
      } else {
        alert("⚠️ Location permission denied.");
        setUserLocation([13.0827, 80.2707]);
      }
    });
  }, []);

  // 🔁 Step 2: Fetch Station Data from Backend
  useEffect(() => {
    fetch("http://localhost:5000/api/stations")
      .then((res) => res.json())
      .then((data) => setStations(data))
      .catch((err) => console.error("Error fetching stations:", err));
  }, []);

  // 🗺️ Step 3: Render Map + Markers
  useEffect(() => {
    if (!userLocation || stations.length === 0) return;

    const mapContainer = document.getElementById("map");
    if (mapContainer && mapContainer._leaflet_id) {
      mapContainer._leaflet_id = null;
    }

    const mapInstance = L.map("map").setView(userLocation, 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapInstance);

    const userIcon = L.icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      iconSize: [30, 30],
    });

    L.marker(userLocation, { icon: userIcon })
      .addTo(mapInstance)
      .bindPopup("📍 Your Location")
      .openPopup();

    stations.forEach((station) => {
      const { _id, name, location, type, connectors, ports, power } = station;
      const marker = L.marker([location.lat, location.lng]).addTo(mapInstance);

      marker.bindPopup(
        `<div style='font-size:15px; font-weight:600;'>${name}</div>
        ${type.includes("Charging")
          ? `⚡ Connectors: ${connectors}<br/>Ports: ${ports}<br/>Power: ${power}`
          : `🔋 Battery Swapping`}<br/>
        <button id='go-${_id}' style='margin-top:6px;background:#4f46e5;color:white;padding:6px 12px;border-radius:6px;border:none;cursor:pointer;'>📍 Show Route</button>`
      );

      marker.on("popupopen", () => {
        setTimeout(() => {
          const btn = document.getElementById(`go-${_id}`);
          if (btn) {
            btn.onclick = () => {
              const directionUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation[0]},${userLocation[1]}&destination=${location.lat},${location.lng}`;
              window.open(directionUrl, "_blank");
            };
          }
        }, 100);
      });

      marker.on("dblclick", () => {
        navigate(`/user/station/${_id}`, { state: station });
      });
    });

    setMap(mapInstance);
  }, [userLocation, stations]);

  return (
    <div className="bg-gradient-to-b from-zinc-900 to-gray-800 min-h-screen w-screen text-white">
      <header className="p-6 bg-gray-700 text-white text-center shadow-md">
        <h1 className="text-4xl font-extrabold tracking-wide">EVerse Station Finder</h1>
        <p className="text-lg mt-1 font-medium">Charging & Battery Swap Stations in Real-Time</p>
      </header>

      <div id="map" className="h-[55vh] w-full z-10 shadow-2xl rounded-md"></div>

      <section className="p-6 mt-4">
        <h3 className="text-3xl font-semibold text-white mb-4 border-b-2 pb-1 border-indigo-400">
          🗂 Nearby Stations
        </h3>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {stations.map((s) => (
            <div
              key={s._id}
              onClick={() => navigate(`/user/station/${s._id}`, { state: s })}
              className="bg-white text-gray-900 border-2 border-indigo-200 p-5 rounded-2xl shadow-xl cursor-pointer hover:bg-indigo-100 hover:border-indigo-400 transition-all"
            >
              <h4 className="text-xl font-bold text-indigo-800 mb-2">{s.name}</h4>
              <p className="text-sm text-indigo-600 font-semibold mb-1">
                {s.type.includes("Charging") ? "⚡ Charging Port" : "🔁 Battery Swap Station"}
              </p>
              <p className="text-sm text-indigo-800">Connector: {s.connectors}</p>
              <p className="text-sm text-indigo-800">Ports: {s.ports}</p>
              <p className="text-sm text-indigo-800">Power: {s.power}</p>
              <p className="text-sm text-indigo-800">📍 {s.location.address}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
