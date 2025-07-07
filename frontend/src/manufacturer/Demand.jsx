import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";

const dummyStations = [
    { name: "Station A", index: 0, bookings: 60, lat: 13.0827, lng: 80.2707, location: "Chennai Central" },
    { name: "Station B", index: 1, bookings: 75, lat: 13.067439, lng: 80.237617, location: "T. Nagar" },
    { name: "Station C", index: 2, bookings: 90, lat: 13.0639, lng: 80.2290, location: "Kodambakkam" },
    { name: "Station D", index: 3, bookings: 120, lat: 13.0552, lng: 80.2409, location: "Ashok Nagar" },
    { name: "Station E", index: 4, bookings: 40, lat: 13.0039, lng: 80.2567, location: "Velachery" },
    { name: "Station F", index: 5, bookings: 110, lat: 13.0820, lng: 80.2653, location: "Egmore" },
    { name: "Station G", index: 6, bookings: 85, lat: 13.0829, lng: 80.2901, location: "Royapuram" },
    { name: "Station H", index: 7, bookings: 100, lat: 13.0352, lng: 80.2083, location: "Guindy" },
    { name: "Station I", index: 8, bookings: 95, lat: 13.0500, lng: 80.2500, location: "Saidapet" },
    { name: "Station J", index: 9, bookings: 70, lat: 13.0203, lng: 80.1852, location: "Adyar" },
];

function HeatmapLayer({ points }) {
    const map = useMap();

    useEffect(() => {
    const heat = L.heatLayer(points, {
        radius: 30,
        blur: 20,
        maxZoom: 10,
    }).addTo(map);

    return () => {
        map.removeLayer(heat);
    };
    }, [points, map]);

    return null;
}

function Demand() {
    const [stations] = useState(dummyStations);

    const heatPoints = stations.map(station => [
    station.lat,
    station.lng,
    station.bookings / 150, // Normalize intensity
    ]);

    return (
    <div className="p-6">
    <h2 className="text-2xl font-bold mb-4 text-blue-600">Demand Heatmap</h2>

    <MapContainer
        center={[22.9734, 78.6569]}
        zoom={5}
        style={{ height: "600px", width: "100%" }}
        className="rounded-lg shadow"
    >
        <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <HeatmapLayer points={heatPoints} />
        </MapContainer>

    <div className="mt-6 bg-black p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Station Demand Data</h3>
        <ul className="space-y-1">
            {stations.map(station => (
            <li key={station.index} className="text-sm">
                <strong>{station.name}</strong> ({station.location}) — {station.bookings} bookings
            </li>
        ))}
        </ul>
        </div>
    </div>
    );
}

export default Demand;
