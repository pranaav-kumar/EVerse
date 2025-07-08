import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.multioutput import MultiOutputRegressor
from sklearn.model_selection import train_test_split
import joblib

# Load the dataset
df = pd.read_csv("route_dataset.csv")

# Define input features and target labels
X = df[["start_lat", "start_lng", "end_lat", "end_lng"]]
y = df[["shortest_eta_min", "ev_route_eta_min", "ev_route_distance_km"]]

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = MultiOutputRegressor(RandomForestRegressor(n_estimators=150, random_state=42))
model.fit(X_train, y_train)

# Save the model
joblib.dump(model, "ev_route_model.pkl")
print("✅ Model saved as ev_route_model.pkl")
