
"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import {
  History,
  RefreshCw,
  CheckCircle2,
  XCircle,
  RotateCcw,
  AlertTriangle,
  Clock,
  Search,
  Download,
  Filter,
  ChevronDown,
  ChevronUp,
  FileSearch,
  ShieldCheck,
  UserRound,
  Hash,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type DecisionLog = {
  id: string;
  vehicle_id: string;
  action: string;
  reason: string | null;
  created_at: string;
  operator_id: string | null;
  operator_email: string | null;
};

export default function DecisionHistory() {
  const [logs, setLogs] = useState<DecisionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("All");
  const [vehicleFilter, setVehicleFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  async function loadHistory() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("dispatch_logs")
      .select(
        "id, vehicle_id, action, reason, created_at, operator_id, operator_email"
      )
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setLogs((data ?? []) as DecisionLog[]);
    setLoading(false);
  }

  useEffect(() => {
    loadHistory();
  }, []);

  const vehicles = useMemo(
    () => [...new Set(logs.map((log) => log.vehicle_id))].sort(),
    [logs]
  );

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const term = search.toLowerCase();

      const matchesSearch =
        log.vehicle_id.toLowerCase().includes(term) ||
        (log.reason ?? "").toLowerCase().includes(term) ||
        log.action.toLowerCase().includes(term) ||
        (log.operator_email ?? "").toLowerCase().includes(term) ||
        (log.operator_id ?? "").toLowerCase().includes(term);

      const matchesAction =
        actionFilter === "All" || log.action === actionFilter;

      const matchesVehicle =
        vehicleFilter === "All" || log.vehicle_id === vehicleFilter;

      const recordedDate = new Date(log.created_at)
        .toISOString()
        .slice(0, 10);

      return (
        matchesSearch &&
        matchesAction &&
        matchesVehicle &&
        (!dateFrom || recordedDate >= dateFrom) &&
        (!dateTo || recordedDate <= dateTo)
      );
    });
  }, [logs, search, actionFilter, vehicleFilter, dateFrom, dateTo]);

  const acceptedCount = logs.filter(
    (log) => log.action === "Accepted"
  ).length;

  const dismissedCount = logs.filter(
    (log) => log.action === "Dismissed"
  ).length;

  const undoCount = logs.filter(
    (log) => log.action.startsWith("Undo")
  ).length;

  function exportCSV() {
    const headers = [
      "Timestamp",
      "Vehicle",
      "Operator Email",
      "Operator ID",
      "Action",
      "Reason",
      "Record ID",
    ];

    const rows = filteredLogs.map((log) => [
      new Date(log.created_at).toISOString(),
      log.vehicle_id,
      log.operator_email ?? "Unknown Operator",
      log.operator_id ?? "Not linked",
      log.action,
      log.reason ?? "",
      log.id,
    ]);

    const escapeCSV = (value: string) =>
      `"${value.replace(/"/g, '""')}"`;

    const csv = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "metroflow-audit-log.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  function getActionStyle(action: string) {
    if (action === "Accepted") {
      return "border-green-200 bg-green-50 text-green-800";
    }

    if (action === "Dismissed") {
      return "border-red-200 bg-red-50 text-red-800";
    }

    return "border-orange-200 bg-orange-50 text-orange-800";
  }

  function getActionIcon(action: string) {
    if (action === "Accepted") return <CheckCircle2 size={15} />;
    if (action === "Dismissed") return <XCircle size={15} />;
    return <RotateCcw size={15} />;
  }

  function getDecisionDescription(action: string) {
    if (action === "Accepted") {
      return "The operator accepted the AI-generated recommendation.";
    }

    if (action === "Dismissed") {
      return "The operator dismissed the AI-generated recommendation.";
    }

    if (action.startsWith("Undo")) {
      return "An earlier operator decision was reversed.";
    }

    return "An operator action was recorded.";
  }

  function formatTimestamp(timestamp: string) {
    return new Date(timestamp).toLocaleString("en-US", {
      timeZone: "UTC",
      dateStyle: "full",
      timeStyle: "medium",
    });
  }

  function isCritical(log: DecisionLog) {
    return log.reason?.toLowerCase().includes("critical battery") ?? false;
  }

  function getOperator(log: DecisionLog) {
    return log.operator_email || "Unknown Operator";
  }

  return (
    <section className="space-y-6">

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Records
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-950">
            {logs.length}
          </p>
        </div>

        <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-green-800">
            Accepted
          </p>
          <p className="mt-2 text-3xl font-bold text-green-900">
            {acceptedCount}
          </p>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-red-800">
            Dismissed
          </p>
          <p className="mt-2 text-3xl font-bold text-red-900">
            {dismissedCount}
          </p>
        </div>

        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-orange-800">
            Undo Actions
          </p>
          <p className="mt-2 text-3xl font-bold text-orange-900">
            {undoCount}
          </p>
        </div>
      </div>

      {/* Audit Log */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_35px_rgba(70,90,120,0.07)]">

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-3">
              <History size={23} className="text-blue-700" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-950">
                Decision Audit Log
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Searchable record of operator decisions and actions
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={loadHistory}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 disabled:opacity-50"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            <button
              onClick={exportCSV}
              disabled={filteredLogs.length === 0}
              className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-800 transition hover:bg-blue-100 disabled:opacity-50"
            >
              <Download size={15} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-4 border-b border-slate-200 bg-slate-50 p-6">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <Filter size={17} />
            Audit Filters
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <div className="relative xl:col-span-2">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search vehicle, operator or reason..."
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <select
              value={actionFilter}
              onChange={(event) => setActionFilter(event.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-medium text-slate-800 outline-none focus:border-blue-500"
            >
              <option value="All">All Actions</option>
              <option value="Accepted">Accepted</option>
              <option value="Dismissed">Dismissed</option>
              <option value="Undo Accepted">Undo Accepted</option>
              <option value="Undo Dismissed">Undo Dismissed</option>
            </select>

            <select
              value={vehicleFilter}
              onChange={(event) => setVehicleFilter(event.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-medium text-slate-800 outline-none focus:border-blue-500"
            >
              <option value="All">All Vehicles</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle} value={vehicle}>
                  {vehicle}
                </option>
              ))}
            </select>

            <div className="flex gap-2 md:col-span-2 xl:col-span-5">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  From (UTC)
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(event) => setDateFrom(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800"
                />
              </div>

              <div className="flex-1">
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  To (UTC)
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(event) => setDateTo(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800"
                />
              </div>

              <button
                onClick={() => {
                  setSearch("");
                  setActionFilter("All");
                  setVehicleFilter("All");
                  setDateFrom("");
                  setDateTo("");
                }}
                className="self-end rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-200"
              >
                Clear
              </button>
            </div>
          </div>

          <p className="text-xs font-medium text-slate-500">
            Showing {filteredLogs.length} of {logs.length} records. Date filters use UTC.
          </p>
        </div>

        {/* Audit Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-16 text-sm font-medium text-slate-600">
              <RefreshCw size={18} className="animate-spin" />
              Loading audit records...
            </div>
          ) : error ? (
            <div className="m-6 rounded-xl border border-red-300 bg-red-50 p-5 text-sm font-semibold text-red-800">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} />
                Unable to load audit records
              </div>
              <p className="mt-2 text-xs">{error}</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="py-16 text-center">
              <History size={32} className="mx-auto text-slate-400" />
              <p className="mt-3 font-bold text-slate-800">
                No matching audit records
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Try changing or clearing your filters.
              </p>
            </div>
          ) : (
            <table className="w-full min-w-[1050px] text-left">
              <thead className="border-b border-slate-200 bg-slate-100 text-xs font-bold uppercase tracking-wider text-slate-600">
                <tr>
                  <th className="p-4">Timestamp (UTC)</th>
                  <th className="p-4">Vehicle</th>
                  <th className="p-4">Operator</th>
                  <th className="p-4">Decision</th>
                  <th className="p-4">Reason / Details</th>
                  <th className="p-4">Inspect</th>
                </tr>
              </thead>

              <tbody>
                {filteredLogs.map((log) => {
                  const critical = isCritical(log);
                  const expanded = expandedLogId === log.id;

                  return (
                    <Fragment key={log.id}>
                      <tr
                        className={`border-b border-slate-100 transition ${
                          critical
                            ? "bg-red-50/70 hover:bg-red-100"
                            : expanded
                              ? "bg-blue-50/60"
                              : "hover:bg-slate-50"
                        }`}
                      >
                        <td className="whitespace-nowrap p-4 text-xs font-medium text-slate-600">
                          <div className="flex items-center gap-2">
                            <Clock size={14} />
                            {new Date(log.created_at).toLocaleString("en-US", {
                              timeZone: "UTC",
                            })}
                          </div>
                        </td>

                        <td className="p-4 font-bold text-slate-900">
                          {log.vehicle_id}
                          {critical && (
                            <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-red-300 bg-red-100 px-2 py-1 text-[10px] font-bold text-red-800">
                              <AlertTriangle size={11} />
                              Critical
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-xs font-semibold text-slate-800">
                          <div className="flex items-center gap-2">
                            <UserRound size={15} className="shrink-0 text-blue-600" />
                            <span className="break-all">
                              {getOperator(log)}
                            </span>
                          </div>
                        </td>

                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-bold ${getActionStyle(log.action)}`}
                          >
                            {getActionIcon(log.action)}
                            {log.action}
                          </span>
                        </td>

                        <td className="max-w-md p-4 text-sm leading-relaxed text-slate-700">
                          {log.reason || "No details recorded."}
                        </td>

                        <td className="p-4">
                          <button
                            onClick={() =>
                              setExpandedLogId(expanded ? null : log.id)
                            }
                            aria-expanded={expanded}
                            className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800"
                          >
                            {expanded ? (
                              <>
                                <ChevronUp size={15} />
                                Close
                              </>
                            ) : (
                              <>
                                <FileSearch size={15} />
                                Inspect
                                <ChevronDown size={14} />
                              </>
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Investigation Panel */}
                      {expanded && (
                        <tr className="border-b border-blue-200 bg-slate-50">
                          <td colSpan={6} className="p-5">
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-3">
                                  <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                                    <FileSearch size={21} />
                                  </div>
                                  <div>
                                    <h3 className="font-bold text-slate-950">
                                      Audit Record Investigation
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                      Expanded record details
                                    </p>
                                  </div>
                                </div>

                                <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-800">
                                  Record Details
                                </span>
                              </div>

                              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                  <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                                    <Hash size={14} />
                                    Record ID
                                  </div>
                                  <p className="break-all font-mono text-xs text-slate-800">
                                    {log.id}
                                  </p>
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                  <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                                    <span>🚌</span>
                                    Vehicle
                                  </div>
                                  <p className="font-bold text-slate-950">
                                    {log.vehicle_id}
                                  </p>
                                </div>

                                <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
                                  <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
                                    <UserRound size={14} />
                                    Operator Identity
                                  </div>
                                  <p className="break-all text-sm font-bold text-slate-950">
                                    {getOperator(log)}
                                  </p>
                                  <p className="mt-1 text-xs text-slate-500">
                                    Demo operator identity from simulated login
                                  </p>
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                  <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                                    <Clock size={14} />
                                    Recorded Timestamp
                                  </div>
                                  <p className="text-sm font-semibold text-slate-900">
                                    {formatTimestamp(log.created_at)}
                                  </p>
                                  <p className="mt-1 text-xs text-slate-500">
                                    Coordinated Universal Time (UTC)
                                  </p>
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                  <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                                    <ShieldCheck size={14} />
                                    Decision Classification
                                  </div>
                                  <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${getActionStyle(log.action)}`}>
                                    {getActionIcon(log.action)}
                                    {log.action}
                                  </span>
                                </div>

                                <div className={`rounded-xl border p-4 ${
                                  critical
                                    ? "border-red-200 bg-red-50"
                                    : "border-slate-200 bg-slate-50"
                                }`}>
                                  <div className={`mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
                                    critical ? "text-red-700" : "text-slate-500"
                                  }`}>
                                    <AlertTriangle size={14} />
                                    Event Classification
                                  </div>
                                  <p className={`text-sm font-bold ${
                                    critical ? "text-red-800" : "text-slate-900"
                                  }`}>
                                    {critical ? "Critical Event" : "Standard Event"}
                                  </p>
                                  <p className="mt-1 text-xs text-slate-500">
                                    Based on recorded decision details
                                  </p>
                                </div>

                              </div>

                              <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/60 p-5">
                                <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-blue-800">
                                  Decision Summary
                                </h4>
                                <p className="text-sm leading-relaxed text-slate-800">
                                  {getDecisionDescription(log.action)}
                                </p>
                              </div>

                              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5">
                                <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                                  Original Recorded Reason
                                </h4>
                                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
                                  {log.reason || "No reason was recorded for this action."}
                                </p>
                              </div>

                              <p className="mt-4 text-[11px] font-medium text-slate-400">
                                Investigation view generated from the stored Supabase audit record. No additional operator actions or event history are inferred.
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 text-xs font-medium text-slate-500">
          METROFLOW AI · Audit records retrieved from Supabase · Latest 500 records
        </div>
      </div>
    </section>
  );
}
