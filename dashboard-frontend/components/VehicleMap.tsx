"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";

type GpsPosition = {
  id: string;
  latitude: number;
  longitude: number;
  timestamp: string;
};

type Vehicle = {
  id: string;
  plateNumber: string;
  type: string;
  status: string;
  positions?: GpsPosition[];
};

type VehicleMapProps = {
  vehicles: Vehicle[];
};

const defaultIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function getLatestPosition(vehicle: Vehicle): GpsPosition | null {
  if (!vehicle.positions || vehicle.positions.length === 0) {
    return null;
  }

  return [...vehicle.positions].sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )[0];
}

export default function VehicleMap({ vehicles }: VehicleMapProps) {
  const vehiclesWithPositions = vehicles
    .map((vehicle) => ({
      vehicle,
      latestPosition: getLatestPosition(vehicle),
    }))
    .filter((item) => item.latestPosition !== null);

  return (
    <MapContainer
      center={[36.8065, 10.1815]}
      zoom={12}
      scrollWheelZoom
      className="h-[600px] w-full rounded-3xl"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {vehiclesWithPositions.map(({ vehicle, latestPosition }) => {
        if (!latestPosition) return null;

        return (
          <Marker
            key={vehicle.id}
            position={[latestPosition.latitude, latestPosition.longitude]}
            icon={defaultIcon}
          >
            <Popup>
              <div className="space-y-1">
                <p className="font-semibold">{vehicle.plateNumber}</p>
                <p>Type: {vehicle.type}</p>
                <p>Status: {vehicle.status}</p>
                <p>Latitude: {latestPosition.latitude}</p>
                <p>Longitude: {latestPosition.longitude}</p>
                <p>
                  Time:{" "}
                  {new Date(latestPosition.timestamp).toLocaleString()}
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}