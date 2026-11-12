
import Link from "next/link";
import {
  ArrowLeft,
  BusFront,
  BatteryCharging,
  Users,
  MapPin,
  UserRound,
  AlertTriangle,
  Activity,
  Video,
  Camera,
  Radio,
  Wrench,
  CalendarDays,
  ClipboardList,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export const instant = false;

type Props = {
  params: Promise<{ vehicleId: string }>;
};

type MaintenanceLog = {
  id: string;
  vehicle_id: string;
  component: string;
  service_type: string;
  work_performed: string;
  technician: string | null;
  service_date: string;
  notes: string | null;
};

function formatServiceDate(date: string) {
  return new Date(date).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function VehicleStatusPage({ params }: Props) {
  const { vehicleId } = await params;

  const { data: vehicle, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", vehicleId)
    .maybeSingle();

  if (error || !vehicle) {
    return (
      <main className="min-h-screen bg-[#f3f6fa] p-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-white p-8">
          <AlertTriangle className="mb-4 text-red-600" size={32} />
          <h1 className="text-2xl font-black text-slate-950">
            Unable to Load Vehicle
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Vehicle ID: {vehicleId}
          </p>
          <p className="mt-2 text-sm text-red-600">
            {error?.message || "No matching vehicle was found."}
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 font-bold text-blue-600"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const [
    driverResult,
    routeResult,
    maintenanceResult,
  ] = await Promise.all([
    supabase
      .from("drivers")
      .select("driver_id, full_name, status")
      .eq("assigned_vehicle_id", vehicleId)
      .maybeSingle(),

    vehicle.route_id
      ? supabase
          .from("routes")
          .select("id, name")
          .eq("id", vehicle.route_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),

    supabase
      .from("maintenance_logs")
      .select("*")
      .eq("vehicle_id", vehicleId)
      .order("service_date", { ascending: false }),
  ]);

  const driver = driverResult.data;
  const route = routeResult.data;
  const maintenanceLogs = (maintenanceResult.data ?? []) as MaintenanceLog[];

  const battery = Number(vehicle.battery ?? 0);
  const passengers = Number(vehicle.passengers ?? 0);
  const capacity = Number(vehicle.capacity ?? 0);

  const batteryColor =
    battery <= 20
      ? "text-red-600"
      : battery <= 40
        ? "text-amber-600"
        : "text-emerald-600";

  const batteryBar =
    battery <= 20
      ? "bg-red-500"
      : battery <= 40
        ? "bg-amber-500"
        : "bg-emerald-500";

  return (
    <main className="min-h-screen bg-[#f3f6fa] px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-8">

        <Link
          href="/fleet-intelligence"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-950"
        >
          <ArrowLeft size={17} />
          Back to Fleet Directory
        </Link>

        {/* VEHICLE HEADER */}

        <section className="flex flex-col justify-between gap-5 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:flex-row md:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-blue-600">
              <Activity size={17} />
              Vehicle Status
            </div>

            <h1 className="text-4xl font-black text-slate-950">
              {vehicle.id}
            </h1>

            <p className="mt-2 text-slate-500">
              Individual vehicle operational report
            </p>
          </div>

          <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">
            {vehicle.status}
          </span>
        </section>

        {/* CAMERA FOOTAGE */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-slate-950 p-3 text-white">
                <Video size={22} />
              </div>

              <div>
                <h2 className="text-lg font-black text-slate-950">
                  Live Camera Footage
                </h2>
                <p className="text-xs text-slate-500">
                  Onboard vehicle camera monitoring
                </p>
              </div>
            </div>

            <span className="flex items-center gap-2 rounded-full bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              DEMO SIMULATION
            </span>
          </div>

          <div className="relative flex aspect-video max-h-[480px] items-center justify-center overflow-hidden bg-[#111827]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-700 via-slate-900 to-black" />

            <div className="absolute left-5 top-5 flex items-center gap-2 rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-xs font-bold text-white">
              <Camera size={15} />
              CAMERA 01 · FRONT VIEW
            </div>

            <div className="absolute right-5 top-5 flex items-center gap-2 rounded-lg bg-black/50 px-3 py-2 text-xs font-bold text-amber-300">
              <Radio size={14} />
              NO LIVE STREAM CONNECTED
            </div>

            <div className="relative z-10 max-w-md px-6 text-center">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300">
                <Video size={38} />
              </div>

              <h3 className="text-xl font-black text-white">
                Camera Feed Unavailable
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                This is a simulated camera monitoring interface. Connect
                a compatible video stream to display actual onboard footage.
              </p>

              <span className="mt-5 inline-flex rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300">
                {vehicle.id} · Front Camera
              </span>
            </div>

            <div className="absolute bottom-5 left-5 text-xs font-medium text-slate-400">
              METROFLOW AI · SIMULATED ENVIRONMENT
            </div>

            <div className="absolute bottom-5 right-5 text-xs font-medium text-slate-400">
              CAMERA STATUS: OFFLINE
            </div>
          </div>
        </section>

        {/* VEHICLE METRICS */}

        <section className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">
                Battery Level
              </p>
              <BatteryCharging className="text-blue-600" size={22} />
            </div>

            <p className={`mt-4 text-4xl font-black ${batteryColor}`}>
              {battery}%
            </p>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${batteryBar}`}
                style={{
                  width: `${Math.min(100, Math.max(0, battery))}%`,
                }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">
                Passenger Load
              </p>
              <Users className="text-blue-600" size={22} />
            </div>

            <p className="mt-4 text-4xl font-black text-slate-950">
              {passengers}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              {capacity > 0
                ? `${capacity} passenger capacity`
                : "Simulated passenger count"}
            </p>
          </div>
        </section>

        {/* VEHICLE AND DRIVER DETAILS */}

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <BusFront size={22} />
              </div>
              <h2 className="font-black text-slate-950">
                Vehicle Information
              </h2>
            </div>

            <div className="space-y-5">
              <div className="flex justify-between gap-4 border-b border-slate-100 pb-4">
                <span className="text-sm text-slate-500">Vehicle ID</span>
                <span className="text-sm font-bold text-slate-900">
                  {vehicle.id}
                </span>
              </div>

              <div className="flex justify-between gap-4 border-b border-slate-100 pb-4">
                <span className="text-sm text-slate-500">
                  Operational Status
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {vehicle.status}
                </span>
              </div>

              <div className="flex justify-between gap-4 border-b border-slate-100 pb-4">
                <span className="text-sm text-slate-500">
                  Assigned Route
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {route?.name ?? vehicle.route_id ?? "Unassigned"}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-sm text-slate-500">Location</span>
                <span className="text-right text-sm font-bold text-slate-900">
                  {vehicle.location ?? "Unknown"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <UserRound size={22} />
              </div>
              <h2 className="font-black text-slate-950">
                Assigned Driver
              </h2>
            </div>

            {driver ? (
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Driver Name
                  </p>
                  <p className="mt-2 text-xl font-black text-slate-950">
                    {driver.full_name}
                  </p>
                </div>

                <div className="flex justify-between border-b border-slate-100 pb-4">
                  <span className="text-sm text-slate-500">Driver ID</span>
                  <span className="text-sm font-bold text-slate-900">
                    {driver.driver_id}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">
                    Driver Status
                  </span>
                  <span className="text-sm font-bold text-emerald-600">
                    {driver.status}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No driver is currently assigned to this vehicle.
              </p>
            )}
          </div>
        </section>

        {/* LOCATION */}

        <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 p-3 text-slate-600">
              <MapPin size={22} />
            </div>
            <h2 className="font-black text-slate-950">
              Vehicle Location
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400">Current Location</p>
              <p className="mt-2 font-bold text-slate-900">
                {vehicle.location ?? "Unknown"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400">Latitude</p>
              <p className="mt-2 font-bold text-slate-900">
                {vehicle.lat ?? "Unavailable"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400">Longitude</p>
              <p className="mt-2 font-bold text-slate-900">
                {vehicle.lng ?? "Unavailable"}
              </p>
            </div>
          </div>
        </section>

        {/* MAINTENANCE HISTORY */}

        <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Wrench size={22} />
              </div>

              <div>
                <h2 className="font-black text-slate-950">
                  Maintenance History
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Service records for {vehicle.id}
                </p>
              </div>
            </div>

            <span className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700">
              <ClipboardList className="mr-2 inline" size={15} />
              {maintenanceLogs.length} service records
            </span>
          </div>

          {maintenanceResult.error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5">
              <p className="font-bold text-red-800">
                Unable to load maintenance records
              </p>
              <p className="mt-1 text-sm text-red-700">
                {maintenanceResult.error.message}
              </p>
            </div>
          ) : maintenanceLogs.length > 0 ? (
            <div className="space-y-5">
              {maintenanceLogs.map((log) => (
                <div
                  key={log.id}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-black text-slate-950">
                        {log.component}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-blue-600">
                        {log.service_type}
                      </p>
                    </div>

                    <span className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-600">
                      <CalendarDays size={14} />
                      {formatServiceDate(log.service_date)}
                    </span>
                  </div>

                  <div className="mt-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Work Performed
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700">
                      {log.work_performed}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                    <UserRound size={15} />
                    <span className="font-semibold">Technician:</span>
                    <span>{log.technician || "Not recorded"}</span>
                  </div>

                  {log.notes && (
                    <div className="mt-4 rounded-lg border border-slate-100 bg-white p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Service Notes
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        {log.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-slate-50 p-8 text-center">
              <Wrench className="mx-auto mb-3 text-slate-400" size={30} />
              <p className="font-bold text-slate-800">
                No Maintenance History
              </p>
              <p className="mt-1 text-sm text-slate-500">
                No service records have been added for this vehicle yet.
              </p>
            </div>
          )}
        </section>

        <p className="text-center text-xs text-slate-400">
          METROFLOW AI · Simulated fleet data · Human operator oversight required
        </p>
      </div>
    </main>
  );
}
