"use client";

import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import {
  CREATE_TRAFFIC_ZONE,
  GET_TRAFFIC_ZONES,
  UPDATE_TRAFFIC_DENSITY,
} from "@/graphql/traffic";
import { getUser } from "@/lib/auth";
import { useMutation, useQuery } from "@apollo/client/react";
import { FormEvent, useEffect, useState } from "react";

type TrafficZone = {
  id: string;
  name: string;
  location: string;
  vehicleCount: number;
  density: number;
  level: string;
  congested: boolean;
};

type TrafficZonesResponse = {
  trafficZones: TrafficZone[];
};

export default function TrafficPage() {
  const { data, loading, error, refetch } =
    useQuery<TrafficZonesResponse>(GET_TRAFFIC_ZONES);

  const [createTrafficZone, { loading: creating }] =
    useMutation(CREATE_TRAFFIC_ZONE);

  const [updateTrafficDensity, { loading: updating }] =
    useMutation(UPDATE_TRAFFIC_DENSITY);

  const [role, setRole] = useState("");

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [vehicleCount, setVehicleCount] = useState(20);

  const [zoneId, setZoneId] = useState("");
  const [newVehicleCount, setNewVehicleCount] = useState(25);

  const [message, setMessage] = useState("");

  useEffect(() => {
    const user = getUser();
    setRole(user?.role ?? "");
  }, []);

  const isAdmin = role === "ADMIN";

  async function handleCreateZone(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    try {
      await createTrafficZone({
        variables: {
          name,
          location,
          vehicleCount: Number(vehicleCount),
        },
      });

      setName("");
      setLocation("");
      setVehicleCount(20);
      setMessage("Traffic zone created successfully.");
      await refetch();
    } catch {
      setMessage("Unable to create traffic zone. Check your role or data.");
    }
  }

  async function handleUpdateDensity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    try {
      await updateTrafficDensity({
        variables: {
          zoneId: Number(zoneId),
          vehicleCount: Number(newVehicleCount),
        },
      });

      setZoneId("");
      setNewVehicleCount(25);
      setMessage("Traffic density updated successfully.");
      await refetch();
    } catch {
      setMessage("Unable to update density. ADMIN role is required.");
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />

        <main className="flex-1">
          <Header
            title="Traffic"
            subtitle="Monitor traffic density and congestion levels"
          />

          <section className="space-y-6 p-6">
            {isAdmin && (
              <div className="grid gap-6 xl:grid-cols-2">
                <form
                  onSubmit={handleCreateZone}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-slate-950">
                    Create traffic zone
                  </h3>

                  <div className="mt-5 grid gap-4">
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Zone name"
                      className="rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-950"
                      required
                    />

                    <input
                      value={location}
                      onChange={(event) => setLocation(event.target.value)}
                      placeholder="Location"
                      className="rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-950"
                      required
                    />

                    <input
                      value={vehicleCount}
                      onChange={(event) =>
                        setVehicleCount(Number(event.target.value))
                      }
                      type="number"
                      placeholder="Vehicle count"
                      className="rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-950"
                      required
                    />

                    <button
                      disabled={creating}
                      className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                    >
                      {creating ? "Creating..." : "Create zone"}
                    </button>
                  </div>
                </form>

                <form
                  onSubmit={handleUpdateDensity}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-slate-950">
                    Update traffic density
                  </h3>

                  <div className="mt-5 grid gap-4">
                    <input
                      value={zoneId}
                      onChange={(event) => setZoneId(event.target.value)}
                      type="number"
                      placeholder="Zone ID"
                      className="rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-950"
                      required
                    />

                    <input
                      value={newVehicleCount}
                      onChange={(event) =>
                        setNewVehicleCount(Number(event.target.value))
                      }
                      type="number"
                      placeholder="New vehicle count"
                      className="rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-950"
                      required
                    />

                    <button
                      disabled={updating}
                      className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                    >
                      {updating ? "Updating..." : "Update density"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {!isAdmin && (
              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
                You are connected as OPERATOR. You can view traffic zones but
                cannot create or update them.
              </div>
            )}

            {message && (
              <div className="rounded-3xl border border-slate-200 bg-white p-5 text-sm text-slate-700">
                {message}
              </div>
            )}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-950">
                Traffic zones
              </h3>

              {loading && <p className="mt-4 text-sm">Loading zones...</p>}

              {error && (
                <p className="mt-4 text-sm text-red-600">
                  Unable to load traffic zones.
                </p>
              )}

              {!loading && !error && (
                <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-100 text-slate-600">
                      <tr>
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Location</th>
                        <th className="px-4 py-3">Vehicles</th>
                        <th className="px-4 py-3">Level</th>
                        <th className="px-4 py-3">Congested</th>
                      </tr>
                    </thead>

                    <tbody>
                      {data?.trafficZones?.map((zone) => (
                        <tr key={zone.id} className="border-t">
                          <td className="px-4 py-3">{zone.id}</td>
                          <td className="px-4 py-3 font-medium">
                            {zone.name}
                          </td>
                          <td className="px-4 py-3">{zone.location}</td>
                          <td className="px-4 py-3">{zone.vehicleCount}</td>
                          <td className="px-4 py-3">{zone.level}</td>
                          <td className="px-4 py-3">
                            {zone.congested ? "Yes" : "No"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}