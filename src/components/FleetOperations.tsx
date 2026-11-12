
"use client";

import { useState } from "react";
import {
  Activity,
  MapPin,
  BusFront,
  BatteryCharging,
} from "lucide-react";
import FleetMapLoader from "@/components/FleetMapLoader";

type Vehicle = {
  id: string;
  route_id: string | null;
  location: string;
  battery: number;
  passengers: number;
  capacity: number;
  status: string;
  lat: number;
  lng: number;
};

type Route = {
  id: string;
  name: string;
};

export default function FleetOperations({
  vehicles,
  routes,
}: {
  vehicles: Vehicle[];
  routes: Route[];
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedBus = vehicles.find(
    (bus) => bus.id === selectedId
  );

  const routeNames = new Map(
    routes.map((route) => [route.id, route.name])
  );

  return (
    <div className="space-y-8">

      {/* Fleet Map */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(70,90,120,0.08)]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Live Fleet Map
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Simulated vehicle positions across Daly City
            </p>
          </div>

          <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-3">
            <MapPin className="text-cyan-700" />
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
          <FleetMapLoader
            vehicles={vehicles}
            selectedVehicleId={selectedId}
          />
        </div>
      </section>

      {/* Selected Vehicle */}
      {selectedBus && (
        <section className="rounded-2xl border border-green-200 bg-white p-5 shadow-[0_10px_30px_rgba(70,110,100,0.08)]">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-green-100 bg-green-50 p-3">
                <BusFront className="text-green-700" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedBus.id}
                </h3>
                <p className="text-xs text-slate-600">
                  Selected vehicle details
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedId(null)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-200 hover:text-slate-950"
            >
              Clear Selection
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-600">
                Battery
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {selectedBus.battery}%
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-600">
                Passengers
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {selectedBus.passengers}/{selectedBus.capacity}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-600">
                Status
              </p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {selectedBus.status}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-600">
                Location
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                {selectedBus.location}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Fleet Status */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(70,90,120,0.08)]">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Fleet Status
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Select a vehicle to inspect its operations
            </p>
          </div>

          <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-3">
            <Activity className="text-cyan-700" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-y border-slate-200 bg-slate-100 text-xs font-bold uppercase tracking-wider text-slate-700">
              <tr>
                <th className="p-4">Vehicle</th>
                <th className="p-4">Location</th>
                <th className="p-4">Route</th>
                <th className="p-4">Battery</th>
                <th className="p-4">Passengers</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {vehicles.map((bus) => (
                <tr
                  key={bus.id}
                  onClick={() => setSelectedId(bus.id)}
                  className={`cursor-pointer border-b border-slate-100 transition-colors duration-200 ${
                    selectedId === bus.id
                      ? "bg-cyan-100"
                      : "bg-white hover:bg-slate-100"
                  }`}
                >
                  <td className="p-4 font-bold text-slate-900">
                    {bus.id}
                  </td>

                  <td className="p-4 text-sm font-medium text-slate-700">
                    <span className="flex items-center gap-2">
                      <MapPin
                        size={15}
                        className="shrink-0 text-cyan-700"
                      />
                      {bus.location}
                    </span>
                  </td>

                  <td className="p-4 text-sm font-medium text-slate-700">
                    {routeNames.get(bus.route_id ?? "") || "Unassigned"}
                  </td>

                  <td className="p-4">
                    <div className="min-w-[130px] space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <span
                          className={`font-bold ${
                            bus.battery <= 20
                              ? "text-red-700"
                              : bus.battery <= 40
                                ? "text-amber-700"
                                : "text-green-700"
                          }`}
                        >
                          {bus.battery}%
                        </span>

                        <span className="text-xs font-semibold text-slate-600">
                          {bus.battery <= 20
                            ? "Critical"
                            : bus.battery <= 40
                              ? "Low"
                              : "Healthy"}
                        </span>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className={`h-full rounded-full transition-all ${
                            bus.battery <= 20
                              ? "bg-red-500"
                              : bus.battery <= 40
                                ? "bg-amber-500"
                                : "bg-green-500"
                          }`}
                          style={{ width: `${bus.battery}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-sm font-semibold text-slate-800">
                    {bus.passengers}/{bus.capacity}
                  </td>

                  <td className="p-4">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-bold ${
                        bus.status === "In Service"
                          ? "border-green-200 bg-green-50 text-green-800"
                          : bus.status === "Delayed"
                            ? "border-amber-200 bg-amber-50 text-amber-800"
                            : bus.status === "Charging"
                              ? "border-cyan-200 bg-cyan-50 text-cyan-800"
                              : "border-red-200 bg-red-50 text-red-800"
                      }`}
                    >
                      {bus.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-2 border-t border-slate-200 bg-slate-50 p-4 text-xs font-medium text-slate-600">
          <BatteryCharging size={14} className="text-cyan-700" />
          Fleet information is based on simulated operational data.
        </div>
      </section>
    </div>
  );
}
