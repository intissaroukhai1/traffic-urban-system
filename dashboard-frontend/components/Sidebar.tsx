"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/vehicles", label: "Vehicles" },
  { href: "/traffic", label: "Traffic" },
  { href: "/incidents", label: "Incidents" },
  { href: "/notifications", label: "Notifications" },
  { href: "/map", label: "Map" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-64 border-r border-white/10 bg-slate-950 px-5 py-6 text-white md:block">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
          Urban
        </p>
        <h1 className="mt-2 text-2xl font-semibold">Traffic System</h1>
      </div>

      <nav className="space-y-2">
        {links.map((link) => {
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-2xl px-4 py-3 text-sm transition ${
                active
                  ? "bg-white text-slate-950"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}