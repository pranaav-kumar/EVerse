from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import joblib
import requests
import os
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
load_dotenv()

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In dev only! Replace with frontend URL in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# === Config ===
ORS_URL = "https://api.openrouteservice.org/v2/directions/driving-car/geojson"
ORS_API_KEY = os.getenv("ORS_API_KEY")
model_path = os.path.join(os.path.dirname(__file__), "ev_route_model.pkl")
model = joblib.load(model_path)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"]
)

class Coordinates(BaseModel):
    lat: float
    lng: float

class RouteRequest(BaseModel):
    start: Coordinates
    end: Coordinates

# === Helper function to get route from ORS ===
def get_route(coords: List[List[float]]) -> Dict:
    headers = {
        "Authorization": ORS_API_KEY,
        "Content-Type": "application/json"
    }
    body = { "coordinates": coords }

    try:
        res = requests.post(ORS_URL, json=body, headers=headers)
        res.raise_for_status()
        return res.json()
    except Exception as e:
        print("ORS API Error:", e)
        raise HTTPException(status_code=500, detail="ORS fetch failed")

# === Final ML + ORS route endpoint ===
@app.post("/ev_prediction_full")
def predict_full(data: RouteRequest):
    # 1. Predict using ML model
    features = [
        data.start.lat, data.start.lng,
        data.end.lat, data.end.lng
    ]
    ml_pred = model.predict([features])[0]

    # 2. Shortest path route
    shortest_coords = [[data.start.lng, data.start.lat], [data.end.lng, data.end.lat]]
    shortest_route = get_route(shortest_coords)

    # 3. EV Station path — for now, same as shortest (can update later with mid stops)
    ev_route = get_route(shortest_coords)

    return {
        "ml_prediction": {
            "predicted_shortest_eta_min": round(ml_pred[0], 2),
            "predicted_ev_route_eta_min": round(ml_pred[1], 2),
            "predicted_ev_route_distance_km": round(ml_pred[2], 2)
        },
        "shortest_route": shortest_route,
        "ev_station_route": ev_route
    }
