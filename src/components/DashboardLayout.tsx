
"use client";

import { useState, type ReactNode } from "react";
import {
  Settings2,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Save,
  RotateCcw,
  X,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type SectionId = "alerts" | "metrics" | "fleet" | "dispatch";

type Props = {
  sections: Record<SectionId, ReactNode>;
  initialVisible: SectionId[];
  initialOrder: SectionId[];
};

const DEFAULT_ORDER: SectionId[] = [
  "alerts",
  "metrics",
  "fleet",
  "dispatch",
];

const SECTION_LABELS: Record<SectionId, string> = {
  alerts: "Operational Alerts",
  metrics: "Fleet Metrics",
  fleet: "Fleet Operations",
  dispatch: "AI Dispatch Intelligence",
};

export default function DashboardLayout({
  sections,
  initialVisible,
  initialOrder,
}: Props) {
  const [visible, setVisible] = useState<SectionId[]>(initialVisible);
  const [order, setOrder] = useState<SectionId[]>(initialOrder);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // The overview modules are always pinned at the top.
  // They cannot be hidden or reordered by the dashboard editor.
  const pinnedSections: SectionId[] = ["alerts"];

  // Only these sections can be customized.
  const customizableSections: SectionId[] = [
    "fleet",
    "dispatch",
  ];

  function toggleSection(section: SectionId) {
    if (pinnedSections.includes(section)) return;

    setVisible((current) =>
      current.includes(section)
        ? current.filter((item) => item !== section)
        : [...current, section]
    );
  }

  function moveSection(index: number, direction: -1 | 1) {
    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= order.length) return;

    setOrder((current) => {
      const updated = [...current];
      [updated[index], updated[newIndex]] = [
        updated[newIndex],
        updated[index],
      ];
      return updated;
    });
  }

  function resetLayout() {
    setVisible([...DEFAULT_ORDER]);
    setOrder([...customizableSections]);
    setMessage("Default layout restored. Save to publish it.");
  }

  async function saveLayout() {
    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("dashboard_settings")
      .update({
        visible_sections: [...pinnedSections, ...visible.filter(
          (section) => !pinnedSections.includes(section)
        )],
        section_order: [...pinnedSections, ...order],
        updated_at: new Date().toISOString(),
      })
      .eq("id", "default");

    setSaving(false);

    if (error) {
      setMessage("Unable to save layout. Please try again.");
      console.error("Dashboard settings error:", error);
      return;
    }

    setMessage("Shared dashboard layout saved successfully.");
    setEditing(false);
  }

  return (
    <div className="space-y-8">

      {/* Pinned Operations Overview */}
      <div>
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            Operations Overview
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Live fleet summary and operational alerts.
          </p>
        </div>

        {sections.alerts}
      </div>

      {/* Dashboard Customization */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            Workspace Configuration
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Customize the shared operations dashboard.
          </p>
        </div>

        <button
          onClick={() => {
            setEditing(!editing);
            setMessage("");
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-slate-100"
        >
          {editing ? <X size={17} /> : <Settings2 size={17} />}
          {editing ? "Close Editor" : "Customize Dashboard"}
        </button>
      </div>

      {editing && (
        <div className="rounded-[24px] border border-blue-200 bg-white p-6 shadow-[0_8px_25px_rgba(70,90,120,0.08)]">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-950">
              Dashboard Layout Editor
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Fleet Overview and Operational Alert Center stay pinned at the top.
              You can customize the remaining sections.
            </p>
          </div>

          <div className="mb-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-sm font-bold text-blue-900">
              Pinned: Fleet Overview + Operational Alert Center
            </p>
            <p className="mt-1 text-xs text-blue-800">
              These overview modules are always visible and cannot be moved.
            </p>
          </div>

          <div className="space-y-3">
            {order
              .filter((section) => customizableSections.includes(section))
              .map((section, index) => {
                const isVisible = visible.includes(section);

                return (
                  <div
                    key={section}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-bold text-slate-600">
                        {index + 1}
                      </span>

                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {SECTION_LABELS[section]}
                        </p>
                        <p className="text-xs text-slate-500">
                          {isVisible
                            ? "Visible on dashboard"
                            : "Hidden from dashboard"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moveSection(index, -1)}
                        disabled={index === 0}
                        title="Move up"
                        className="rounded-lg border border-slate-200 bg-white p-2 text-slate-700 transition hover:bg-slate-100 disabled:opacity-30"
                      >
                        <ChevronUp size={17} />
                      </button>

                      <button
                        onClick={() => moveSection(index, 1)}
                        disabled={index === customizableSections.length - 1}
                        title="Move down"
                        className="rounded-lg border border-slate-200 bg-white p-2 text-slate-700 transition hover:bg-slate-100 disabled:opacity-30"
                      >
                        <ChevronDown size={17} />
                      </button>

                      <button
                        onClick={() => toggleSection(section)}
                        title={isVisible ? "Hide section" : "Show section"}
                        className={`rounded-lg border p-2 transition ${
                          isVisible
                            ? "border-green-200 bg-green-50 text-green-800 hover:bg-green-100"
                            : "border-slate-200 bg-white text-slate-500 hover:bg-slate-100"
                        }`}
                      >
                        {isVisible ? <Eye size={17} /> : <EyeOff size={17} />}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={resetLayout}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <RotateCcw size={16} />
              Reset Layout
            </button>

            <button
              onClick={saveLayout}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <Save size={17} />
              )}
              {saving ? "Saving..." : "Save Shared Layout"}
            </button>
          </div>

          {message && (
            <p className="mt-4 text-sm font-medium text-slate-700">
              {message}
            </p>
          )}
        </div>
      )}

      {/* Customizable Dashboard Sections */}
      <div className="space-y-8">
        {order.map((section) =>
          customizableSections.includes(section) &&
          visible.includes(section) ? (
            <div key={section}>
              {sections[section]}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
