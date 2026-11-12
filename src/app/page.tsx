
import Link from "next/link";
import {
  BusFront,
  Bell,
  Activity,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import FleetOperations from "@/components/FleetOperations";
import AIDispatchAdvisor from "@/components/AIDispatchAdvisor";
import DashboardLayout from "@/components/DashboardLayout";

export const instant = false;

type SectionId = "alerts" | "metrics" | "fleet" | "dispatch";

const DEFAULT_VISIBLE: SectionId[] = [
  "alerts",
  "metrics",
  "fleet",
  "dispatch",
];

const DEFAULT_ORDER: SectionId[] = [
  "alerts",
  "metrics",
  "fleet",
  "dispatch",
];

const validVisibleSections = (values: string[] | null): SectionId[] => {
  const allowed: SectionId[] = ["alerts", "metrics", "fleet", "dispatch"];

  if (!values) return DEFAULT_VISIBLE;

  return values.filter(
    (value): value is SectionId =>
      allowed.includes(value as SectionId)
  );
};

const validOrder = (values: string[] | null): SectionId[] => {
  const allowed: SectionId[] = ["alerts", "metrics", "fleet", "dispatch"];

  const filtered = (values ?? []).filter(
    (value): value is SectionId =>
      allowed.includes(value as SectionId)
  );

  return [
    ...filtered,
    ...allowed.filter((section) => !filtered.includes(section)),
  ];
};

export default async function Home() {
  const [
    { data: vehicles, error: vehiclesError },
    { data: routes, error: routesError },
    { data: dashboardSettings, error: settingsError },
    { data: incidents, error: incidentsError },
  ] = await Promise.all([
    supabase.from("vehicles").select("*").order("id"),
    supabase.from("routes").select("*"),
    supabase
      .from("dashboard_settings")
      .select("visible_sections, section_order")
      .eq("id", "default")
      .maybeSingle(),
    supabase
      .from("incidents")
      .select("id")
      .eq("severity", "Critical")
      .eq("status", "Active"),
  ]);

  const fleet = vehicles ?? [];
  const routeList = routes ?? [];

  const activeVehicles = fleet.filter(
    (bus) => bus.status === "In Service"
  ).length;

  const criticalBatteries = fleet.filter(
    (bus) => bus.battery <= 20
  ).length;

  const activeIncidents = incidents?.length ?? 0;

  const alerts =
    criticalBatteries + activeIncidents;

  const databaseConnected =
    !vehiclesError &&
    !routesError &&
    !settingsError &&
    !incidentsError;

  const initialVisible = dashboardSettings?.visible_sections ?? null;
  const initialOrder = dashboardSettings?.section_order ?? null;

  const glassCard =
    "border border-slate-200 bg-white shadow-[0_8px_25px_rgba(70,90,120,0.08)]";

  const hoverCard =
    "transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:bg-slate-100 hover:shadow-[0_14px_32px_rgba(50,70,100,0.15)]";

  const sections = {
    alerts: (
      <section id="alerts" className="scroll-mt-28">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

          {/* FLEET OVERVIEW */}
          <div className={`${glassCard} rounded-[24px] p-6`}>
            <Link
              href="/fleet-intelligence"
              className="group flex items-center justify-between rounded-xl transition"
            >
              <div>
                <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">
                  Fleet Overview
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Current network vehicle status · View Fleet Intelligence →
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-100 p-3 transition group-hover:bg-slate-200">
                <BusFront className="text-slate-700" size={22} />
              </div>
            </Link>

            <div className="mt-6 grid grid-cols-2 gap-5">

              {/* TOTAL FLEET */}
              <Link
                href="/fleet-intelligence"
                className="group rounded-xl border-r border-slate-200 pr-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 group-hover:text-blue-700">
                  Total Fleet
                </p>

                <p className="mt-2 text-4xl font-bold text-slate-950 transition group-hover:text-blue-700">
                  {fleet.length}
                </p>

                <p className="mt-2 text-xs text-slate-600">
                  Registered vehicles
                </p>
              </Link>

              {/* ACTIVE VEHICLES */}
              <Link
                href="/fleet-intelligence?status=In-Service"
                className="group rounded-xl pl-2"
              >
                <div className="flex items-center gap-2">
                  <Activity size={15} className="text-green-700" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 group-hover:text-green-700">
                    Active Vehicles
                  </p>
                </div>

                <p className="mt-2 text-4xl font-bold text-green-800 transition group-hover:text-green-600">
                  {activeVehicles}
                </p>

                <p className="mt-2 text-xs text-slate-600">
                  Currently in service
                </p>
              </Link>

            </div>
          </div>

          {/* OPERATIONAL ALERT CENTER */}
          <Link
            href="/alerts"
            className={`${glassCard} ${hoverCard} group block rounded-[24px] p-6`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-700 group-hover:text-red-700">
                  Operational Alert Center
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Fleet conditions requiring attention
                </p>
              </div>

              <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                <Bell className="text-red-700" size={22} />
              </div>
            </div>

            <div className="mt-6 flex items-end justify-between">
              <div>
                <p className="text-4xl font-bold text-slate-950">
                  {alerts}
                </p>

                <p className="mt-2 text-xs font-semibold text-slate-600">
                  Active critical alerts
                </p>
              </div>

              <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 transition-colors group-hover:bg-slate-200">
                View Alerts →
              </span>
            </div>
          </Link>

        </div>
      </section>
    ),

    metrics: null,

    fleet: (
      <section id="fleet" className="scroll-mt-28">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600">
            Vehicle Management
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950">
            Fleet Operations
          </h2>
        </div>

        <FleetOperations vehicles={fleet} routes={routeList} />
      </section>
    ),

    dispatch: (
      <section id="dispatch" className="scroll-mt-28">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600">
            Decision Support
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950">
            AI Dispatch Intelligence
          </h2>
        </div>

        <AIDispatchAdvisor vehicles={fleet} />
      </section>
    ),
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f3f6fa] text-slate-900">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-[550px] w-[550px] rounded-full bg-sky-200/30 blur-[130px]" />
        <div className="absolute -right-40 top-80 h-[550px] w-[550px] rounded-full bg-blue-200/30 blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 h-[500px] w-[500px] rounded-full bg-cyan-100/40 blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] space-y-8 p-6 md:p-8">

        <header
          id="dashboard"
          className="flex scroll-mt-28 flex-col justify-between gap-4 md:flex-row md:items-center"
        >
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-600">
              Network Command
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              Operations Overview
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Daly City, California · Autonomous Transit Network
            </p>
          </div>

          <div className={`${glassCard} flex items-center gap-3 rounded-2xl px-5 py-3`}>
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                databaseConnected ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <div>
              <p
                className={`text-xs font-bold tracking-wider ${
                  databaseConnected ? "text-green-800" : "text-red-800"
                }`}
              >
                {databaseConnected ? "DATABASE CONNECTED" : "DATABASE ERROR"}
              </p>
              <p className="text-[10px] text-slate-600">
                Supabase connection
              </p>
            </div>
          </div>
        </header>

        {(vehiclesError || routesError || settingsError || incidentsError) && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            Some dashboard data could not be loaded. Check your Supabase connection and database settings.
          </div>
        )}

        <DashboardLayout
          sections={sections}
          initialVisible={validVisibleSections(initialVisible)}
          initialOrder={validOrder(initialOrder)}
        />

        <footer className="border-t border-slate-200 py-6 text-center">
          <p className="text-xs font-bold tracking-wider text-slate-700">
            METROFLOW AI
          </p>
          <p className="mt-1 text-[10px] tracking-wider text-slate-600">
            SIMULATED AUTONOMOUS TRANSIT OPERATIONS · DALY CITY, CA
          </p>
        </footer>

      </div>
    </main>
  );
}
