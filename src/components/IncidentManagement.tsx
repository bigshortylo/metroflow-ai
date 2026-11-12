
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Save,
  ShieldCheck,
  Plus,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Incident = {
  id: string;
  vehicle_id: string;
  title: string;
  description: string | null;
  severity: string | null;
  status: string;
  driver_name: string | null;
  driver_id: string | null;
  location: string | null;
  created_at: string;
  operator_report: string | null;
  actions_taken: string | null;
  resolution_notes: string | null;
  resolved_at: string | null;
  resolved_by: string | null;
};

type Props = {
  incidents: Incident[];
  vehicleId: string;
};

const inputStyle =
  "w-full rounded-xl border border-slate-300 bg-white p-3 text-base leading-relaxed text-slate-950 placeholder:text-slate-500 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none";

const labelStyle =
  "mb-2 block text-sm font-bold text-slate-950";

function IncidentCard({ incident }: { incident: Incident }) {
  const router = useRouter();

  const [report, setReport] = useState(incident.operator_report ?? "");
  const [actions, setActions] = useState(incident.actions_taken ?? "");
  const [resolution, setResolution] = useState(incident.resolution_notes ?? "");
  const [resolvedBy, setResolvedBy] = useState(incident.resolved_by ?? "");
  const [saving, setSaving] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [error, setError] = useState("");

  const isResolved = incident.status?.toLowerCase() === "resolved";

  async function saveReport() {
    if (!report.trim()) {
      setError("Please enter an incident report.");
      return;
    }

    setSaving(true);
    setError("");

    const { error } = await supabase
      .from("incidents")
      .update({
        operator_report: report.trim(),
        actions_taken: actions.trim(),
      })
      .eq("id", incident.id);

    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.refresh();
  }

  async function resolveIncident() {
    if (!report.trim() || !resolution.trim() || !resolvedBy.trim()) {
      setError("Complete the incident report, resolution notes, and operator name.");
      return;
    }

    setResolving(true);
    setError("");

    const { error } = await supabase
      .from("incidents")
      .update({
        operator_report: report.trim(),
        actions_taken: actions.trim(),
        resolution_notes: resolution.trim(),
        resolved_by: resolvedBy.trim(),
        resolved_at: new Date().toISOString(),
        status: "Resolved",
      })
      .eq("id", incident.id);

    setResolving(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {incident.vehicle_id}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-950">
            {incident.title}
          </h3>

          <p className="mt-1 text-sm text-slate-800">
            {incident.description || "No additional description."}
          </p>
        </div>

        <span className={`rounded-full px-3 py-1 text-xs font-bold ${
          isResolved
            ? "bg-emerald-100 text-emerald-800"
            : "bg-red-100 text-red-800"
        }`}>
          {incident.status}
        </span>
      </div>

      <div className="mt-4 grid gap-3 text-sm text-slate-800 sm:grid-cols-2">
        <p><strong className="text-slate-950">Driver:</strong> {incident.driver_name || incident.driver_id || "Not recorded"}</p>
        <p><strong className="text-slate-950">Location:</strong> {incident.location || "Not recorded"}</p>
        <p><strong className="text-slate-950">Severity:</strong> {incident.severity || "Not specified"}</p>
        <p><strong className="text-slate-950">Reported:</strong> {new Date(incident.created_at).toLocaleString()}</p>
      </div>

      <div className="my-5 border-t border-slate-200" />

      {isResolved ? (
        <div className="space-y-4">
          <div>
            <h4 className="mb-2 font-bold text-slate-950">Operator Incident Report</h4>
            <p className="whitespace-pre-wrap rounded-xl bg-slate-100 p-4 text-base leading-relaxed text-slate-950">
              {incident.operator_report || "No report recorded."}
            </p>
          </div>

          <div>
            <h4 className="mb-2 font-bold text-slate-950">Actions Taken</h4>
            <p className="whitespace-pre-wrap rounded-xl bg-slate-100 p-4 text-base leading-relaxed text-slate-950">
              {incident.actions_taken || "No actions recorded."}
            </p>
          </div>

          <div>
            <h4 className="mb-2 font-bold text-emerald-800">Resolution Notes</h4>
            <p className="whitespace-pre-wrap rounded-xl bg-emerald-50 p-4 text-base leading-relaxed text-slate-950">
              {incident.resolution_notes || "No resolution notes recorded."}
            </p>
          </div>

          <div className="text-sm font-medium text-slate-700">
            Resolved by: {incident.resolved_by || "Not recorded"}
            {incident.resolved_at && ` • ${new Date(incident.resolved_at).toLocaleString()}`}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className={labelStyle}>
              Operator Incident Report
            </label>
            <textarea
              value={report}
              onChange={(e) => setReport(e.target.value)}
              rows={4}
              placeholder="Describe what happened..."
              className={inputStyle}
            />
          </div>

          <div>
            <label className={labelStyle}>
              Actions Taken
            </label>
            <textarea
              value={actions}
              onChange={(e) => setActions(e.target.value)}
              rows={3}
              placeholder="Document actions taken..."
              className={inputStyle}
            />
          </div>

          <button
            onClick={saveReport}
            disabled={saving || resolving}
            className="flex items-center gap-2 rounded-xl border border-blue-300 bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-900 hover:bg-blue-100 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Incident Report"}
          </button>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
            <h4 className="mb-3 font-bold text-emerald-900">
              Resolve Incident
            </h4>

            <label className={labelStyle}>Resolution Notes</label>
            <textarea
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              rows={3}
              placeholder="Explain how the incident was resolved..."
              className={inputStyle + " mb-3"}
            />

            <label className={labelStyle}>Resolved By</label>
            <input
              value={resolvedBy}
              onChange={(e) => setResolvedBy(e.target.value)}
              placeholder="Operator name"
              className={inputStyle + " mb-3"}
            />

            <button
              onClick={resolveIncident}
              disabled={saving || resolving}
              className="flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-800 disabled:opacity-50"
            >
              <ShieldCheck className="h-4 w-4" />
              {resolving ? "Resolving..." : "Mark as Resolved"}
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-800">
          {error}
        </p>
      )}
    </div>
  );
}

