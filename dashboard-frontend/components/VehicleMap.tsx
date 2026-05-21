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
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function VehicleMap({ vehicles }: VehicleMapProps) {
  const markers = vehicles.flatMap((vehicle) =>
    (vehicle.positions ?? []).map((position, index) => ({
      vehicle,
      position,
      index,
    }))
  );

  function getMarkerPosition(latitude: number, longitude: number, index: number) {
    const offset = index * 0.0003;

    return [latitude + offset, longitude + offset] as [number, number];
  }

  return (
    <MapContainer
      center={[36.8065, 10.1815]}
      zoom={13}
      scrollWheelZoom
      className="h-[600px] w-full rounded-3xl"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {markers.map(({ vehicle, position, index }) => (
        <Marker
          key={`${vehicle.id}-${position.id}`}
          position={getMarkerPosition(
            position.latitude,
            position.longitude,
            index
          )}
          icon={defaultIcon}
        >
          <Popup>
            <div className="space-y-1">
              <p className="font-semibold">{vehicle.plateNumber}</p>
              <p>Vehicle ID: {vehicle.id}</p>
              <p>Type: {vehicle.type}</p>
              <p>Status: {vehicle.status}</p>
              <p>Position ID: {position.id}</p>
              <p>Latitude: {position.latitude}</p>
              <p>Longitude: {position.longitude}</p>
              <p>Time: {new Date(position.timestamp).toLocaleString()}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}