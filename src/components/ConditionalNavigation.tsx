
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  BusFront,
  ChartNoAxesCombined,
  Bell,
  ClipboardList,
  FileText,
} from "lucide-react";

const links = [
  { name: "Home", href: "/", icon: House },
  { name: "Fleet Intelligence", href: "/fleet-intelligence", icon: BusFront },
  { name: "Analytics", href: "/analytics", icon: ChartNoAxesCombined },
  { name: "Incident Reports", href: "/incidents", icon: FileText },
  { name: "Audit & Compliance", href: "/audit", icon: ClipboardList },
];

export default function ConditionalNavigation() {
  const pathname = usePathname();

  if (pathname.startsWith("/login")) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">

        {/* BRAND */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <div className="rounded-lg bg-blue-700 p-2 text-white">
            <BusFront size={22} />
          </div>

          <div>
            <p className="text-lg font-bold tracking-tight text-slate-900">
              METROFLOW AI
            </p>
            <p className="text-[10px] font-semibold tracking-widest text-slate-500">
              TRANSIT OPERATIONS
            </p>
          </div>
        </Link>

        {/* MAIN NAVIGATION */}
        <div className="flex flex-1 items-center justify-end gap-1 overflow-x-auto">
          {links.map((link) => {
            const Icon = link.icon;

            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon size={17} />
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* ALERTS — FAR RIGHT */}
        <Link
          href="/alerts"
          className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${
            pathname.startsWith("/alerts")
              ? "bg-red-50 text-red-700"
              : "text-red-600 hover:bg-red-50"
          }`}
        >
          <Bell size={18} />
          Alerts
        </Link>

      </div>
    </nav>
  );
}
