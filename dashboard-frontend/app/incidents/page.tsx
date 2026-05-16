"use client";

import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import {
  CREATE_INCIDENT,
  GET_INCIDENTS,
  UPDATE_INCIDENT_STATUS,
} from "@/graphql/incidents";
import { getUser } from "@/lib/auth";
import { useMutation, useQuery } from "@apollo/client/react";
import { FormEvent, useEffect, useState } from "react";

type Incident = {
  id: string;
  type: string;
  description: string;
  location: string;
  status: string;
  createdAt: string;
};

type IncidentsResponse = {
  incidents: Incident[];
};

export default function IncidentsPage() {
  const { data, loading, error, refetch } =
    useQuery<IncidentsResponse>(GET_INCIDENTS);

  const [createIncident, { loading: creating }] = useMutation(CREATE_INCIDENT);
  const [updateIncidentStatus, { loading: updating }] =
    useMutation(UPDATE_INCIDENT_STATUS);

  const [role, setRole] = useState("");

  const [type, setType] = useState("ACCIDENT");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const [incidentId, setIncidentId] = useState("");
  const [status, setStatus] = useState("EN_COURS");

  const [message, setMessage] = useState("");

  useEffect(() => {
    const user = getUser();
    setRole(user?.role ?? "");
  }, []);

  const isAdmin = role === "ADMIN";

  async function handleCreateIncident(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    try {
      await createIncident({
        variables: {
          type,
          description,
          location,
        },
      });

      setType("ACCIDENT");
      setDescription("");
      setLocation("");
      setMessage("Incident created successfully.");
      await refetch();
    } catch {
      setMessage("Unable to create incident.");
    }
  }

  async function handleUpdateStatus(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    try {
      await updateIncidentStatus({
        variables: {
          incidentId: Number(incidentId),
          status,
        },
      });

      setIncidentId("");
      setStatus("EN_COURS");
      setMessage("Incident status updated successfully.");
      await refetch();
    } catch {
      setMessage("Unable to update status. ADMIN role is required.");
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />

        <main className="flex-1">
          <Header
            title="Incidents"
            subtitle="Declare incidents and monitor their status"
          />

          <section className="space-y-6 p-6">
            <div className="grid gap-6 xl:grid-cols-2">
              <form
                onSubmit={handleCreateIncident}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-slate-950">
                  Declare incident
                </h3>

                <div className="mt-5 grid gap-4">
                  <select
                    value={type}
                    onChange={(event) => setType(event.target.value)}
                    className="rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-950"
                  >
                    <option value="ACCIDENT">ACCIDENT</option>
                    <option value="TRAVAUX">TRAVAUX</option>
                    <option value="ROUTE_FERMEE">ROUTE_FERMEE</option>
                    <option value="EMBOUTEILLAGE">EMBOUTEILLAGE</option>
                  </select>

                  <input
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Description"
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

                  <button
                    disabled={creating}
                    className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                  >
                    {creating ? "Creating..." : "Create incident"}
                  </button>
                </div>
              </form>

              {isAdmin ? (
                <form
                  onSubmit={handleUpdateStatus}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-slate-950">
                    Update incident status
                  </h3>

                  <div className="mt-5 grid gap-4">
                    <input
                      value={incidentId}
                      onChange={(event) => setIncidentId(event.target.value)}
                      type="number"
                      placeholder="Incident ID"
                      className="rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-950"
                      required
                    />

                    <select
                      value={status}
                      onChange={(event) => setStatus(event.target.value)}
                      className="rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-950"
                    >
                      <option value="SIGNALE">SIGNALE</option>
                      <option value="EN_COURS">EN_COURS</option>
                      <option value="RESOLU">RESOLU</option>
                    </select>

                    <button
                      disabled={updating}
                      className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                    >
                      {updating ? "Updating..." : "Update status"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
                  You are connected as OPERATOR. You can create incidents but
                  cannot update their status.
                </div>
              )}
            </div>

            {message && (
              <div className="rounded-3xl border border-slate-200 bg-white p-5 text-sm text-slate-700">
                {message}
              </div>
            )}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-950">
                Incident list
              </h3>

              {loading && <p className="mt-4 text-sm">Loading incidents...</p>}

              {error && (
                <p className="mt-4 text-sm text-red-600">
                  Unable to load incidents.
                </p>
              )}

              {!loading && !error && (
                <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-100 text-slate-600">
                      <tr>
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Description</th>
                        <th className="px-4 py-3">Location</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {data?.incidents?.map((incident) => (
                        <tr key={incident.id} className="border-t">
                          <td className="px-4 py-3">{incident.id}</td>
                          <td className="px-4 py-3">{incident.type}</td>
                          <td className="px-4 py-3">
                            {incident.description}
                          </td>
                          <td className="px-4 py-3">{incident.location}</td>
                          <td className="px-4 py-3">{incident.status}</td>
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