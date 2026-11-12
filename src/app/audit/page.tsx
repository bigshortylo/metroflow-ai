
import { ArrowLeft, ClipboardList } from "lucide-react";
import DecisionHistory from "@/components/DecisionHistory";

export default function AuditPage() {
  return (
    <main className="min-h-screen bg-[#f3f6fa] px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </a>

        <header className="flex items-center gap-4">
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <ClipboardList size={30} className="text-blue-700" />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
              METROFLOW AI / Governance
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-950">
              Audit &amp; Compliance
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Review and investigate recorded operator decisions.
            </p>
          </div>
        </header>

        <DecisionHistory />
      </div>
    </main>
  );
}
