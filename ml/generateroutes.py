import random
import requests
import csv
from time import sleep

# === CONFIG ===
API_URL = "http://127.0.0.1:8000/predict_routes"
LAT_MIN, LAT_MAX = 13.02, 13.06  # narrowed to better routes
LNG_MIN, LNG_MAX = 80.23, 80.27
MAX_ATTEMPTS = 200
TARGET_VALID_SAMPLES = 100

def random_point():
    return {
        "lat": round(random.uniform(LAT_MIN, LAT_MAX), 6),
        "lng": round(random.uniform(LNG_MIN, LNG_MAX), 6)
    }

data_rows = []
attempts = 0

while len(data_rows) < TARGET_VALID_SAMPLES and attempts < MAX_ATTEMPTS:
    start = random_point()
    end = random_point()
    attempts += 1

    if start == end:
        continue  # Skip same point

    payload = { "start": start, "end": end }

    try:
        res = requests.post(API_URL, json=payload)
        res.raise_for_status()
        json_data = res.json()

        # Defensive check for missing route data
        if (
            "shortest_route" not in json_data or
            "features" not in json_data["shortest_route"] or
            not json_data["shortest_route"]["features"] or
            "ev_station_route" not in json_data or
            "features" not in json_data["ev_station_route"] or
            not json_data["ev_station_route"]["features"]
        ):
            print(f"⚠️ Skipping attempt {attempts}: incomplete route data")
            sleep(1.5)
            continue

        shortest = json_data["shortest_route"]["features"][0]["properties"]["summary"]
        ev_route = json_data["ev_station_route"]["features"][0]["properties"]["summary"]

        row = {
            "start_lat": start["lat"],
            "start_lng": start["lng"],
            "end_lat": end["lat"],
            "end_lng": end["lng"],
            "shortest_distance_km": round(shortest["distance"] / 1000, 2),
            "shortest_eta_min": round(shortest["duration"] / 60, 2),
            "ev_route_distance_km": round(ev_route["distance"] / 1000, 2),
            "ev_route_eta_min": round(ev_route["duration"] / 60, 2)
        }

        data_rows.append(row)
        print(f"✅ Sample {len(data_rows)} added (attempt {attempts})")

        # Avoid ORS rate-limiting
        sleep(1.5)
        if attempts % 25 == 0:
            print("🛑 Cooling down for 10s to avoid ORS rate-limit")
            sleep(10)

    except Exception as e:
        print(f"❌ Error on attempt {attempts}: {e}")
        sleep(1.5)
        continue

# === Save to CSV ===
if data_rows:
    with open("route_dataset.csv", "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=data_rows[0].keys())
        writer.writeheader()
        writer.writerows(data_rows)
    print(f"✅ Done! Saved {len(data_rows)} samples to route_dataset.csv")
else:
    print("⚠️ No valid samples generated.")
