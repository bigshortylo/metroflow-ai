
import { supabase } from "@/lib/supabase";
import FleetAnalytics from "@/components/FleetAnalytics";
import {
  ChartNoAxesCombined,
  Activity,
} from "lucide-react";

export const instant = false;

export default async function AnalyticsPage() {
  const { data: vehicles, error } = await supabase
    .from("vehicles")
    .select("*")
    .order("id");

  const fleet = vehicles ?? [];

  return (
    <main className="min-h-screen bg-[#f3f6fa] px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-[1600px] space-y-8">

        <header className="rounded-[26px] border border-slate-200 bg-white p-8 shadow-[0_8px_25px_rgba(70,90,120,0.08)]">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                Network Intelligence
              </p>

              <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-slate-950">
                <ChartNoAxesCombined size={30} />
                Fleet Analytics
              </h1>

              <p className="mt-3 text-sm text-slate-600">
                Fleet performance, battery health, passenger capacity,
                and operational insights.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4">
              <Activity className="text-green-700" size={22} />
              <div>
                <p className="text-xs font-bold text-green-800">
                  LIVE DATABASE DATA
                </p>
                <p className="text-[10px] text-green-700">
                  Supabase fleet records
                </p>
              </div>
            </div>
          </div>
        </header>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
            Unable to load analytics data. Check your Supabase connection.
          </div>
        )}

        <FleetAnalytics vehicles={fleet} />

        <footer className="border-t border-slate-200 py-6 text-center">
          <p className="text-xs font-bold tracking-wider text-slate-700">
            METROFLOW AI
          </p>
          <p className="mt-1 text-[10px] tracking-wider text-slate-500">
            FLEET PERFORMANCE & OPERATIONAL INTELLIGENCE
          </p>
        </footer>

      </div>
    </main>
  );
}
