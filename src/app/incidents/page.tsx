
import Link from "next/link";
import {
  AlertTriangle,
  ClipboardList,
  BusFront,
  Clock,
  Search,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export const instant = false;

type Incident = {
  id: string;
  vehicle_id: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  location: string | null;
  driver_name: string | null;
  vehicle_damaged: boolean | null;
  created_at: string;
};

export default async function IncidentsPage() {
  const { data: incidents, error } = await supabase
    .from("incidents")
    .select("*")
    .order("created_at", { ascending: false });

  const records = (incidents || []) as Incident[];

  const activeCount = records.filter(
    (incident) => incident.status === "Active"
  ).length;

  const criticalCount = records.filter(
    (incident) =>
      incident.severity?.toLowerCase() === "critical" ||
      incident.severity?.toLowerCase() === "high"
  ).length;

  const resolvedCount = records.filter(
    (incident) => incident.status === "Resolved"
  ).length;

  function severityStyle(severity: string) {
    switch (severity?.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-700";
      case "high":
        return "bg-orange-100 text-orange-700";
      case "medium":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  }

  function statusStyle(status: string) {
    return status === "Resolved"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-red-100 text-red-700";
  }

  return (
    <main className="min-h-screen bg-[#f3f6fa] px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-8">

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-bold tracking-wider text-blue-700">
              METROFLOW AI / OPERATIONS
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Incident Reports
            </h1>
            <p className="mt-2 text-slate-500">
              Centralized incident reporting, tracking, and resolution history.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm">
            <ClipboardList size={18} className="text-blue-600" />
            Incident Management Center
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Total Reports</p>
              <ClipboardList className="text-blue-600" size={21} />
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {records.length}
            </p>
            <p className="mt-1 text-xs text-slate-400">All recorded incidents</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Active Incidents</p>
              <AlertTriangle className="text-red-600" size={21} />
            </div>
            <p className="mt-3 text-3xl font-bold text-red-600">
              {activeCount}
            </p>
            <p className="mt-1 text-xs text-slate-400">Awaiting resolution</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">High Priority</p>
              <AlertTriangle className="text-orange-600" size={21} />
            </div>
            <p className="mt-3 text-3xl font-bold text-orange-600">
              {criticalCount}
            </p>
            <p className="mt-1 text-xs text-slate-400">High or critical severity</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Resolved</p>
              <ShieldCheck className="text-emerald-600" size={21} />
            </div>
            <p className="mt-3 text-3xl font-bold text-emerald-600">
              {resolvedCount}
            </p>
            <p className="mt-1 text-xs text-slate-400">Completed incident records</p>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Incident History
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                All incidents reported across the simulated fleet.
              </p>
            </div>
            <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600">
              {records.length} Records
            </span>
          </div>

          {error ? (
            <div className="p-8 text-center text-red-600">
              Unable to load incidents: {error.message}
            </div>
          ) : records.length === 0 ? (
            <div className="p-12 text-center">
              <ClipboardList className="mx-auto text-slate-300" size={42} />
              <h3 className="mt-4 font-bold text-slate-800">
                No incident reports yet
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Submitted vehicle incident reports will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {records.map((incident) => (
                <div
                  key={incident.id}
                  className="p-6 transition hover:bg-slate-50"
                >
                  <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-900">
                          {incident.title}
                        </h3>
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${severityStyle(incident.severity)}`}>
                          {incident.severity}
                        </span>
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle(incident.status)}`}>
                          {incident.status}
                        </span>
                      </div>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {incident.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <BusFront size={14} />
                          {incident.vehicle_id}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {new Date(incident.created_at).toLocaleString()}
                        </span>
                        {incident.driver_name && (
                          <span>Driver: {incident.driver_name}</span>
                        )}
                        {incident.location && (
                          <span>Location: {incident.location}</span>
                        )}
                        <span>
                          Vehicle Damaged: {incident.vehicle_damaged ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/fleet/${encodeURIComponent(incident.vehicle_id)}`}
                      className="shrink-0 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700"
                    >
                      View Vehicle
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
