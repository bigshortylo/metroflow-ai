
"use client";

import { useState } from "react";
import {
  BrainCircuit,
  AlertTriangle,
  BatteryCharging,
  CheckCircle2,
  Sparkles,
  XCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Vehicle = {
  id: string;
  location: string;
  battery: number;
  passengers: number;
  capacity: number;
  status: string;
};

type Recommendation = {
  id: string;
  priority: string;
  title: string;
  recommendation: string;
  reason: string;
  location: string;
};

type Decision = {
  status: "Accepted" | "Dismissed";
  timestamp: string;
};

export default function AIDispatchAdvisor({
  vehicles,
}: {
  vehicles: Vehicle[];
}) {
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [databaseError, setDatabaseError] = useState("");

  const recommendations: Recommendation[] = vehicles.flatMap((bus) => {
    if (bus.battery <= 20) {
      return [{
        id: bus.id,
        priority: "High",
        title: `${bus.id} — Critical Battery`,
        recommendation:
          `Consider reviewing ${bus.id} for removal from active service and arranging charging. Evaluate a replacement vehicle if service continuity is needed.`,
        reason:
          `Battery is at ${bus.battery}%, below the critical 20% threshold.`,
        location: bus.location,
      }];
    }

    if (bus.status === "Delayed") {
      return [{
        id: bus.id,
        priority: "Medium",
        title: `${bus.id} — Service Delay`,
        recommendation:
          "Review the cause of the delay and consider whether another available vehicle could support this route.",
        reason:
          "Vehicle status is currently marked as Delayed.",
        location: bus.location,
      }];
    }

    if (bus.status === "Maintenance") {
      return [{
        id: bus.id,
        priority: "Medium",
        title: `${bus.id} — Maintenance Review`,
        recommendation:
          `Keep ${bus.id} under maintenance review and verify its readiness before considering a return to service.`,
        reason:
          "Vehicle is currently marked as Maintenance.",
        location: bus.location,
      }];
    }

    return [];
  });

  async function saveLog(item: Recommendation, action: string) {
    setSavingId(item.id);
    setDatabaseError("");

    let operatorEmail = "Unknown Operator";

    try {
      const storedOperator = sessionStorage.getItem(
        "metroflow_demo_operator"
      );

      if (storedOperator) {
        const operator = JSON.parse(storedOperator);
        operatorEmail = operator.email || "Unknown Operator";
      }
    } catch {
      operatorEmail = "Unknown Operator";
    }

    const { error } = await supabase
      .from("dispatch_logs")
      .insert({
        vehicle_id: item.id,
        action,
        reason: `${item.title}: ${item.reason}`,
        operator_email: operatorEmail,
      });

    setSavingId(null);

    if (error) {
      setDatabaseError(
        `Could not save ${item.id}'s decision: ${error.message}`
      );
      return false;
    }

    return true;
  }

  async function recordDecision(
    item: Recommendation,
    status: "Accepted" | "Dismissed"
  ) {
    const saved = await saveLog(item, status);

    if (!saved) return;

    setDecisions((previous) => ({
      ...previous,
      [item.id]: {
        status,
        timestamp: new Date().toLocaleTimeString(),
      },
    }));
  }

  async function undoDecision(
    item: Recommendation,
    decision: Decision
  ) {
    const saved = await saveLog(item, `Undo ${decision.status}`);

    if (!saved) return;

    setDecisions((previous) => {
      const updated = { ...previous };
      delete updated[item.id];
      return updated;
    });
  }

  const acceptedCount = Object.values(decisions).filter(
    (decision) => decision.status === "Accepted"
  ).length;

  const dismissedCount = Object.values(decisions).filter(
    (decision) => decision.status === "Dismissed"
  ).length;

  const pendingCount = recommendations.filter(
    (item) => !decisions[item.id]
  ).length;

  return (
    <section className="relative overflow-hidden rounded-[26px] border border-slate-200 bg-white p-6 shadow-[0_10px_35px_rgba(70,90,120,0.08)]">

      <div className="relative z-10">

        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-green-200 bg-green-50 p-3 shadow-[0_0_18px_rgba(34,197,94,0.18)]">
              <BrainCircuit className="text-green-700 drop-shadow-[0_0_7px_rgba(34,197,94,0.65)]" size={27} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-950">
                AI Dispatch Advisor
              </h2>
              <p className="text-sm text-slate-600">
                Fleet intelligence and operator recommendations
              </p>
            </div>
          </div>

          <span className="rounded-full border border-blue-300 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-800 shadow-[0_0_16px_rgba(59,130,246,0.25)]">
            <Sparkles size={13} className="mr-2 inline text-blue-600 drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]" />
            DECISION SUPPORT
          </span>

        </div>

        {/* Human Approval */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4">

          <div className="flex items-center gap-2">
            <ShieldCheck size={19} className="text-green-700" />
            <p className="text-sm font-bold text-slate-900">
              Human Approval Required
            </p>
          </div>

          <p className="mt-2 text-sm leading-relaxed text-red-700">
            Recommendations are generated from simulated fleet
            conditions. Operator decisions are recorded in Supabase.
            No vehicles, routes, or dispatch assignments are changed.
          </p>

        </div>

        {/* Database Error */}
        {databaseError && (
          <div className="mb-5 rounded-xl border border-red-300 bg-red-100 p-4 text-sm font-bold text-red-900 shadow-[0_0_14px_rgba(239,68,68,0.12)]">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} />
              {databaseError}
            </div>
          </div>
        )}

        {/* Decision Metrics */}
        <div className="mb-6 grid grid-cols-3 gap-3">

          <div className="rounded-xl border border-orange-200 bg-orange-50 p-3">
            <p className="text-xs font-semibold text-orange-800">
              Pending
            </p>
            <p className="mt-1 text-2xl font-bold text-orange-900">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-xl border border-green-200 bg-green-50 p-3">
            <p className="text-xs font-semibold text-green-800">
              Accepted
            </p>
            <p className="mt-1 text-2xl font-bold text-green-900">
              {acceptedCount}
            </p>
          </div>

          <div className="rounded-xl border border-red-200 bg-red-50 p-3">
            <p className="text-xs font-semibold text-red-800">
              Dismissed
            </p>
            <p className="mt-1 text-2xl font-bold text-red-900">
              {dismissedCount}
            </p>
          </div>

        </div>

        {/* Recommendations */}
        {recommendations.length === 0 ? (

          <div className="rounded-xl border border-green-200 bg-green-50 p-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-green-700" />
              <p className="text-sm font-semibold text-green-800">
                No operational recommendations at this time.
              </p>
            </div>
          </div>

        ) : (

          <div className="space-y-4">

            {recommendations.map((item) => {
              const decision = decisions[item.id];
              const isSaving = savingId === item.id;

              return (
                <div
                  key={item.id}
                  className={`rounded-xl border p-5 shadow-sm transition-all duration-200 ${
                    item.priority === "High"
                      ? "border-red-300 bg-red-50/50 hover:border-red-400 hover:bg-red-50 hover:shadow-[0_0_15px_rgba(239,68,68,0.12)]"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 hover:shadow-md"
                  }`}
                >

                  {/* Recommendation Header */}
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

                    <h3 className="font-bold text-slate-950">
                      {item.title}
                    </h3>

                    <span className="rounded-full border border-red-300 bg-red-50 px-3 py-1 text-xs font-bold text-red-800 shadow-[0_0_10px_rgba(239,68,68,0.10)]">
                      {item.priority} Priority
                    </span>

                  </div>

                  {/* Suggested Action */}
                  <div className="mb-4 flex items-start gap-3">

                    <div className="rounded-lg border border-slate-200 bg-white p-2">
                      <BrainCircuit size={17} className="text-slate-700" />
                    </div>

                    <div>
                      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-700">
                        Suggested Action
                      </p>

                      <p className="text-sm leading-relaxed text-slate-800">
                        {item.recommendation}
                      </p>
                    </div>

                  </div>

                  {/* Analysis */}
                  <div className={`flex items-start gap-3 rounded-lg border p-3 ${
                    item.priority === "High"
                      ? "border-red-200 bg-red-100/70"
                      : "border-slate-200 bg-slate-50"
                  }`}>

                    <AlertTriangle
                      size={16}
                      className={`mt-0.5 shrink-0 ${
                        item.priority === "High"
                          ? "text-red-700"
                          : "text-slate-600"
                      }`}
                    />

                    <div>
                      <p className={`text-xs font-bold ${
                        item.priority === "High"
                          ? "text-red-900"
                          : "text-slate-800"
                      }`}>
                        Analysis
                      </p>

                      <p className={`mt-1 text-xs leading-relaxed ${
                        item.priority === "High"
                          ? "text-red-800"
                          : "text-slate-700"
                      }`}>
                        {item.reason}
                      </p>
                    </div>

                  </div>

                  {/* Location */}
                  <div className="mt-4 flex items-center gap-2">
                    <BatteryCharging size={15} className="text-slate-600" />
                    <span className="text-xs font-medium text-slate-700">
                      {item.location}
                    </span>
                  </div>

                  {/* Operator Decision */}
                  <div className="mt-5 border-t border-slate-200 pt-4">

                    {decision ? (

                      <div className="flex flex-wrap items-center justify-between gap-3">

                        <div className="flex items-center gap-2">

                          {decision.status === "Accepted" ? (
                            <CheckCircle2 size={18} className="text-green-700" />
                          ) : (
                            <XCircle size={18} className="text-red-700" />
                          )}

                          <div>
                            <p className={`text-sm font-bold ${
                              decision.status === "Accepted"
                                ? "text-green-800"
                                : "text-red-800"
                            }`}>
                              {decision.status}
                            </p>

                            <p className="text-xs text-slate-600">
                              Recorded at {decision.timestamp}
                            </p>
                          </div>

                        </div>

                        <button
                          disabled={isSaving}
                          onClick={() => undoDecision(item, decision)}
                          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 transition-all hover:border-slate-400 hover:bg-slate-200 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isSaving ? "Saving..." : "Undo Decision"}
                        </button>

                      </div>

                    ) : (

                      <div className="flex flex-wrap items-center justify-between gap-3">

                        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                          <Clock size={14} />
                          Awaiting operator review
                        </div>

                        <div className="flex gap-2">

                          <button
                            disabled={isSaving}
                            onClick={() => recordDecision(item, "Dismissed")}
                            className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-800 transition-all hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isSaving ? "Saving..." : "Dismiss"}
                          </button>

                          <button
                            disabled={isSaving}
                            onClick={() => recordDecision(item, "Accepted")}
                            className="rounded-lg border border-green-200 bg-white px-3 py-2 text-xs font-bold text-green-800 transition-all hover:border-green-300 hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isSaving ? "Saving..." : "Accept Recommendation"}
                          </button>

                        </div>

                      </div>

                    )}

                  </div>

                </div>
              );
            })}

          </div>

        )}

        <p className="mt-6 text-center text-xs font-medium text-slate-500">
          METROFLOW AI · Rule-based prototype · Operator decisions recorded in Supabase
        </p>

      </div>
    </section>
  );
}
