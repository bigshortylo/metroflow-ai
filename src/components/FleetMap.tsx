
"use client";

import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Vehicle = {
  id: string;
  location: string;
  battery: number;
  passengers: number;
  capacity: number;
  status: string;
  lat: number;
  lng: number;
};

type FleetMapProps = {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
};

function createBusIcon(battery: number, selected: boolean) {
  const color =
    battery <= 20 ? "#ef4444" :
    battery <= 40 ? "#f59e0b" :
    "#22c55e";

  const size = selected ? 44 : 34;

  return L.divIcon({
    className: "custom-bus-marker",
    html: `
      <div style="
        background: ${color};
        width: ${size}px;
        height: ${size}px;
        border: ${selected ? "4px solid white" : "2px solid white"};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #06111f;
        font-size: 17px;
        font-weight: bold;
        box-shadow: 0 0 15px ${color};
      ">B</div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function MapLifecycle({
  vehicles,
  selectedVehicleId,
}: FleetMapProps) {
  const map = useMap();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => window.clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    const selectedBus = vehicles.find(
      (bus) => bus.id === selectedVehicleId
    );

    if (selectedBus) {
      map.flyTo(
        [selectedBus.lat, selectedBus.lng],
        15,
        { duration: 1 }
      );
    }
  }, [selectedVehicleId, vehicles, map]);

  return null;
}

export default function FleetMap({
  vehicles,
  selectedVehicleId,
}: FleetMapProps) {
  const markerIcons = useMemo(() => {
    return new Map(
      vehicles.map((bus) => [
        bus.id,
        createBusIcon(
          bus.battery,
          bus.id === selectedVehicleId
        ),
      ])
    );
  }, [vehicles, selectedVehicleId]);

  return (
    <div className="h-[500px] w-full overflow-hidden rounded-xl border border-slate-200">
      <MapContainer
        center={[37.6879, -122.4702]}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
        key="metroflow-leaflet-map"
      >
        <MapLifecycle
          vehicles={vehicles}
          selectedVehicleId={selectedVehicleId}
        />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {vehicles.map((bus) => (
          <Marker
            key={bus.id}
            position={[bus.lat, bus.lng]}
            icon={markerIcons.get(bus.id)!}
          >
            <Popup>
              <strong>{bus.id}</strong>
              <br />
              Location: {bus.location}
              <br />
              Battery: {bus.battery}%
              <br />
              Passengers: {bus.passengers}/{bus.capacity}
              <br />
              Status: {bus.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
