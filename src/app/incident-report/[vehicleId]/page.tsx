
"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  ClipboardList,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function IncidentReportPage() {
  const params = useParams();
  const router = useRouter();
  const vehicleId = params.vehicleId as string;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("Medium");
  const [location, setLocation] = useState("");
  const [vehicleDamaged, setVehicleDamaged] = useState("No");
  const [driverName, setDriverName] = useState("");
  const [operatorReport, setOperatorReport] = useState("");
  const [actionsTaken, setActionsTaken] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submitReport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const { error: insertError } = await supabase.from("incidents").insert({
      vehicle_id: vehicleId,
      title,
      description,
      severity,
      status: "Active",
      location,
      vehicle_damaged: vehicleDamaged === "Yes",
      driver_name: driverName,
      operator_report: operatorReport,
      actions_taken: actionsTaken,
    });

    if (insertError) {
      setError(insertError.message);
      setSaving(false);
      return;
    }

    router.push(`/fleet/${encodeURIComponent(vehicleId)}`);
  }

  const fieldClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link
          href={`/fleet/${encodeURIComponent(vehicleId)}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700"
        >
          <ArrowLeft size={17} />
          Back to Vehicle Status
        </Link>

        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-red-50 p-3 text-red-600">
              <AlertTriangle size={25} />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-700">
                METROFLOW AI / INCIDENT MANAGEMENT
              </p>
              <h1 className="text-2xl font-bold text-slate-900">
                Operator Incident Report
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Vehicle: {vehicleId}
              </p>
            </div>
          </div>
        </header>

        <form onSubmit={submitReport} className="space-y-6">
          <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <ClipboardList size={20} />
              Incident Details
            </h2>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Incident Title *
              </label>
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Example: Vehicle collision reported"
                className={fieldClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Incident Description *
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what happened..."
                className={fieldClass}
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Severity
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className={fieldClass}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Incident Location
                </label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter location"
                  className={fieldClass}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Was the vehicle damaged?
              </label>
              <select
                value={vehicleDamaged}
                onChange={(e) => setVehicleDamaged(e.target.value)}
                className={fieldClass}
              >
                <option>No</option>
                <option>Yes</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Driver Name
              </label>
              <input
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="Enter driver name"
                className={fieldClass}
              />
            </div>
          </section>

          <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Operator Response
            </h2>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Operator Report
              </label>
              <textarea
                rows={4}
                value={operatorReport}
                onChange={(e) => setOperatorReport(e.target.value)}
                placeholder="Describe the operator's account of the incident..."
                className={fieldClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Actions Taken
              </label>
              <textarea
                rows={4}
                value={actionsTaken}
                onChange={(e) => setActionsTaken(e.target.value)}
                placeholder="Describe immediate actions taken..."
                className={fieldClass}
              />
            </div>
          </section>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex flex-wrap justify-end gap-3">
            <Link
              href={`/fleet/${encodeURIComponent(vehicleId)}`}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
            >
              <CheckCircle2 size={18} />
              {saving ? "Submitting..." : "Submit Incident Report"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
