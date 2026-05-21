"use client";

import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import { GET_VEHICLES } from "@/graphql/vehicles";
import { GET_TRAFFIC_ZONES } from "@/graphql/traffic";
import { GET_INCIDENTS } from "@/graphql/incidents";
import { GET_NOTIFICATIONS } from "@/graphql/notifications";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";

/* ─── Types ─────────────────────────────────────────────────── */

type Vehicle      = { id: string; plateNumber: string; type: string; status: string };
type TrafficZone  = { id: string; name: string; level: string; congested: boolean };
type Incident     = { id: string; status: string };
type NotificationItem = { id: string; isRead: boolean };

type VehiclesResponse      = { vehicles: Vehicle[] };
type TrafficZonesResponse  = { trafficZones: TrafficZone[] };
type IncidentsResponse     = { incidents: Incident[] };
type NotificationsResponse = { notifications: NotificationItem[] };

/* ─── Tiny sub-components ────────────────────────────────────── */

function StatCard({
  value,
  label,
  desc,
  accent,
  trend,
  trendVariant = "neutral",
  icon,
}: {
  value: React.ReactNode;
  label: string;
  desc: string;
  accent: string;
  trend: string;
  trendVariant?: "up" | "warn" | "danger" | "neutral";
  icon: React.ReactNode;
}) {
  const trendStyles: Record<string, string> = {
    up:      "text-emerald-400 bg-emerald-400/10",
    warn:    "text-amber-400 bg-amber-400/10",
    danger:  "text-red-400 bg-red-400/10",
    neutral: "text-blue-400 bg-blue-400/10",
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111827] p-5 transition-all duration-200 hover:-translate-y-px hover:border-white/[0.12] hover:bg-[#151c28]"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      {/* Bottom accent bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-2xl opacity-60"
        style={{ background: accent }}
      />

      <div className="mb-4 flex items-start justify-between">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ background: `${accent}18` }}
        >
          {icon}
        </div>
        <span
          className={`rounded-md px-2 py-1 font-mono text-[10px] font-medium ${trendStyles[trendVariant]}`}
        >
          {trend}
        </span>
      </div>

      <div className="text-[28px] font-bold tracking-tight text-white leading-none mb-1">
        {value}
      </div>
      <div className="text-[13px] font-semibold text-slate-200 mb-1">{label}</div>
      <div className="font-mono text-[10.5px] text-slate-500">{desc}</div>
    </div>
  );
}

function ActionLink({ href, dotColor, children }: { href: string; dotColor: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 text-sm font-medium text-slate-400 transition-all duration-150 hover:border-blue-500/30 hover:bg-blue-500/[0.06] hover:text-blue-300"
    >
      <div className="h-2 w-2 flex-shrink-0 rounded-full" style={{ background: dotColor }} />
      {children}
      <span className="ml-auto opacity-30 transition-all group-hover:translate-x-1 group-hover:opacity-100">
        →
      </span>
    </Link>
  );
}

function CheckRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 border-b border-white/[0.04] py-2.5 last:border-none">
      <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/25">
        <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <span className="text-[12px] text-slate-400">{children}</span>
    </div>
  );
}

