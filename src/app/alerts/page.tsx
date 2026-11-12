
import Link from "next/link";
import {
  ArrowLeft,
  AlertTriangle,
  BatteryWarning,
  BusFront,
  MapPin,
  Clock,
  ShieldCheck,
  Activity,
  UserRound,
  Siren,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

export const instant = false;

type Vehicle = {
  id: string;
  battery: number;
  location: string;
  status: string;
};

type Incident = {
  id: string;
  vehicle_id: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  driver_name: string | null;
  driver_id: string | null;
  location: string | null;
  created_at: string;
};

export default async function AlertsPage() {
  const [
    { data: vehicles, error: vehicleError },
    { data: incidents, error: incidentError },
  ] = await Promise.all([
    supabase
      .from("vehicles")
      .select("id, battery, location, status")
      .order("id"),

    supabase
      .from("incidents")
      .select("*")
      .eq("status", "Active")
      .order("created_at", { ascending: false }),
  ]);

  const fleet = (vehicles ?? []) as Vehicle[];
  const activeIncidents = (incidents ?? []) as Incident[];

  const criticalBatteries = fleet.filter(
    (vehicle) => vehicle.battery <= 20
  );

  const delayedVehicles = fleet.filter(
    (vehicle) => vehicle.status === "Delayed"
  );

  const maintenanceVehicles = fleet.filter(
    (vehicle) => vehicle.status === "Maintenance"
  );

  const totalAlerts =
    criticalBatteries.length +
    delayedVehicles.length +
    maintenanceVehicles.length +
    activeIncidents.length;

  const error = vehicleError || incidentError;

  function formatDate(date: string) {
    return new Date(date).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  return (
    <main className="min-h-screen bg-[#f3f6fa] px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-[1500px] space-y-8">

        <header className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <Link
              href="/"
              className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950"
            >
              <ArrowLeft size={17} />
              Back to Operations Overview
            </Link>

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">
              Network Command
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Operational Alert Center
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Centralized monitoring for accidents, fleet conditions and operational risks.
            </p>
          </div>

          <div className="rounded-2xl border border-red-200 bg-white px-6 py-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Active Alerts
            </p>
            <p className="mt-2 text-4xl font-bold text-red-700">
              {totalAlerts}
            </p>
          </div>
        </header>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
            Unable to load all alert information. Check your Supabase connection and database permissions.
          </div>
        )}

        {/* ALERT SUMMARY */}

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-600">
                Accident Notifications
              </p>
              <Siren className="text-red-700" size={22} />
            </div>
            <p className="mt-4 text-4xl font-bold text-red-700">
              {activeIncidents.length}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Active incident reports
            </p>
          </div>

          <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-600">
                Critical Batteries
              </p>
              <BatteryWarning className="text-red-700" size={22} />
            </div>
            <p className="mt-4 text-4xl font-bold text-red-700">
              {criticalBatteries.length}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Battery at 20% or below
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-600">
                Delayed Vehicles
              </p>
              <Clock className="text-amber-700" size={22} />
            </div>
            <p className="mt-4 text-4xl font-bold text-amber-700">
              {delayedVehicles.length}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Vehicles reporting delays
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-600">
                Maintenance
              </p>
              <BusFront className="text-slate-700" size={22} />
            </div>
            <p className="mt-4 text-4xl font-bold text-slate-900">
              {maintenanceVehicles.length}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Vehicles in maintenance
            </p>
          </div>

        </section>

        {/* ACCIDENT NOTIFICATIONS */}

        <section className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold text-slate-950">
                <AlertTriangle size={22} className="text-red-700" />
                Accident Notifications
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Active incident reports requiring operator attention.
              </p>
            </div>

            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
              {activeIncidents.length} Active
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm">
            {activeIncidents.length === 0 ? (
              <div className="p-10 text-center">
                <ShieldCheck
                  size={34}
                  className="mx-auto text-green-600"
                />
                <p className="mt-3 font-bold text-slate-900">
                  No active accident notifications
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  New incident reports will appear here when recorded.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-red-100">
                {activeIncidents.map((incident) => (
                  <Link
                    key={incident.id}
                    href={`/fleet/${encodeURIComponent(incident.vehicle_id)}`}
                    className="block p-6 transition hover:bg-red-50/50"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="rounded-xl bg-red-100 p-3">
                          <Siren
                            size={23}
                            className="text-red-700"
                          />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-slate-950">
                              {incident.title}
                            </h3>
                            <span className="rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-800">
                              {incident.status}
                            </span>
                          </div>

                          <p className="mt-1 text-sm font-semibold text-slate-700">
                            Vehicle {incident.vehicle_id}
                          </p>

                          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
                            {incident.description}
                          </p>
                        </div>
                      </div>

                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-800">
                        {incident.severity}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-3 border-t border-red-100 pt-4 sm:grid-cols-2 xl:grid-cols-4">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <UserRound size={15} />
                        <span>
                          Driver: {incident.driver_name || "Not recorded"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Activity size={15} />
                        <span>
                          Driver ID: {incident.driver_id || "Not recorded"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <MapPin size={15} />
                        <span>
                          {incident.location || "Location not recorded"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Clock size={15} />
                        <span>
                          {formatDate(incident.created_at)}
                        </span>
                      </div>
                    </div>

                    <p className="mt-4 text-xs font-bold text-red-700">
                      View vehicle status and incident history →
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* OTHER FLEET CONDITIONS */}

        <section className="space-y-5">
          <div>
            <h2 className="text-xl font-bold text-slate-950">
              Other Fleet Conditions
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Select a vehicle to review its operational status.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

            {criticalBatteries.map((vehicle) => (
              <Link
                key={`battery-${vehicle.id}`}
                href={`/fleet/${encodeURIComponent(vehicle.id)}`}
                className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-red-400 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-950">
                    {vehicle.id}
                  </span>
                  <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
                    Critical Battery
                  </span>
                </div>

                <p className="mt-5 text-3xl font-bold text-red-700">
                  {vehicle.battery}%
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Remaining battery
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs text-slate-600">
                  <MapPin size={14} />
                  {vehicle.location}
                </div>
              </Link>
            ))}

            {delayedVehicles.map((vehicle) => (
              <Link
                key={`delayed-${vehicle.id}`}
                href={`/fleet/${encodeURIComponent(vehicle.id)}`}
                className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-amber-400 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-950">
                    {vehicle.id}
                  </span>
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">
                    Delayed
                  </span>
                </div>

                <p className="mt-5 text-lg font-bold text-amber-800">
                  Operational Delay
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs text-slate-600">
                  <MapPin size={14} />
                  {vehicle.location}
                </div>
              </Link>
            ))}

            {maintenanceVehicles.map((vehicle) => (
              <Link
                key={`maintenance-${vehicle.id}`}
                href={`/fleet/${encodeURIComponent(vehicle.id)}`}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-slate-400 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-950">
                    {vehicle.id}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                    Maintenance
                  </span>
                </div>

                <p className="mt-5 text-lg font-bold text-slate-800">
                  Maintenance Required
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs text-slate-600">
                  <MapPin size={14} />
                  {vehicle.location}
                </div>
              </Link>
            ))}

            {criticalBatteries.length === 0 &&
              delayedVehicles.length === 0 &&
              maintenanceVehicles.length === 0 && (
                <div className="col-span-full rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
                  <ShieldCheck
                    size={32}
                    className="mx-auto text-green-700"
                  />
                  <p className="mt-3 font-bold text-green-900">
                    No additional fleet condition alerts
                  </p>
                  <p className="mt-1 text-sm text-green-800">
                    No other vehicles currently meet the configured alert thresholds.
                  </p>
                </div>
              )}

          </div>
        </section>

        <footer className="border-t border-slate-200 py-6 text-center">
          <p className="text-xs font-bold tracking-wider text-slate-700">
            METROFLOW AI
          </p>
          <p className="mt-1 text-[10px] tracking-wider text-slate-500">
            SIMULATED FLEET DATA · INCIDENT REPORTING · OPERATOR CONTROL MAINTAINED
          </p>
        </footer>

      </div>
    </main>
  );
}
