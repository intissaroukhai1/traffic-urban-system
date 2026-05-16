"use client";

import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import {
  ADD_GPS_POSITION,
  CREATE_VEHICLE,
  GET_VEHICLES,
} from "@/graphql/vehicles";
import { getUser } from "@/lib/auth";
import { useMutation, useQuery } from "@apollo/client/react";
import { FormEvent, useEffect, useState } from "react";

type Vehicle = {
  id: string;
  plateNumber: string;
  type: string;
  status: string;
};

type VehiclesResponse = { vehicles: Vehicle[] };

/* ─── Status badge ───────────────────────────────────────────── */

function StatusBadge({ status }: { status: string }) {
  const s = status.toUpperCase();
  const styles: Record<string, string> = {
    ACTIVE:      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    INACTIVE:    "bg-slate-500/10  text-slate-400  border-slate-500/20",
    MAINTENANCE: "bg-amber-500/10  text-amber-400  border-amber-500/20",
    EN_SERVICE:  "bg-blue-500/10   text-blue-400   border-blue-500/20",
  };
  const cls = styles[s] ?? "bg-slate-500/10 text-slate-400 border-slate-500/20";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${cls}`}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: "currentColor" }} />
      {status}
    </span>
  );
}

/* ─── Form field ─────────────────────────────────────────────── */

function Field({
  label, value, onChange, placeholder, type = "text", step,
}: {
  label: string; value: string;
  onChange: (v: string) => void;
  placeholder?: string; type?: string; step?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        step={step}
        placeholder={placeholder}
        required
        className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 text-[13px] text-slate-200 placeholder-slate-600 outline-none transition focus:border-blue-500/50 focus:bg-white/[0.07] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
      />
    </div>
  );
}

/* ─── Panel wrapper ──────────────────────────────────────────── */

function Panel({
  children, accent = "#3b82f6",
}: {
  children: React.ReactNode; accent?: string;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111827] p-6"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <div
        className="absolute left-0 top-0 h-px w-full opacity-40"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />
      {children}
    </div>
  );
}

function PanelTitle({
  icon, children, badge,
}: {
  icon: React.ReactNode; children: React.ReactNode; badge?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
          {icon}
        </div>
        <span className="text-[14px] font-semibold text-slate-100">{children}</span>
      </div>
      {badge}
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */

export default function VehiclesPage() {
  const { data, loading, error, refetch } = useQuery<VehiclesResponse>(GET_VEHICLES);
  const [createVehicle, { loading: creating }] = useMutation(CREATE_VEHICLE);
  const [addGpsPosition, { loading: addingGps }] = useMutation(ADD_GPS_POSITION);

  const [role, setRole] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [type, setType] = useState("Bus");
  const [status, setStatus] = useState("ACTIVE");

  const [gpsVehicleId, setGpsVehicleId] = useState("");
  const [latitude, setLatitude]   = useState("36.8065");
  const [longitude, setLongitude] = useState("10.1815");

  const [message, setMessage]     = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    const user = getUser();
    setRole(user?.role ?? "");
  }, []);

  const isAdmin = role === "ADMIN";
  const vehicles = data?.vehicles ?? [];

  async function handleCreateVehicle(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    try {
      await createVehicle({ variables: { plateNumber, type, status } });
      setPlateNumber(""); setType("Bus"); setStatus("ACTIVE");
      setMessage({ text: "Véhicule créé avec succès.", ok: true });
      await refetch();
    } catch {
      setMessage({ text: "Impossible de créer le véhicule. Vérifiez le rôle ou la plaque.", ok: false });
    }
  }

  async function handleAddGpsPosition(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    try {
      await addGpsPosition({
        variables: {
          vehicleId: Number(gpsVehicleId),
          latitude:  Number(latitude),
          longitude: Number(longitude),
        },
      });
      setGpsVehicleId(""); setLatitude("36.8065"); setLongitude("10.1815");
      setMessage({ text: "Position GPS ajoutée avec succès.", ok: true });
    } catch {
      setMessage({ text: "Impossible d'ajouter la position GPS. Vérifiez l'ID du véhicule.", ok: false });
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#07090f]">
        <Sidebar />

        <main className="flex flex-1 flex-col overflow-hidden">

          {/* Topbar */}
          <header className="flex h-14 flex-shrink-0 items-center gap-4 border-b border-white/[0.07] bg-[#0d1117] px-7">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 3v3h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              <span className="text-[14px] font-semibold text-white">Véhicules</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <span className="text-[11.5px] text-slate-500">Gestion des véhicules et positions GPS</span>
            <div className="ml-auto flex items-center gap-3">
              {!loading && (
                <div className="flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-1.5">
                  <span className="font-mono text-[11px] text-slate-400">{vehicles.length}</span>
                  <span className="font-mono text-[11px] text-slate-600">véhicules</span>
                </div>
              )}
              <div className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider ${
                isAdmin
                  ? "border-blue-500/20 bg-blue-500/10 text-blue-400"
                  : "border-amber-500/20 bg-amber-500/10 text-amber-400"
              }`}>
                <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: "currentColor" }} />
                {isAdmin ? "Admin" : "Opérateur"}
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-7 space-y-4">

            {/* Operator notice */}
            {!isAdmin && (
              <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.07] px-4 py-3.5">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <p className="text-[12.5px] text-amber-300/80">
                  Connecté en tant qu&apos;OPÉRATEUR — consultation et ajout GPS autorisés. Création de véhicules réservée aux ADMIN.
                </p>
              </div>
            )}

            {/* Feedback message */}
            {message && (
              <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-[12.5px] ${
                message.ok
                  ? "border-emerald-500/20 bg-emerald-500/[0.08] text-emerald-400"
                  : "border-red-500/20 bg-red-500/[0.08] text-red-400"
              }`}>
                {message.ok ? (
                  <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (
                  <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                )}
                {message.text}
              </div>
            )}

            {/* Create vehicle (admin only) */}
            {isAdmin && (
              <Panel accent="#3b82f6">
                <PanelTitle
                  icon={
                    <svg className="h-4 w-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
                    </svg>
                  }
                  badge={
                    <span className="rounded border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-blue-400">
                      Admin uniquement
                    </span>
                  }
                >
                  Créer un véhicule
                </PanelTitle>

                <form onSubmit={handleCreateVehicle}>
                  <div className="grid gap-4 md:grid-cols-4">
                    <Field label="Plaque" value={plateNumber} onChange={setPlateNumber} placeholder="TN-123-ABC" />
                    <Field label="Type" value={type} onChange={setType} placeholder="Bus, Taxi…" />
                    <Field label="Statut" value={status} onChange={setStatus} placeholder="ACTIVE" />
                    <div className="flex flex-col justify-end">
                      <button
                        disabled={creating}
                        className="group relative overflow-hidden rounded-xl bg-blue-600 px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-blue-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                        <span className="relative flex items-center justify-center gap-2">
                          {creating ? (
                            <>
                              <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={3}/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                              Création…
                            </>
                          ) : (
                            <>
                              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                              Créer
                            </>
                          )}
                        </span>
                      </button>
                    </div>
                  </div>
                </form>
              </Panel>
            )}

            {/* Add GPS position */}
            <Panel accent="#10b981">
              <PanelTitle
                icon={
                  <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
                  </svg>
                }
                badge={
                  <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-emerald-400">
                    Admin + Opérateur
                  </span>
                }
              >
                Ajouter une position GPS
              </PanelTitle>

              <form onSubmit={handleAddGpsPosition}>
                <div className="grid gap-4 md:grid-cols-4">
                  <Field label="ID Véhicule" value={gpsVehicleId} onChange={setGpsVehicleId} type="number" placeholder="42" />
                  <Field label="Latitude"    value={latitude}     onChange={setLatitude}     type="number" step="any" placeholder="36.8065" />
                  <Field label="Longitude"   value={longitude}    onChange={setLongitude}    type="number" step="any" placeholder="10.1815" />
                  <div className="flex flex-col justify-end">
                    <button
                      disabled={addingGps}
                      className="group relative overflow-hidden rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-[13px] font-semibold text-emerald-400 transition hover:bg-emerald-500/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span className="relative flex items-center justify-center gap-2">
                        {addingGps ? (
                          <>
                            <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={3}/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                            Ajout…
                          </>
                        ) : (
                          <>
                            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                            </svg>
                            Ajouter GPS
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            </Panel>

            {/* Vehicle list */}
            <Panel accent="#8b5cf6">
              <PanelTitle
                icon={
                  <svg className="h-4 w-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v3h-7V8z"/>
                    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                }
                badge={
                  !loading && (
                    <span className="rounded border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-slate-500">
                      {vehicles.length} entrée{vehicles.length !== 1 ? "s" : ""}
                    </span>
                  )
                }
              >
                Liste des véhicules
              </PanelTitle>

              {loading && (
                <div className="flex items-center gap-3 py-8 text-[12.5px] text-slate-500">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={3}/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Chargement des véhicules…
                </div>
              )}

              {error && (
                <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3 text-[12.5px] text-red-400">
                  <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  Impossible de charger les véhicules. Vérifiez le token ou les services backend.
                </div>
              )}

              {!loading && !error && (
                <div className="overflow-hidden rounded-xl border border-white/[0.07]">
                  <table className="w-full text-left text-[12.5px]">
                    <thead>
                      <tr className="border-b border-white/[0.06] bg-white/[0.03]">
                        {["ID", "Plaque", "Type", "Statut"].map((h) => (
                          <th key={h} className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] font-medium text-slate-500">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {vehicles.map((v, i) => (
                        <tr
                          key={v.id}
                          className="border-b border-white/[0.04] transition-colors last:border-none hover:bg-white/[0.03]"
                        >
                          <td className="px-4 py-3 font-mono text-[11px] text-slate-500">
                            #{v.id}
                          </td>
                          <td className="px-4 py-3 font-semibold text-slate-100">
                            {v.plateNumber}
                          </td>
                          <td className="px-4 py-3 text-slate-400">
                            {v.type}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={v.status} />
                          </td>
                        </tr>
                      ))}

                      {vehicles.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-12 text-center">
                            <div className="flex flex-col items-center gap-3 text-slate-600">
                              <svg className="h-8 w-8 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                                <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v3h-7V8z"/>
                                <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                              </svg>
                              <span className="text-[12px]">Aucun véhicule enregistré</span>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </Panel>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}