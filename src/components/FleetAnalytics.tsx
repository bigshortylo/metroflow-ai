
"use client";

import {
  Activity,
  BatteryCharging,
  BusFront,
  Users,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

type Vehicle = {
  id: string;
  battery: number;
  passengers: number;
  capacity: number;
  status: string;
};

export default function FleetAnalytics({
  vehicles,
}: {
  vehicles: Vehicle[];
}) {
  const totalVehicles = vehicles.length;

  const inService = vehicles.filter(
    (bus) => bus.status === "In Service"
  ).length;

  const delayed = vehicles.filter(
    (bus) => bus.status === "Delayed"
  ).length;

  const charging = vehicles.filter(
    (bus) => bus.status === "Charging"
  ).length;

  const maintenance = vehicles.filter(
    (bus) => bus.status === "Maintenance"
  ).length;

  const totalCapacity = vehicles.reduce(
    (sum, bus) => sum + bus.capacity,
    0
  );

  const totalPassengers = vehicles.reduce(
    (sum, bus) => sum + bus.passengers,
    0
  );

  const utilization =
    totalCapacity > 0
      ? Math.round((totalPassengers / totalCapacity) * 100)
      : 0;

  const healthyBattery = vehicles.filter(
    (bus) => bus.battery > 40
  ).length;

  const lowBattery = vehicles.filter(
    (bus) => bus.battery > 20 && bus.battery <= 40
  ).length;

  const criticalBattery = vehicles.filter(
    (bus) => bus.battery <= 20
  ).length;

  const averageBattery =
    totalVehicles > 0
      ? Math.round(
          vehicles.reduce((sum, bus) => sum + bus.battery, 0) /
            totalVehicles
        )
      : 0;

  const statusItems = [
    { label: "In Service", count: inService, color: "bg-green-500", text: "text-green-700" },
    { label: "Delayed", count: delayed, color: "bg-amber-500", text: "text-amber-700" },
    { label: "Charging", count: charging, color: "bg-cyan-500", text: "text-cyan-700" },
    { label: "Maintenance", count: maintenance, color: "bg-red-500", text: "text-red-700" },
  ];

  const batteryItems = [
    { label: "Healthy", count: healthyBattery, color: "bg-green-500", text: "text-green-700" },
    { label: "Low", count: lowBattery, color: "bg-amber-500", text: "text-amber-700" },
    { label: "Critical", count: criticalBattery, color: "bg-red-500", text: "text-red-700" },
  ];

  return (
    <section className="space-y-6">

      {/* Analytics Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            Operational Intelligence
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950">
            Fleet Performance Analytics
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Live calculations from simulated fleet records
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2">
          <Activity size={16} className="text-green-700" />
          <span className="text-xs font-bold text-green-800">
            DATA AVAILABLE
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-600">
              Fleet Size
            </p>
            <BusFront className="text-blue-600" size={21} />
          </div>
          <p className="mt-4 text-4xl font-bold text-slate-950">
            {totalVehicles}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Registered vehicles
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-600">
              Average Battery
            </p>
            <BatteryCharging className="text-green-600" size={21} />
          </div>
          <p className="mt-4 text-4xl font-bold text-slate-950">
            {averageBattery}%
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-green-500"
              style={{ width: `${averageBattery}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-600">
              Passengers
            </p>
            <Users className="text-blue-600" size={21} />
          </div>
          <p className="mt-4 text-4xl font-bold text-slate-950">
            {totalPassengers}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Across all vehicles
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-600">
              Capacity Utilization
            </p>
            <Activity className="text-purple-600" size={21} />
          </div>
          <p className="mt-4 text-4xl font-bold text-slate-950">
            {utilization}%
          </p>
          <p className="mt-2 text-xs text-slate-500">
            {totalPassengers} of {totalCapacity} seats occupied
          </p>
        </div>

      </div>

      {/* Breakdown Panels */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Fleet Status */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-3">
              <BusFront className="text-blue-700" size={21} />
            </div>
            <div>
              <h3 className="font-bold text-slate-950">
                Fleet Status Distribution
              </h3>
              <p className="text-xs text-slate-500">
                Vehicle operational states
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {statusItems.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex justify-between">
                  <span className="text-sm font-semibold text-slate-700">
                    {item.label}
                  </span>
                  <span className={`text-sm font-bold ${item.text}`}>
                    {item.count} / {totalVehicles}
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{
                      width: `${totalVehicles > 0 ? (item.count / totalVehicles) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Battery Health */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-green-50 p-3">
              <BatteryCharging className="text-green-700" size={21} />
            </div>
            <div>
              <h3 className="font-bold text-slate-950">
                Battery Health Distribution
              </h3>
              <p className="text-xs text-slate-500">
                Vehicle battery condition
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {batteryItems.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex justify-between">
                  <span className="text-sm font-semibold text-slate-700">
                    {item.label}
                  </span>
                  <span className={`text-sm font-bold ${item.text}`}>
                    {item.count} vehicles
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{
                      width: `${totalVehicles > 0 ? (item.count / totalVehicles) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Operational Insights */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-amber-50 p-3">
            <Activity className="text-amber-700" size={21} />
          </div>
          <div>
            <h3 className="font-bold text-slate-950">
              Operational Insights
            </h3>
            <p className="text-xs text-slate-500">
              Automatically calculated from current fleet conditions
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">

          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <AlertTriangle className="mt-0.5 shrink-0 text-red-700" size={20} />
            <div>
              <p className="text-sm font-bold text-red-900">
                Critical Battery Vehicles
              </p>
              <p className="mt-1 text-sm text-red-800">
                {criticalBattery} vehicle(s) have battery levels at or below 20%.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <AlertTriangle className="mt-0.5 shrink-0 text-amber-700" size={20} />
            <div>
              <p className="text-sm font-bold text-amber-900">
                Delayed Vehicles
              </p>
              <p className="mt-1 text-sm text-amber-800">
                {delayed} vehicle(s) currently have delayed status.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
            <CheckCircle2 className="mt-0.5 shrink-0 text-green-700" size={20} />
            <div>
              <p className="text-sm font-bold text-green-900">
                Vehicles In Service
              </p>
              <p className="mt-1 text-sm text-green-800">
                {inService} vehicle(s) are currently marked in service.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-cyan-200 bg-cyan-50 p-4">
            <BatteryCharging className="mt-0.5 shrink-0 text-cyan-700" size={20} />
            <div>
              <p className="text-sm font-bold text-cyan-900">
                Charging Vehicles
              </p>
              <p className="mt-1 text-sm text-cyan-800">
                {charging} vehicle(s) are currently charging.
              </p>
            </div>
          </div>

        </div>
      </div>

      <p className="text-center text-xs text-slate-500">
        METROFLOW AI · Fleet analytics are calculated from simulated operational records.
      </p>

    </section>
  );
}
