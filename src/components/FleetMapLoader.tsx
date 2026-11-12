
"use client";

import dynamic from "next/dynamic";

const FleetMap = dynamic(
  () => import("@/components/FleetMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] bg-[#151e30] rounded-xl flex items-center justify-center text-gray-400">
        Loading Daly City fleet map...
      </div>
    ),
  }
);

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

export default function FleetMapLoader({
  vehicles,
  selectedVehicleId,
}: {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
}) {
  return (
    <FleetMap
      key="metroflow-fleet-map"
      vehicles={vehicles}
      selectedVehicleId={selectedVehicleId}
    />
  );
}
