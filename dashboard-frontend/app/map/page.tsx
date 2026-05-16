"use client";

import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import { GET_VEHICLES_WITH_POSITIONS } from "@/graphql/vehicles";
import { useQuery } from "@apollo/client/react";
import dynamic from "next/dynamic";
import { useMemo } from "react";

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
  positions?: GpsPosition[];
};

type VehiclesResponse = {
  vehicles: Vehicle[];
};

export default function MapPage() {
  const VehicleMap = useMemo(
    () =>
      dynamic(() => import("@/components/VehicleMap"), {
        ssr: false,
        loading: () => (
          <div className="flex h-[600px] items-center justify-center rounded-3xl border border-slate-200 bg-white text-sm text-slate-500">
            Loading map...
          </div>
        ),
      }),
    []
  );

  const { data, loading, error } = useQuery<VehiclesResponse>(
    GET_VEHICLES_WITH_POSITIONS
  );

  const vehicles = data?.vehicles ?? [];

  const vehiclesWithGps = vehicles.filter(
    (vehicle) => vehicle.positions && vehicle.positions.length > 0
  );

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />

        <main className="flex-1">
          <Header
            title="Interactive Map"
            subtitle="Visualize the latest GPS positions of vehicles"
          />

          <section className="space-y-6 p-6">
            <div className="grid gap-5 md:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  Total vehicles
                </p>
                <p className="mt-4 text-4xl font-semibold text-slate-950">
                  {loading ? "..." : vehicles.length}
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  Vehicles with GPS
                </p>
                <p className="mt-4 text-4xl font-semibold text-slate-950">
                  {loading ? "..." : vehiclesWithGps.length}
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  Map center
                </p>
                <p className="mt-4 text-2xl font-semibold text-slate-950">
                  Tunis
                </p>
              </div>
            </div>

            {error && (
              <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                Unable to load map data. Check API Gateway, token, or vehicle
                service.
              </div>
            )}

            {!error && (
              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <VehicleMap vehicles={vehicles} />
              </div>
            )}

            {!loading && vehiclesWithGps.length === 0 && (
              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
                No GPS positions found. Go to Vehicles page and add a GPS
                position first.
              </div>
            )}
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}