function ServiceRow({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.04] py-2.5 last:border-none">
      <span className="font-mono text-[11.5px] text-slate-300">{name}</span>
      <div className="flex gap-2">
        <span className="rounded border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 font-mono text-[9px] text-blue-400">
          REST
        </span>
        <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-[9px] text-emerald-400">
          online
        </span>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */

export default function AdminDashboardPage() {
  const router = useRouter();

function handleLogout() {
  logout();
  router.replace("/login");
}
  const {
  data: vehiclesData,
  loading: l1,
  refetch: refetchVehicles,
} = useQuery<VehiclesResponse>(GET_VEHICLES);

const {
  data: trafficData,
  loading: l2,
  refetch: refetchTraffic,
} = useQuery<TrafficZonesResponse>(GET_TRAFFIC_ZONES);

const {
  data: incidentsData,
  loading: l3,
  refetch: refetchIncidents,
} = useQuery<IncidentsResponse>(GET_INCIDENTS);

const {
  data: notificationsData,
  loading: l4,
  refetch: refetchNotifications,
} = useQuery<NotificationsResponse>(GET_NOTIFICATIONS);
async function handleRefresh() {
  await Promise.all([
    refetchVehicles(),
    refetchTraffic(),
    refetchIncidents(),
    refetchNotifications(),
  ]);
}
  const loading = l1 || l2 || l3 || l4;

  const vehicleCount       = vehiclesData?.vehicles?.length ?? 0;
  const trafficZoneCount   = trafficData?.trafficZones?.length ?? 0;
  const congestedCount     = trafficData?.trafficZones?.filter((z) => z.congested).length ?? 0;
  const incidentCount      = incidentsData?.incidents?.length ?? 0;
  const unresolvedCount    = incidentsData?.incidents?.filter((i) => i.status !== "RESOLU").length ?? 0;
  const unreadCount        = notificationsData?.notifications?.filter((n) => !n.isRead).length ?? 0;

  const val = (n: number) => (loading ? "—" : n.toString());

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#07090f]">
        <Sidebar />

        <main className="flex flex-1 flex-col overflow-hidden">
          {/* Custom topbar — replaces generic Header */}
          <header className="flex h-14 flex-shrink-0 items-center gap-4 border-b border-white/[0.07] bg-[#0d1117] px-7">
            <span className="text-[14px] font-semibold text-white">Admin Dashboard</span>
            <div className="h-4 w-px bg-white/10" />
            <span className="text-[11.5px] text-slate-500">Centre de supervision global</span>
            <div className="ml-auto flex items-center gap-3">
              <span className="flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.04] px-2.5 py-1.5 font-mono text-[11px] text-slate-500">
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                Temps réel
              </span>
              <button
  onClick={handleRefresh}
  className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] px-3 py-1.5 text-[11.5px] font-medium text-slate-400 transition hover:bg-white/[0.05] hover:text-slate-200"
>
  <svg
    className="h-3.5 w-3.5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
  </svg>
  Actualiser
</button>
              <button
  onClick={handleLogout}
  className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[11.5px] font-medium text-red-400 transition hover:bg-red-500/20 hover:text-red-300"
>
  <svg
    className="h-3.5 w-3.5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
  Logout
</button>
              {unreadCount > 0 && (
                <div className="relative">
                  <button className="flex items-center rounded-lg border border-white/[0.08] p-1.5 text-slate-400 transition hover:bg-white/[0.05]">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
                    </svg>
                  </button>
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#0d1117] bg-red-500 font-mono text-[8px] text-white">
                    {unreadCount}
                  </span>
                </div>
              )}
            </div>
          </header>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-7 space-y-5">

            {/* Hero banner */}
            <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 p-7">
              {/* Road grid decoration */}
              <svg className="absolute inset-y-0 right-0 h-full w-64 opacity-30" viewBox="0 0 256 120" preserveAspectRatio="xMaxYMid slice">
                <line x1="0" y1="60" x2="256" y2="60" stroke="rgba(99,102,241,0.3)" strokeWidth="1" />
                <line x1="0" y1="30" x2="256" y2="30" stroke="rgba(99,102,241,0.15)" strokeWidth="0.5" />
                <line x1="0" y1="90" x2="256" y2="90" stroke="rgba(99,102,241,0.15)" strokeWidth="0.5" />
                <line x1="128" y1="0" x2="128" y2="120" stroke="rgba(99,102,241,0.2)" strokeWidth="1" />
                <circle cx="128" cy="60" r="7" fill="none" stroke="rgba(99,102,241,0.5)" strokeWidth="1.5" />
                <circle cx="128" cy="60" r="3" fill="rgba(99,102,241,0.6)" />
                <circle cx="0"   cy="60" r="4" fill="rgba(99,102,241,0.3)" />
                <circle cx="256" cy="60" r="4" fill="rgba(99,102,241,0.3)" />
              </svg>

              <div className="relative">
                <div className="mb-3 inline-flex items-center gap-2 rounded border border-indigo-500/25 bg-indigo-500/10 px-3 py-1">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-indigo-400">
                    Administrateur
                  </span>
                </div>
                <h1 className="text-[22px] font-bold tracking-tight text-white mb-2">
                  Supervision{" "}
                  <span className="text-indigo-400">système complet</span>
                </h1>
                <p className="max-w-lg text-[12.5px] leading-relaxed text-slate-400">
                  Gérez les véhicules, zones de trafic, incidents et notifications. Accès exclusif aux utilisateurs ADMIN.
                </p>
                <div className="mt-5 flex gap-5">
                  {[
                    { dot: "#10b981", label: "Gateway", val: "GraphQL" },
                    { dot: "#3b82f6", label: "Services", val: "5 REST" },
                    { dot: "#f59e0b", label: "Uptime",   val: "99.97%" },
                  ].map((m) => (
                    <div key={m.label} className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full" style={{ background: m.dot }} />
                      <span className="font-mono text-[11px] text-slate-500">{m.label} —</span>
                      <span className="font-mono text-[11px] font-medium text-slate-300">{m.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid gap-3 md:grid-cols-3">
              <StatCard
                value={val(vehicleCount)}
                label="Véhicules"
                desc="Enregistrés dans le système"
                accent="#3b82f6"
                trend="↑ 12%"
                trendVariant="up"
                icon={
                  <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 3v3h-7V8z" />
                    <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                }
              />
              <StatCard
                value={val(trafficZoneCount)}
                label="Zones trafic"
                desc="Zones de circulation actives"
                accent="#f59e0b"
                trend={loading ? "—" : `${congestedCount} congestionnées`}
                trendVariant="warn"
                icon={
                  <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="3 11 22 2 13 21 11 13 3 11" />
                  </svg>
                }
              />
              <StatCard
                value={val(incidentCount)}
                label="Incidents"
                desc="Total incidents signalés"
                accent="#ef4444"
                trend={loading ? "—" : `${unresolvedCount} non résolus`}
                trendVariant="danger"
                icon={
                  <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                }
              />
              <StatCard
                value={val(unreadCount)}
                label="Notifications"
                desc="Alertes système en attente"
                accent="#8b5cf6"
                trend={loading ? "—" : `${unreadCount} non lues`}
                trendVariant={unreadCount > 0 ? "danger" : "up"}
                icon={
                  <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
                  </svg>
                }
              />
              <StatCard
                value="5"
                label="Microservices"
                desc="Services REST actifs"
                accent="#10b981"
                trend="Opérationnel"
                trendVariant="up"
                icon={
                  <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" />
                  </svg>
                }
              />
              <StatCard
                value={<span className="text-[18px] pt-1 block">GraphQL</span>}
                label="API Gateway"
                desc="Couche d'accès unifiée"
                accent="#3b82f6"
                trend="Point d'entrée"
                trendVariant="neutral"
                icon={
                  <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
                  </svg>
                }
              />
            </div>

            {/* Bottom panels */}
            <div className="grid gap-4 lg:grid-cols-2">

              {/* Admin actions */}
              <div className="rounded-2xl border border-white/[0.07] bg-[#111827] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500/10">
                      <svg className="h-3.5 w-3.5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3" /><path d="M19.07 4.93l-1.41 1.41M5.34 17.66l-1.41 1.41M2 12h2m16 0h2M5.34 6.34L3.93 4.93M18.66 17.66l1.41 1.41M12 2v2m0 16v2" />
                      </svg>
                    </div>
                    <span className="text-[13px] font-semibold text-slate-100">Actions administrateur</span>
                  </div>
                  <span className="rounded border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-slate-500">
                    4 modules
                  </span>
                </div>
                <div className="space-y-2">
                  <ActionLink href="/vehicles" dotColor="#3b82f6">Créer ou gérer les véhicules</ActionLink>
                  <ActionLink href="/traffic"  dotColor="#f59e0b">Zones trafic — créer &amp; densité</ActionLink>
                  <ActionLink href="/incidents" dotColor="#ef4444">Mettre à jour les incidents</ActionLink>
                  <ActionLink href="/notifications" dotColor="#8b5cf6">Créer des notifications</ActionLink>
                </div>
              </div>

              {/* Right column */}
              <div className="flex flex-col gap-4">

                {/* Auth summary */}
                <div className="rounded-2xl border border-white/[0.07] bg-[#111827] p-5">
                  <div className="mb-4 flex items-center gap-2.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500/10">
                      <svg className="h-3.5 w-3.5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </div>
                    <span className="text-[13px] font-semibold text-slate-100">Autorisations ADMIN</span>
                  </div>
                  <CheckRow>Créer et gérer les véhicules</CheckRow>
                  <CheckRow>Créer et mettre à jour les zones trafic</CheckRow>
                  <CheckRow>Modifier le statut des incidents</CheckRow>
                  <CheckRow>Créer des notifications système</CheckRow>
                  <CheckRow>Consulter toutes les données</CheckRow>
                </div>

                {/* Services */}
                <div className="rounded-2xl border border-white/[0.07] bg-[#111827] p-5">
                  <div className="mb-4 flex items-center gap-2.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500/10">
                      <svg className="h-3.5 w-3.5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
                      </svg>
                    </div>
                    <span className="text-[13px] font-semibold text-slate-100">Infrastructure</span>
                  </div>
                  <ServiceRow name="vehicles-service" />
                  <ServiceRow name="traffic-service" />
                  <ServiceRow name="incidents-service" />
                  <ServiceRow name="notifications-service" />
                  <ServiceRow name="auth-service" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}