export default function IncidentManagement({ incidents, vehicleId }: Props) {
  const router = useRouter();

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("Medium");
  const [location, setLocation] = useState("");
  const [report, setReport] = useState("");
  const [actions, setActions] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function createIncident() {
    if (!title.trim() || !description.trim() || !report.trim()) {
      setError("Enter an incident title, description, and operator report.");
      return;
    }

    setSaving(true);
    setError("");

    const { error } = await supabase.from("incidents").insert({
      vehicle_id: vehicleId,
      title: title.trim(),
      description: description.trim(),
      severity,
      status: "Active",
      location: location.trim() || null,
      operator_report: report.trim(),
      actions_taken: actions.trim(),
    });

    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }

    setTitle("");
    setDescription("");
    setSeverity("Medium");
    setLocation("");
    setReport("");
    setActions("");
    setShowForm(false);
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-950">
            Incident Management & Reports
          </h2>
          <p className="mt-1 text-sm text-slate-700">
            Record incidents, operator actions, and resolutions.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-800"
        >
          <Plus className="h-4 w-4" />
          Report New Incident
        </button>
      </div>

      {showForm && (
        <div className="space-y-4 rounded-2xl border border-blue-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-950">
            New Incident Report — {vehicleId}
          </h3>

          <label className={labelStyle}>Incident Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Incident title"
            className={inputStyle}
          />

          <label className={labelStyle}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Describe the incident..."
            className={inputStyle}
          />

          <label className={labelStyle}>Severity</label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className={inputStyle}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>

          <label className={labelStyle}>Incident Location</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Incident location (optional)"
            className={inputStyle}
          />

          <label className={labelStyle}>Operator Incident Report</label>
          <textarea
            value={report}
            onChange={(e) => setReport(e.target.value)}
            rows={3}
            placeholder="Operator incident report..."
            className={inputStyle}
          />

          <label className={labelStyle}>Actions Taken</label>
          <textarea
            value={actions}
            onChange={(e) => setActions(e.target.value)}
            rows={3}
            placeholder="Actions taken (optional)..."
            className={inputStyle}
          />

          <div className="flex flex-wrap gap-3">
            <button
              onClick={createIncident}
              disabled={saving}
              className="rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Incident"}
            </button>

            <button
              onClick={() => setShowForm(false)}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              Cancel
            </button>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-800">
              {error}
            </p>
          )}
        </div>
      )}

      {incidents.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-emerald-600" />
          <p className="font-semibold text-slate-950">
            No incident history available
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Use Report New Incident to create a record for this vehicle.
          </p>
        </div>
      ) : (
        incidents.map((incident) => (
          <IncidentCard key={incident.id} incident={incident} />
        ))
      )}
    </div>
  );
}
