
import Link from "next/link";
import {
  ArrowLeft,
  BusFront,
  BatteryCharging,
  Users,
  MapPin,
  Activity,
  Filter,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export const instant = false;

type Props = {
  searchParams: Promise<{ status?: string }>;
};

type Vehicle = {
  id: string;
  location: string | null;
  battery: number | null;
  passengers: number | null;
  capacity: number | null;
  status: string | null;
  updated_at: string | null;
};

type Driver = {
  driver_id: string;
  full_name: string;
  assigned_vehicle_id: string | null;
};

function getStatusStyle(status: string | null) {
  switch (status) {
    case "In Service":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Delayed":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Charging":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Maintenance":
      return "bg-slate-100 text-slate-600 border-slate-200";
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
}

function getBatteryColor(battery: number) {
  if (battery <= 20) return "bg-red-500";
  if (battery <= 40) return "bg-amber-500";
  return "bg-emerald-500";
}

function getBatteryTextColor(battery: number) {
  if (battery <= 20) return "text-red-600";
  if (battery <= 40) return "text-amber-600";
  return "text-emerald-600";
}

export default async function FleetIntelligencePage({
  searchParams,
}: Props) {
  const params = await searchParams;
  const activeOnly = params.status === "In-Service";

  const [vehicleResult, driverResult] = await Promise.all([
    supabase.from("vehicles").select("*").order("id"),
    supabase.from("drivers").select("driver_id, full_name, assigned_vehicle_id"),
  ]);

  const allVehicles = (vehicleResult.data ?? []) as Vehicle[];
  const drivers = (driverResult.data ?? []) as Driver[];

  const vehicles = activeOnly
    ? allVehicles.filter((vehicle) => vehicle.status === "In Service")
    : allVehicles;

  function getDriver(vehicleId: string) {
    return drivers.find(
      (driver) => driver.assigned_vehicle_id === vehicleId
    );
  }

  return (
    <main className="min-h-screen bg-[#f3f6fa] px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* HEADER */}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
              METROFLOW AI / OPERATIONS
            </p>

            <h1 className="mt-2 text-3xl font-black text-slate-950 md:text-4xl">
              Fleet Intelligence
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Fleet directory and individual vehicle status.
            </p>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
            <Activity className="mr-2 inline" size={17} />
            Fleet database
          </div>
        </div>

        {/* FLEET SUMMARY */}

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm font-semibold text-slate-500">
              {activeOnly ? "Active Vehicles" : "Registered Fleet"}
            </p>
            <p className="mt-1 text-3xl font-black text-slate-950">
              {vehicles.length}
              <span className="ml-2 text-base font-medium text-slate-400">
                vehicles
              </span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/fleet-intelligence"
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                !activeOnly
                  ? "bg-blue-600 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              All Vehicles
            </Link>

            <Link
              href="/fleet-intelligence?status=In-Service"
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
                activeOnly
                  ? "bg-blue-600 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Filter size={15} />
              Active Only
            </Link>
          </div>
        </div>

        {/* VEHICLE DIRECTORY */}

        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-950">
                {activeOnly ? "Active Fleet" : "All Vehicles"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Select a vehicle to view its complete operational status.
              </p>
            </div>
          </div>

          {vehicles.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <BusFront className="mx-auto mb-3 text-slate-400" size={32} />
              <p className="font-bold text-slate-800">
                No vehicles found
              </p>
              <p className="mt-1 text-sm text-slate-500">
                There are no vehicles matching this selection.
              </p>
              <Link
                href="/fleet-intelligence"
                className="mt-4 inline-block text-sm font-bold text-blue-600 hover:text-blue-800"
              >
                View entire fleet
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {vehicles.map((vehicle) => {
                const battery = Number(vehicle.battery ?? 0);
                const driver = getDriver(vehicle.id);

                return (
                  <Link
                    key={vehicle.id}
                    href={`/fleet/${encodeURIComponent(vehicle.id)}`}
                    className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
                  >
                    {/* VEHICLE HEADER */}

                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-blue-50 p-3 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                          <BusFront size={24} />
                        </div>

                        <div>
                          <h3 className="text-lg font-black text-slate-950 group-hover:text-blue-600">
                            {vehicle.id}
                          </h3>
                          <p className="text-xs text-slate-400">
                            Fleet vehicle
                          </p>
                        </div>
                      </div>

                      <span
                        className={`rounded-full border px-3 py-1 text-[11px] font-bold ${getStatusStyle(vehicle.status)}`}
                      >
                        {vehicle.status || "Unknown"}
                      </span>
                    </div>

                    {/* LOCATION */}

                    <div className="mt-6 flex items-center gap-2 text-sm text-slate-600">
                      <MapPin size={16} className="shrink-0 text-slate-400" />
                      <span>
                        {vehicle.location || "Location unavailable"}
                      </span>
                    </div>

                    {/* BATTERY */}

                    <div className="mt-6">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                          <BatteryCharging size={17} />
                          Battery Health
                        </div>

                        <span
                          className={`text-sm font-black ${getBatteryTextColor(battery)}`}
                        >
                          {battery}%
                        </span>
                      </div>

                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full transition-all ${getBatteryColor(battery)}`}
                          style={{
                            width: `${Math.min(100, Math.max(0, battery))}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* PASSENGERS AND DRIVER */}

                    <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                          <Users size={15} />
                          Passengers
                        </div>
                        <p className="mt-2 text-xl font-black text-slate-900">
                          {vehicle.passengers ?? 0}
                          <span className="ml-1 text-xs font-medium text-slate-400">
                            / {vehicle.capacity ?? "—"}
                          </span>
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-400">
                          Assigned Driver
                        </p>
                        <p className="mt-2 truncate text-sm font-bold text-slate-900">
                          {driver?.full_name || "Unassigned"}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-400">
                          {driver?.driver_id || "No driver ID"}
                        </p>
                      </div>
                    </div>

                    {/* VIEW STATUS */}

                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-sm font-bold text-blue-600">
                        View Vehicle Status
                      </span>
                      <span className="text-lg font-bold text-blue-600 transition group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <p className="text-center text-xs text-slate-400">
          METROFLOW AI · Simulated fleet data · Individual vehicle pages contain detailed operational records.
        </p>
      </div>
    </main>
  );
}
