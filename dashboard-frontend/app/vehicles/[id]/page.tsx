"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import { GET_VEHICLE_BY_ID } from "@/graphql/vehicles";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { useParams } from "next/navigation";

type GpsPosition = {
  id: string;
  latitude: number;
  longitude: number;
  timestamp: string;
};

type Vehicle = {
  id: string;
  plateNumber: string;
  type: string;
  status: string;
  positions: GpsPosition[];
};

type VehicleResponse = {
  vehicle: Vehicle;
};

export default function VehicleDetailsPage() {
  const params = useParams();
  const vehicleId = Number(params.id);

  const { data, loading, error } = useQuery<VehicleResponse>(
    GET_VEHICLE_BY_ID,
    {
      variables: {
        id: vehicleId,
      },
    }
  );

  const vehicle = data?.vehicle;

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#07090f]">
        <Sidebar />

        <main className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-14 items-center gap-4 border-b border-white/[0.07] bg-[#0d1117] px-7">
            <span className="text-[14px] font-semibold text-white">
              Détail véhicule
            </span>

            <div className="h-4 w-px bg-white/10" />

            <span className="text-[11.5px] text-slate-500">
              Informations du véhicule et historique GPS
            </span>

            <div className="ml-auto">
              <Link
                href="/vehicles"
                className="rounded-lg border border-white/[0.08] px-3 py-1.5 text-[11.5px] text-slate-400 hover:bg-white/[0.05]"
              >
                Retour
              </Link>
            </div>
          </header>

          <section className="flex-1 overflow-y-auto p-7 space-y-5">
            {loading && (
              <div className="rounded-2xl border border-white/[0.07] bg-[#111827] p-6 text-slate-400">
                Chargement du véhicule...
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.08] p-6 text-red-400">
                Impossible de charger le détail du véhicule.
              </div>
            )}

            {vehicle && (
              <>
                <div className="rounded-2xl border border-white/[0.07] bg-[#111827] p-6">
                  <h1 className="text-xl font-semibold text-white">
                    {vehicle.plateNumber}
                  </h1>

                  <div className="mt-5 grid gap-4 md:grid-cols-4">
                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
                      <p className="font-mono text-[10px] uppercase text-slate-500">
                        ID
                      </p>
                      <p className="mt-2 text-slate-200">#{vehicle.id}</p>
                    </div>

                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
                      <p className="font-mono text-[10px] uppercase text-slate-500">
                        Immatriculation
                      </p>
                      <p className="mt-2 text-slate-200">
                        {vehicle.plateNumber}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
                      <p className="font-mono text-[10px] uppercase text-slate-500">
                        Type
                      </p>
                      <p className="mt-2 text-slate-200">{vehicle.type}</p>
                    </div>

                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
                      <p className="font-mono text-[10px] uppercase text-slate-500">
                        Statut
                      </p>
                      <p className="mt-2 text-slate-200">{vehicle.status}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/[0.07] bg-[#111827] p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-[15px] font-semibold text-white">
                      Historique des déplacements GPS
                    </h2>

                    <span className="rounded border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-slate-500">
                      {vehicle.positions?.length ?? 0} positions
                    </span>
                  </div>

                  {vehicle.positions && vehicle.positions.length > 0 ? (
                    <div className="overflow-hidden rounded-xl border border-white/[0.07]">
                      <table className="w-full text-left text-[12.5px]">
                        <thead>
                          <tr className="border-b border-white/[0.06] bg-white/[0.03]">
                            <th className="px-4 py-3 text-slate-500">ID</th>
                            <th className="px-4 py-3 text-slate-500">
                              Latitude
                            </th>
                            <th className="px-4 py-3 text-slate-500">
                              Longitude
                            </th>
                            <th className="px-4 py-3 text-slate-500">
                              Date
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {vehicle.positions.map((position) => (
                            <tr
                              key={position.id}
                              className="border-b border-white/[0.04] last:border-none"
                            >
                              <td className="px-4 py-3 text-slate-400">
                                #{position.id}
                              </td>
                              <td className="px-4 py-3 text-slate-300">
                                {position.latitude}
                              </td>
                              <td className="px-4 py-3 text-slate-300">
                                {position.longitude}
                              </td>
                              <td className="px-4 py-3 text-slate-300">
                                {new Date(position.timestamp).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.07] p-5 text-sm text-amber-300">
                      Aucun historique GPS pour ce véhicule.
                    </div>
                  )}
                </div>
              </>
            )}
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}