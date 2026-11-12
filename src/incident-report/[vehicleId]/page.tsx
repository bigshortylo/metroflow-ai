
"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  AlertTriangle,
  BusFront,
  Save,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function IncidentReportPage() {
  const params = useParams();
  const router = useRouter();
  const vehicleId = decodeURIComponent(params.vehicleId as string);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("Medium");
  const [location, setLocation] = useState("");
  const [vehicleDamaged, setVehicleDamaged] = useState("no");
  const [report, setReport] = useState("");
  const [actions, setActions] = useState("");
  const [driverName, setDriverName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submitReport() {
    if (!title.trim() || !description.trim() || !report.trim()) {
      setError("Please complete the incident title, description, and operator report.");
      return;
    }

    setSaving(true);
    setError("");

    const { error: insertError } = await supabase
      .from("incidents")
      .insert({
        vehicle_id: vehicleId,
        title: title.trim(),
        description: description.trim(),
        severity,
        status: "Active",
        location: location.trim() || null,
        driver_name: driverName.trim() || null,
        vehicle_damaged: vehicleDamaged === "yes",
        operator_report: report.trim(),
        actions_taken: actions.trim(),
      });

    setSaving(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    router.push(`/fleet/${encodeURIComponent(vehicleId)}`);
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-4xl space-y-6">

        <Link
          href={`/fleet/${encodeURIComponent(vehicleId)}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Vehicle Status
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3">
              <AlertTriangle className="h-6 w-6 text-blue-800" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-600">
                METROFLOW AI / INCIDENT MANAGEMENT
              </p>
              <h1 className="text-2xl font-bold text-slate-950">
                Incident Report
              </h1>
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-700">
            Submit an operational incident report for vehicle{" "}
            <strong className="text-slate-950">{vehicleId}</strong>.
            All submitted information will be saved in the incident history.
          </p>
        </div>

        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-950">
              <BusFront className="h-5 w-5 text-blue-700" />
              Incident Information
            </h2>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-950">
                Incident Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Example: Vehicle collision"
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-base text-slate-950 placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-950">
                Incident Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe what happened..."
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-base text-slate-950 placeholder:text-slate-500"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-950">
                  Severity
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-base text-slate-950"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-950">
                  Incident Location
                </label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter location"
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-base text-slate-950 placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-950">
                Driver Name
              </label>
              <input
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="Enter driver name"
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-base text-slate-950 placeholder:text-slate-500"
              />
            </div>
          </section>

          <div className="border-t border-slate-200" />

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-950">
              Vehicle Damage Assessment
            </h2>

            <p className="text-sm text-slate-700">
              Did this incident result in damage to the transportation bus?
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setVehicleDamaged("yes")}
                className={`rounded-xl border-2 p-4 text-left font-bold ${
                  vehicleDamaged === "yes"
                    ? "border-red-500 bg-red-50 text-red-900"
                    : "border-slate-200 bg-white text-slate-800"
                }`}
              >
                Yes — Vehicle Damaged
              </button>

              <button
                type="button"
                onClick={() => setVehicleDamaged("no")}
                className={`rounded-xl border-2 p-4 text-left font-bold ${
                  vehicleDamaged === "no"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                    : "border-slate-200 bg-white text-slate-800"
                }`}
              >
                No — No Vehicle Damage
              </button>
            </div>

            {vehicleDamaged === "yes" && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="flex items-center gap-2 text-sm font-bold text-red-900">
                  <AlertTriangle className="h-4 w-4" />
                  Vehicle damage reported
                </p>
                <p className="mt-1 text-sm text-red-800">
                  This incident will be recorded as involving vehicle damage.
                </p>
              </div>
            )}
          </section>

          <div className="border-t border-slate-200" />

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-950">
              Operator Report
            </h2>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-950">
                Incident Report
              </label>
              <textarea
                value={report}
                onChange={(e) => setReport(e.target.value)}
                rows={5}
                placeholder="Document the circumstances and details of the incident..."
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-base leading-relaxed text-slate-950 placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-950">
                Actions Taken
              </label>
              <textarea
                value={actions}
                onChange={(e) => setActions(e.target.value)}
                rows={4}
                placeholder="Document actions taken by the operator or response team..."
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-base leading-relaxed text-slate-950 placeholder:text-slate-500"
              />
            </div>
          </section>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-900">
              {error}
            </div>
          )}

          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-5">
            <Link
              href={`/fleet/${encodeURIComponent(vehicleId)}`}
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-800 hover:bg-slate-100"
            >
              Cancel
            </Link>

            <button
              onClick={submitReport}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? "Submitting..." : "Submit Incident Report"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
