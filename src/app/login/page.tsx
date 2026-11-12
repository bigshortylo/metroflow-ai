
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BusFront,
  ShieldCheck,
  LockKeyhole,
  Mail,
  ArrowRight,
  Loader2,
  Fingerprint,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.includes("@")) {
      setError("Please enter a valid operator email.");
      return;
    }

    setLoading(true);

    // DEMO ONLY: This simulates an Okta identity.
    // It does not authenticate a real user.
    sessionStorage.setItem(
      "metroflow_demo_operator",
      JSON.stringify({
        email,
        name: email.split("@")[0],
        provider: "Simulated Okta",
        signedInAt: new Date().toISOString(),
      })
    );

    router.push("/");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f4f8fc] px-5 py-14 text-slate-800">

      {/* White and Ice Blue Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-sky-200/50 blur-[120px]" />

        <div className="absolute -right-40 top-20 h-[600px] w-[600px] rounded-full bg-blue-200/40 blur-[130px]" />

        <div className="absolute -bottom-60 left-1/3 h-[600px] w-[600px] rounded-full bg-cyan-100/70 blur-[130px]" />

        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-transparent to-blue-100/30" />

      </div>

      {/* Subtle Background Grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(100,140,180,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(100,140,180,0.12) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 w-full max-w-[470px]">

        {/* Branding */}
        <div className="mb-9 text-center">

          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[26px] border border-white/90 bg-white/60 shadow-[0_15px_45px_rgba(70,130,180,0.15)] backdrop-blur-3xl">

            <BusFront
              size={38}
              className="text-cyan-600"
            />

          </div>

          <h1 className="text-3xl font-bold tracking-[0.16em] text-slate-800">
            METROFLOW <span className="text-cyan-600">AI</span>
          </h1>

          <p className="mt-2 text-xs font-medium tracking-[0.25em] text-slate-500">
            TRANSIT OPERATIONS CENTER
          </p>

        </div>

        {/* Main Frosted Glass Card */}
        <section className="relative overflow-hidden rounded-[34px] border border-white/90 bg-white/45 p-8 shadow-[0_30px_100px_rgba(70,110,160,0.16)] backdrop-blur-[45px] sm:p-10">

          {/* Glass Reflections */}
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-300/20 blur-[90px]" />

          <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-blue-300/20 blur-[90px]" />

          <div className="relative z-10">

            {/* Header */}
            <div className="mb-8 text-center">

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-200/80 bg-white/60 px-4 py-2 shadow-sm backdrop-blur-xl">

                <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />

                <span className="text-[10px] font-bold tracking-[0.16em] text-green-700">
                  SECURE OPERATOR ACCESS
                </span>

              </div>

              <h2 className="text-2xl font-semibold tracking-tight text-slate-800">
                Welcome back
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Access your transit operations workspace
              </p>

            </div>

            {/* Identity Provider Glass Panel */}
            <div className="mb-7 rounded-2xl border border-white/90 bg-white/55 p-5 shadow-[0_8px_30px_rgba(80,120,160,0.07)] backdrop-blur-3xl">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 shadow-sm">

                    <Fingerprint
                      size={25}
                      className="text-blue-600"
                    />

                  </div>

                  <div>
                    <p className="font-semibold text-slate-800">
                      Okta Identity
                    </p>

                    <p className="text-xs text-slate-500">
                      Single Sign-On
                    </p>
                  </div>

                </div>

                <ShieldCheck
                  size={23}
                  className="text-green-600"
                />

              </div>

              <div className="mt-4 border-t border-slate-200/60 pt-3">

                <p className="text-[10px] font-medium tracking-wider text-slate-400">
                  SIMULATED IDENTITY PROVIDER · DEMO MODE
                </p>

              </div>

            </div>

            {/* Operator Login */}
            <form onSubmit={handleLogin} className="space-y-5">

              <div>

                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Operator Email
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-white/90 bg-white/55 px-4 shadow-inner shadow-blue-100/30 transition focus-within:border-cyan-300 focus-within:bg-white/80 focus-within:shadow-[0_0_20px_rgba(34,211,238,0.12)]">

                  <Mail
                    size={18}
                    className="text-cyan-600"
                  />

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="operator@metroflow.demo"
                    className="w-full bg-transparent py-4 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  />

                </div>

              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50/80 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-white/80 bg-gradient-to-r from-cyan-600 to-blue-600 py-4 font-semibold text-white shadow-[0_12px_30px_rgba(37,130,190,0.25)] transition duration-300 hover:-translate-y-0.5 hover:from-cyan-500 hover:to-blue-500 hover:shadow-[0_18px_40px_rgba(37,130,190,0.32)] disabled:opacity-50"
              >

                {loading ? (
                  <>
                    <Loader2 size={19} className="animate-spin" />
                    Establishing Demo Session...
                  </>
                ) : (
                  <>
                    <LockKeyhole size={18} />
                    Continue with Okta
                    <ArrowRight
                      size={18}
                      className="transition group-hover:translate-x-1"
                    />
                  </>
                )}

              </button>

            </form>

            {/* Footer */}
            <div className="mt-8 border-t border-white/80 pt-6">

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <ShieldCheck size={15} className="text-cyan-600" />
                Human-controlled transit operations
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-medium tracking-[0.15em] text-slate-400">
                <Sparkles size={12} />
                METROFLOW AI DEMONSTRATION ENVIRONMENT
              </div>

            </div>

          </div>

        </section>

        <p className="mt-7 text-center text-xs tracking-wider text-slate-400">
          DALY CITY, CALIFORNIA
        </p>

      </div>

    </main>
  );
}
