import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
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

// Custom marker icons
const createCustomIcon = (color) => {
    return L.divIcon({
        html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
        className: 'custom-marker',
        iconSize: [12, 12],
        iconAnchor: [6, 6]
    });
};

const existingStationIcon = createCustomIcon('#ef4444');
const suggestedStationIcon = createCustomIcon('#22c55e');

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

function StationMarkers({ stations, suggestedStations }) {
    return (
        <>
            {stations.map(station => (
                <Marker 
                    key={station.index} 
                    position={[station.lat, station.lng]}
                    icon={existingStationIcon}
                >
                    <Popup>
                        <div className="text-sm">
                            <strong>{station.name}</strong><br/>
                            {station.location}<br/>
                            Bookings: {station.bookings}
                        </div>
                    </Popup>
                </Marker>
            ))}
            {suggestedStations.map((station, index) => (
                <Marker 
                    key={`suggested-${index}`} 
                    position={[station.lat, station.lng]}
                    icon={suggestedStationIcon}
                >
                    <Popup>
                        <div className="text-sm">
                            <strong>Suggested Station {index + 1}</strong><br/>
                            Expected Demand: {station.expectedDemand}<br/>
                            Coverage Score: {station.coverageScore.toFixed(2)}
                        </div>
                    </Popup>
                </Marker>
            ))}
        </>
    );
}

