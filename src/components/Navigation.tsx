
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BusFront,
  Bell,
  BatteryWarning,
  AlertTriangle,
  ChevronDown,
  Activity,
  ChartNoAxesCombined,
  ClipboardList,
  BrainCircuit,
  MapPin,
  UserRound,
  Clock,
  Wrench,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type AlertItem = {
  id: string;
  vehicleId: string;
  type: "battery" | "accident";
  title: string;
  description: string;
  driverName?: string;
  driverId?: string;
  location?: string;
  createdAt?: string;
};

export default function Navigation() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAlerts, setShowAlerts] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadAlerts() {
      const [vehicleResult, incidentResult] = await Promise.all([
        supabase.from("vehicles").select("id, battery, location"),
        supabase
          .from("incidents")
          .select(
            "id, vehicle_id, title, description, severity, status, driver_name, driver_id, location, created_at"
          )
          .eq("severity", "Critical")
          .eq("status", "Active")
          .order("created_at", { ascending: false })
          .limit(10),
      ]);

      if (!mounted) return;

      const batteryAlerts: AlertItem[] = (vehicleResult.data || [])
        .filter((vehicle) => Number(vehicle.battery) <= 20)
        .map((vehicle) => ({
          id: `battery-${vehicle.id}`,
          vehicleId: vehicle.id,
          type: "battery",
          title: "Critical Battery Level",
          description: `${vehicle.id} battery is at ${vehicle.battery}%.`,
          location: vehicle.location,
        }));

      const accidentAlerts: AlertItem[] = (incidentResult.data || []).map(
        (incident) => ({
          id: incident.id,
          vehicleId: incident.vehicle_id,
          type: "accident",
          title: incident.title || "Accident Detected",
          description: incident.description || "Simulated accident reported.",
          driverName: incident.driver_name,
          driverId: incident.driver_id,
          location: incident.location,
          createdAt: incident.created_at,
        })
      );

      setAlerts([...accidentAlerts, ...batteryAlerts]);
      setLoading(false);
    }

    loadAlerts();

    const interval = setInterval(loadAlerts, 15000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex min-h-20 max-w-[1600px] flex-wrap items-center justify-between gap-3 px-6 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-600 p-2 text-white shadow-md shadow-blue-200">
            <BusFront size={22} />
          </div>
          <div>
            <p className="text-lg font-black tracking-tight text-slate-950">
              METROFLOW <span className="text-blue-600">AI</span>
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Autonomous Transit Operations
            </p>
          </div>
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/#dispatch"
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
          >
            <BrainCircuit size={16} />
            Dispatch Advisor
          </Link>

          <Link
            href="/analytics"
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
          >
            <ChartNoAxesCombined size={16} />
            Analytics
          </Link>

          <Link
            href="/fleet-intelligence"
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
          >
            <Wrench size={16} />
            Fleet Intelligence
          </Link>

          <Link
            href="/audit"
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
          >
            <ClipboardList size={16} />
            Audit & Compliance
          </Link>

          {/* ALERT DROPDOWN */}
          <div
            className="relative"
            onMouseEnter={() => setShowAlerts(true)}
            onMouseLeave={() => setShowAlerts(false)}
          >
            <button
              onClick={() => setShowAlerts((previous) => !previous)}
              className="relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <Bell size={17} />
              Alerts

              {alerts.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-black text-white shadow-md">
                  {alerts.length}
                </span>
              )}

              <ChevronDown size={14} />
            </button>

            {showAlerts && (
              <div className="absolute right-0 top-full z-[100] w-[390px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl before:absolute before:-top-3 before:right-0 before:h-3 before:w-full before:content-['']">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <div>
                    <h3 className="font-bold text-slate-950">
                      Critical Notifications
                    </h3>
                    <p className="text-xs text-slate-500">
                      Fleet safety and operational alerts
                    </p>
                  </div>

                  <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700">
                    {alerts.length} Active
                  </span>
                </div>

                <div className="max-h-[420px] overflow-y-auto">
                  {loading ? (
                    <div className="p-6 text-center text-sm text-slate-500">
                      Loading alerts...
                    </div>
                  ) : alerts.length === 0 ? (
                    <div className="p-8 text-center">
                      <Activity size={28} className="mx-auto mb-3 text-emerald-500" />
                      <p className="font-semibold text-slate-800">
                        No critical alerts
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        All monitored vehicles are clear.
                      </p>
                    </div>
                  ) : (
                    alerts.map((alert) => (
                      <Link
                        key={alert.id}
                        href={`/fleet/${encodeURIComponent(alert.vehicleId)}`}
                        onClick={() => setShowAlerts(false)}
                        className="block border-b border-slate-100 border-l-4 border-l-red-500 p-4 transition hover:bg-red-50 focus:bg-red-50 focus:outline-none"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                            {alert.type === "battery" ? (
                              <BatteryWarning size={20} />
                            ) : (
                              <AlertTriangle size={20} />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-bold text-slate-950">
                                {alert.title}
                              </p>
                              <span className="shrink-0 rounded-md bg-red-100 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-red-700">
                                Critical
                              </span>
                            </div>

                            <p className="mt-1 text-xs leading-relaxed text-slate-600">
                              {alert.description}
                            </p>

                            <div className="mt-3 space-y-1.5">
                              <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                                <BusFront size={13} />
                                {alert.vehicleId}
                              </div>

                              {alert.driverName && (
                                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                  <UserRound size={13} />
                                  {alert.driverName}
                                  {alert.driverId && ` (${alert.driverId})`}
                                </div>
                              )}

                              {alert.location && (
                                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                  <MapPin size={13} />
                                  {alert.location}
                                </div>
                              )}

                              {alert.createdAt && (
                                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                  <Clock size={13} />
                                  {new Date(alert.createdAt).toLocaleString()}
                                </div>
                              )}
                            </div>

                            <p className="mt-3 text-[11px] font-bold text-blue-600">
                              View vehicle status →
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>

                <Link
                  href="/#alerts"
                  onClick={() => setShowAlerts(false)}
                  className="block border-t border-slate-100 bg-slate-50 px-5 py-3 text-center text-xs font-bold text-slate-600 transition hover:bg-slate-100"
                >
                  View Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
