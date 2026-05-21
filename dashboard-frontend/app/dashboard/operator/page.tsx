"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import { GET_VEHICLES } from "@/graphql/vehicles";
import { GET_TRAFFIC_ZONES } from "@/graphql/traffic";
import { GET_INCIDENTS } from "@/graphql/incidents";
import { GET_NOTIFICATIONS } from "@/graphql/notifications";
import { logout } from "@/lib/auth";import { useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

type Vehicle          = { id: string; plateNumber: string; type: string; status: string };
type TrafficZone      = { id: string; name: string; level: string; congested: boolean };
type Incident         = { id: string; status: string };
type NotificationItem = { id: string; isRead: boolean };

type VehiclesResponse      = { vehicles: Vehicle[] };
type TrafficZonesResponse  = { trafficZones: TrafficZone[] };
type IncidentsResponse     = { incidents: Incident[] };
type NotificationsResponse = { notifications: NotificationItem[] };

/* ─── Stat card ──────────────────────────────────────────────── */

function StatCard({
  value, label, desc, accent, icon, trend, trendVariant = "neutral",
}: {
  value: React.ReactNode;
  label: string;
  desc: string;
  accent: string;
  icon: React.ReactNode;
  trend?: string;
  trendVariant?: "up" | "warn" | "danger" | "neutral";
}) {
  const trendStyles: Record<string, string> = {
    up:      "text-emerald-400 bg-emerald-400/10",
    warn:    "text-amber-400 bg-amber-400/10",
    danger:  "text-red-400 bg-red-400/10",
    neutral: "text-blue-400 bg-blue-400/10",
  };
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111827] p-5 transition-all duration-200 hover:-translate-y-px hover:border-white/[0.12] hover:bg-[#151c28]">
      <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-2xl opacity-60" style={{ background: accent }} />
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${accent}18` }}>
          {icon}
        </div>
        {trend && (
          <span className={`rounded-md px-2 py-1 font-mono text-[10px] font-medium ${trendStyles[trendVariant]}`}>
            {trend}
          </span>
        )}
      </div>
      <div className="text-[28px] font-bold tracking-tight text-white leading-none mb-1">{value}</div>
      <div className="text-[13px] font-semibold text-slate-200 mb-1">{label}</div>
      <div className="font-mono text-[10.5px] text-slate-500">{desc}</div>
    </div>
  );
}

/* ─── Action link ────────────────────────────────────────────── */

function ActionLink({
  href, dotColor, children,
}: {
  href: string; dotColor: string; children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 text-[13px] font-medium text-slate-400 transition-all duration-150 hover:border-blue-500/30 hover:bg-blue-500/[0.06] hover:text-blue-300"
    >
      <div className="h-2 w-2 flex-shrink-0 rounded-full" style={{ background: dotColor }} />
      {children}
      <span className="ml-auto opacity-30 transition-all group-hover:translate-x-1 group-hover:opacity-100">→</span>
    </Link>
  );
}

/* ─── Restriction row ────────────────────────────────────────── */

function RestrictionRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 border-b border-white/[0.04] py-2.5 last:border-none">
      <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/20">
        <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>
      <span className="text-[12px] text-amber-300/70">{children}</span>
    </div>
  );
}

/* ─── Logout modal ───────────────────────────────────────────── */

function LogoutModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#111827] p-6 shadow-2xl">
        <div className="absolute left-0 top-0 h-px w-full rounded-t-2xl bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
        <div className="mb-5 flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-red-500/10 ring-1 ring-red-500/20">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </div>
          <div>
            <h2 className="text-[15px] font-semibold text-white">Déconnexion</h2>
            <p className="mt-1 text-[12.5px] leading-relaxed text-slate-400">
              Voulez-vous vraiment vous déconnecter du centre de contrôle ?
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 text-[13px] font-medium text-slate-400 transition hover:bg-white/[0.08] hover:text-slate-200">
            Annuler
          </button>
          <button onClick={onConfirm} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-[13px] font-semibold text-white transition hover:bg-red-500 active:scale-[0.98]">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */

export default function OperatorDashboardPage() {
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);

  const { data: vehiclesData,      loading: vehiclesLoading }      = useQuery<VehiclesResponse>(GET_VEHICLES);
  const { data: trafficData,       loading: trafficLoading }        = useQuery<TrafficZonesResponse>(GET_TRAFFIC_ZONES);
  const { data: incidentsData,     loading: incidentsLoading }      = useQuery<IncidentsResponse>(GET_INCIDENTS);
  const { data: notificationsData, loading: notificationsLoading }  = useQuery<NotificationsResponse>(GET_NOTIFICATIONS);

  const vehicleCount        = vehiclesData?.vehicles?.length ?? 0;
  const congestedCount      = trafficData?.trafficZones?.filter((zone) => zone.congested).length ?? 0;
  const incidentCount       = incidentsData?.incidents?.length ?? 0;
  const unreadNotifications = notificationsData?.notifications?.filter((n) => !n.isRead).length ?? 0;

  const loading = vehiclesLoading || trafficLoading || incidentsLoading || notificationsLoading;

  const val = (n: number) => (loading ? "—" : n.toString());

  function handleLogout() {
  logout();
  router.replace("/login");
}

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#07090f]">
        <Sidebar />

        <main className="flex flex-1 flex-col overflow-hidden">

          {/* Topbar */}
          <header className="flex h-14 flex-shrink-0 items-center gap-4 border-b border-white/[0.07] bg-[#0d1117] px-7">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              <span className="text-[14px] font-semibold text-white">Operator Dashboard</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <span className="text-[11.5px] text-slate-500">Supervision opérationnelle</span>

            <div className="ml-auto flex items-center gap-3">
              <span className="flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.04] px-2.5 py-1.5 font-mono text-[11px] text-slate-500">
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                Temps réel
              </span>

              {/* Role badge */}
              <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-amber-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
                Opérateur
              </div>

              <div className="h-4 w-px bg-white/[0.08]" />

              {/* Logout */}
              <button
                onClick={() => setShowLogout(true)}
                className="group flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/[0.06] px-3 py-1.5 text-[11.5px] font-medium text-red-400 transition hover:border-red-500/40 hover:bg-red-500/[0.12] hover:text-red-300 active:scale-[0.97]"
              >
                <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Déconnexion
              </button>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-7 space-y-5">

            {/* Hero banner */}
            <div className="relative overflow-hidden rounded-2xl border border-amber-500/15 bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-900 p-7">
              {/* Decorative road grid */}
              <svg className="absolute inset-y-0 right-0 h-full w-64 opacity-25" viewBox="0 0 256 120" preserveAspectRatio="xMaxYMid slice">
                <line x1="0" y1="60" x2="256" y2="60" stroke="rgba(245,158,11,0.4)" strokeWidth="1"/>
                <line x1="0" y1="30" x2="256" y2="30" stroke="rgba(245,158,11,0.15)" strokeWidth="0.5"/>
                <line x1="0" y1="90" x2="256" y2="90" stroke="rgba(245,158,11,0.15)" strokeWidth="0.5"/>
                <line x1="128" y1="0" x2="128" y2="120" stroke="rgba(245,158,11,0.2)" strokeWidth="1"/>
                <circle cx="128" cy="60" r="7" fill="none" stroke="rgba(245,158,11,0.5)" strokeWidth="1.5"/>
                <circle cx="128" cy="60" r="3" fill="rgba(245,158,11,0.5)"/>
                <circle cx="0"   cy="60" r="4" fill="rgba(245,158,11,0.25)"/>
                <circle cx="256" cy="60" r="4" fill="rgba(245,158,11,0.25)"/>
              </svg>

              <div className="relative">
                <div className="mb-3 inline-flex items-center gap-2 rounded border border-amber-500/25 bg-amber-500/10 px-3 py-1">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-amber-400">Opérateur</span>
                </div>
                <h1 className="text-[22px] font-bold tracking-tight text-white mb-2">
                  Espace de <span className="text-amber-400">monitoring opérationnel</span>
                </h1>
                <p className="max-w-lg text-[12.5px] leading-relaxed text-slate-400">
                  Consultez les véhicules et zones de trafic, ajoutez des positions GPS, déclarez des incidents et gérez les notifications.
                </p>
                <div className="mt-5 flex gap-5">
                  {[
                    { dot: "#10b981", label: "GPS",       val: "Actif"     },
                    { dot: "#3b82f6", label: "Véhicules", val: val(vehicleCount) },
                    { dot: "#f59e0b", label: "Congestionnées", val: val(congestedCount) },
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

            {/* Stats grid — 4 columns */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                value={val(vehicleCount)}
                label="Véhicules"
                desc="Disponibles en consultation"
                accent="#3b82f6"
                trend="Lecture seule"
                trendVariant="neutral"
                icon={<svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>}
              />
              <StatCard
                value={val(congestedCount)}
                label="Zones congestionnées"
                desc="Zones à fort trafic"
                accent="#f59e0b"
                trend={loading ? "—" : congestedCount > 0 ? "Attention" : "Normal"}
                trendVariant={congestedCount > 0 ? "warn" : "up"}
                icon={<svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>}
              />
              <StatCard
                value={val(incidentCount)}
                label="Incidents"
                desc="Incidents signalés"
                accent="#ef4444"
                trend={loading ? "—" : incidentCount > 0 ? `${incidentCount} actifs` : "Aucun"}
                trendVariant={incidentCount > 0 ? "danger" : "up"}
                icon={<svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
              />
              <StatCard
                value={val(unreadNotifications)}
                label="Notifications"
                desc="Non lues — à traiter"
                accent="#8b5cf6"
                trend={loading ? "—" : unreadNotifications > 0 ? "Non lues" : "À jour"}
                trendVariant={unreadNotifications > 0 ? "danger" : "up"}
                icon={<svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>}
              />
            </div>

            {/* Bottom panels */}
            <div className="grid gap-4 lg:grid-cols-2">

              {/* Operator actions */}
              <div className="rounded-2xl border border-white/[0.07] bg-[#111827] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/10">
                      <svg className="h-3.5 w-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                    </div>
                    <span className="text-[13px] font-semibold text-slate-100">Actions opérateur</span>
                  </div>
                  <span className="rounded border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-slate-500">
                    4 accès
                  </span>
                </div>
                <div className="space-y-2">
                  <ActionLink href="/vehicles"      dotColor="#3b82f6">Voir les véhicules &amp; ajouter GPS</ActionLink>
                  <ActionLink href="/traffic"       dotColor="#f59e0b">Consulter les zones de trafic</ActionLink>
                  <ActionLink href="/incidents"     dotColor="#ef4444">Déclarer un incident</ActionLink>
                  <ActionLink href="/notifications" dotColor="#8b5cf6">Voir les notifications</ActionLink>
                </div>
              </div>

              {/* Access restrictions */}
              <div className="rounded-2xl border border-amber-500/15 bg-amber-500/[0.04] p-5">
                <div className="mb-5 flex items-center gap-2.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/15">
                    <svg className="h-3.5 w-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                  <span className="text-[13px] font-semibold text-amber-200/90">Restrictions d&apos;accès</span>
                </div>
                <RestrictionRow>Création de véhicules non autorisée</RestrictionRow>
                <RestrictionRow>Création et modification de zones de trafic interdites</RestrictionRow>
                <RestrictionRow>Mise à jour du statut des incidents non autorisée</RestrictionRow>
                <RestrictionRow>Création de notifications non autorisée</RestrictionRow>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Logout modal */}
      {showLogout && (
        <LogoutModal
          onConfirm={handleLogout}
          onCancel={() => setShowLogout(false)}
        />
      )}
    </ProtectedRoute>
  );
}