function Demand() {
    const [stations] = useState(dummyStations);
    const [suggestedStations, setSuggestedStations] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const heatPoints = stations.map(station => [
        station.lat,
        station.lng,
        station.bookings / 150, // Normalize intensity
    ]);

    // Distance calculation using Haversine formula
    const calculateDistance = (lat1, lng1, lat2, lng2) => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    // K-means clustering algorithm implementation
    const kMeansClustering = (points, k) => {
        const maxIterations = 100;
        let centroids = [];
        
        // Initialize centroids randomly
        for (let i = 0; i < k; i++) {
            const randomPoint = points[Math.floor(Math.random() * points.length)];
            centroids.push({ lat: randomPoint.lat, lng: randomPoint.lng });
        }

        for (let iteration = 0; iteration < maxIterations; iteration++) {
            const clusters = Array.from({ length: k }, () => []);
            
            // Assign points to nearest centroid
            points.forEach(point => {
                let minDistance = Infinity;
                let closestCentroid = 0;
                
                centroids.forEach((centroid, index) => {
                    const distance = calculateDistance(point.lat, point.lng, centroid.lat, centroid.lng);
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestCentroid = index;
                    }
                });
                
                clusters[closestCentroid].push(point);
            });

            // Update centroids
            const newCentroids = clusters.map(cluster => {
                if (cluster.length === 0) return centroids[0];
                
                const avgLat = cluster.reduce((sum, point) => sum + point.lat, 0) / cluster.length;
                const avgLng = cluster.reduce((sum, point) => sum + point.lng, 0) / cluster.length;
                return { lat: avgLat, lng: avgLng };
            });

            // Check for convergence
            const hasConverged = centroids.every((centroid, index) => {
                const distance = calculateDistance(
                    centroid.lat, centroid.lng,
                    newCentroids[index].lat, newCentroids[index].lng
                );
                return distance < 0.01; // 10 meters threshold
            });

            centroids = newCentroids;
            
            if (hasConverged) break;
        }

        return centroids;
    };

    // Generate grid of potential locations
    const generatePotentialLocations = () => {
        const potentialLocations = [];
        const bounds = {
            minLat: Math.min(...stations.map(s => s.lat)) - 0.02,
            maxLat: Math.max(...stations.map(s => s.lat)) + 0.02,
            minLng: Math.min(...stations.map(s => s.lng)) - 0.02,
            maxLng: Math.max(...stations.map(s => s.lng)) + 0.02
        };

        const gridSize = 0.005; // Approximately 500m grid
        
        for (let lat = bounds.minLat; lat <= bounds.maxLat; lat += gridSize) {
            for (let lng = bounds.minLng; lng <= bounds.maxLng; lng += gridSize) {
                potentialLocations.push({ lat, lng });
            }
        }

        return potentialLocations;
    };

    // Calculate coverage score for a potential location
    const calculateCoverageScore = (potentialLocation) => {
        const serviceRadius = 2; // 2km service radius
        let demandScore = 0;
        let proximityPenalty = 0;

        // Calculate demand within service radius
        stations.forEach(station => {
            const distance = calculateDistance(
                potentialLocation.lat, potentialLocation.lng,
                station.lat, station.lng
            );
            
            if (distance <= serviceRadius) {
                // Weight demand by inverse distance
                demandScore += station.bookings * (1 - (distance / serviceRadius));
            }
        });

        // Penalize locations too close to existing stations
        const minDistance = Math.min(...stations.map(station => 
            calculateDistance(potentialLocation.lat, potentialLocation.lng, station.lat, station.lng)
        ));
        
        if (minDistance < 1) { // Less than 1km from existing station
            proximityPenalty = 50;
        }

        return Math.max(0, demandScore - proximityPenalty);
    };

    // Main optimization algorithm
    const findOptimalLocations = () => {
        console.log("Starting optimization algorithm...");
        
        // Step 1: Generate potential locations
        const potentialLocations = generatePotentialLocations();
        console.log(`Generated ${potentialLocations.length} potential locations`);

        // Step 2: Score each location
        const scoredLocations = potentialLocations.map(location => ({
            ...location,
            coverageScore: calculateCoverageScore(location)
        })).filter(location => location.coverageScore > 10); // Filter out low-scoring locations

        // Step 3: Sort by score and select top candidates
        scoredLocations.sort((a, b) => b.coverageScore - a.coverageScore);
        const topCandidates = scoredLocations.slice(0, 20);

        // Step 4: Use k-means to cluster high-demand areas and find optimal positions
        const highDemandStations = stations.filter(station => station.bookings > 80);
        const clusters = kMeansClustering(highDemandStations, 3);

        // Step 5: Find best candidates near cluster centers
        const suggestions = clusters.map((cluster, index) => {
            const nearbyCandidate = topCandidates.find(candidate => 
                calculateDistance(candidate.lat, candidate.lng, cluster.lat, cluster.lng) < 1.5
            ) || topCandidates[index];

            return {
                ...nearbyCandidate,
                expectedDemand: Math.round(nearbyCandidate.coverageScore * 0.8 + 40)
            };
        });

        // Step 6: Add a few more top-scoring locations
        const additionalSuggestions = topCandidates
            .filter(candidate => !suggestions.some(suggestion => 
                calculateDistance(candidate.lat, candidate.lng, suggestion.lat, suggestion.lng) < 1
            ))
            .slice(0, 2)
            .map(candidate => ({
                ...candidate,
                expectedDemand: Math.round(candidate.coverageScore * 0.8 + 40)
            }));

        const finalSuggestions = [...suggestions, ...additionalSuggestions];
        
        console.log(`Generated ${finalSuggestions.length} optimization suggestions`);
        setSuggestedStations(finalSuggestions);
        setShowSuggestions(true);
    };

    const toggleSuggestions = () => {
        if (showSuggestions) {
            setShowSuggestions(false);
            setSuggestedStations([]);
        } else {
            findOptimalLocations();
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Station Optimization</h1>
                        <p className="text-slate-400">Demand Analysis & Location Optimization</p>
                    </div>
                    <button
                        onClick={toggleSuggestions}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                            showSuggestions 
                                ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg' 
                                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg'
                        }`}
                    >
                        {showSuggestions ? 'Hide Suggestions' : 'Find Optimal Locations'}
                    </button>
                </div>

                {/* Optimization Results Banner */}
                {showSuggestions && (
                    <div className="mb-6 p-5 bg-slate-800 border border-slate-700 rounded-xl">
                        <h3 className="font-semibold text-blue-400 mb-3 text-lg">Optimization Results</h3>
                        <p className="text-slate-300 mb-4">
                            Algorithm used: K-means clustering with demand-weighted coverage scoring. 
                            Green markers show suggested optimal locations based on demand patterns, 
                            coverage gaps, and proximity to existing stations.
                        </p>
                        <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                                <span className="text-slate-300">Existing Stations</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                                <span className="text-slate-300">Suggested Locations</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Map Container */}
                <div className="bg-slate-800 rounded-xl p-6 mb-6 shadow-2xl">
                    <h2 className="text-xl font-semibold text-white mb-4">Station-wise Demand Heatmap</h2>
                    <MapContainer
                        center={[13.0827, 80.2707]}
                        zoom={12}
                        style={{ height: "600px", width: "100%" }}
                        className="rounded-lg shadow-xl"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <HeatmapLayer points={heatPoints} />
                        <StationMarkers stations={stations} suggestedStations={suggestedStations} />
                    </MapContainer>
                </div>

                {/* Data Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Existing Stations Card */}
                    <div className="bg-slate-800 rounded-xl p-6 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-white">Existing Stations</h3>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-blue-400">{stations.length}</div>
                                <div className="text-sm text-slate-400">Total Stations</div>
                            </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                            <div className="space-y-3">
                                {stations.map(station => (
                                    <div key={station.index} className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                                        <div>
                                            <div className="font-semibold text-white">{station.name}</div>
                                            <div className="text-sm text-slate-400">{station.location}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-blue-400">{station.bookings}</div>
                                            <div className="text-xs text-slate-400">bookings</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Suggested Stations Card */}
                    {showSuggestions && (
                        <div className="bg-slate-800 rounded-xl p-6 shadow-xl">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-white">Suggested New Stations</h3>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-green-400">{suggestedStations.length}</div>
                                    <div className="text-sm text-slate-400">Recommendations</div>
                                </div>
                            </div>
                            <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                <div className="space-y-3">
                                    {suggestedStations.map((station, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-slate-700 rounded-lg border border-green-500/20">
                                            <div>
                                                <div className="font-semibold text-white">Location {index + 1}</div>
                                                <div className="text-xs text-slate-400">
                                                    Score: {station.coverageScore.toFixed(2)}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-green-400">{station.expectedDemand}</div>
                                                <div className="text-xs text-slate-400">expected</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #334155;
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #64748b;
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </div>
    );
}

export default Demand;