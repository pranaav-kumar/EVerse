
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function StationMap() {
  const [map, setMap] = useState(null);
  const [stations, setStations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const navigate = useNavigate();

  const dummyStations = [
    {
      id: "cs101",
      name: "Nungambakkam Charging Port",
      type: "charging",
      lat: 13.0587,
      lng: 80.2511,
      availableSlots: 3,
      waitTime: "10 mins",
    },
    {
      id: "cs102",
      name: "T Nagar Fast Charger",
      type: "charging",
      lat: 13.0422,
      lng: 80.2337,
      availableSlots: 1,
      waitTime: "25 mins",
    },
    {
      id: "bs201",
      name: "Adyar Battery Swap Station",
      type: "swap",
      lat: 13.0067,
      lng: 80.2578,
      availableBatteries: 5,
      batteryTypes: ["Lithium-ion", "LFP"],
    },
    {
      id: "bs202",
      name: "Velachery Battery Hub",
      type: "swap",
      lat: 12.9763,
      lng: 80.2211,
      availableBatteries: 3,
      batteryTypes: ["Lithium-ion"],
    },
  ];

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
        alert("⚠️ Location permission denied. Please enable it in browser settings.");
        setUserLocation([13.0827, 80.2707]);
      }
    });
  }, []);

  useEffect(() => {
    if (!userLocation) return;

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

    dummyStations.forEach((station) => {
      const marker = L.marker([station.lat, station.lng]).addTo(mapInstance);
      marker.bindPopup(
        `<div style='font-size:15px; font-weight:600;'>${station.name}</div>
        ${station.type === "charging"
          ? `⚡ Slots: ${station.availableSlots}<br/>Wait: ${station.waitTime}`
          : `🔋 Batteries: ${station.availableBatteries}<br/>Types: ${station.batteryTypes.join(", ")}`
        }<br/><button id='go-${station.id}' style='margin-top:6px;background:#4f46e5;color:white;padding:6px 12px;border-radius:6px;border:none;cursor:pointer;'>📍 Show Route</button>`
      );

      marker.on("popupopen", () => {
        setTimeout(() => {
          const btn = document.getElementById(`go-${station.id}`);
          if (btn) {
            btn.onclick = () => {
              const directionUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation[0]},${userLocation[1]}&destination=${station.lat},${station.lng}`;
              window.open(directionUrl, "_blank");
            };
          }
        }, 100);
      });

      marker.on("dblclick", () => {
        navigate(`/user/station/${station.id}`, { state: station });
      });
    });

    setMap(mapInstance);
    setStations(dummyStations);
  }, [userLocation]);

  return (
    <div className="bg-gradient-to-b from-zinc-900 to-gray-800 min-h-screen w-screen text-white">
      <header className="p-6 bg-gray-700 text-white text-center shadow-md">
        <h1 className="text-4xl font-extrabold tracking-wide">⚡ EVerse Station Finder</h1>
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
              key={s.id}
              onClick={() => navigate(`/user/station/${s.id}`, { state: s })}
              className="bg-white text-gray-900 border-2 border-indigo-200 p-5 rounded-2xl shadow-xl cursor-pointer hover:bg-indigo-100 hover:border-indigo-400 transition-all"
            >
              <h4 className="text-xl font-bold text-indigo-800 mb-2">{s.name}</h4>
              <p className="text-sm text-indigo-600 font-semibold mb-1">
                {s.type === "charging" ? "⚡ Charging Port" : "🔁 Battery Swap Station"}
              </p>
              {s.type === "charging" ? (
                <>
                  <p className="text-sm text-indigo-800">Available Slots: {s.availableSlots}</p>
                  <p className="text-sm text-indigo-800">Wait Time: {s.waitTime}</p>
                </>
              ) : (
                <>
                  <p className="text-sm text-indigo-800">Available Batteries: {s.availableBatteries}</p>
                  <p className="text-sm text-indigo-800">
                    Battery Types: {s.batteryTypes.join(", ")}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
