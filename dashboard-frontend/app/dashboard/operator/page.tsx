"use client";

import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import { GET_VEHICLES } from "@/graphql/vehicles";
import { GET_TRAFFIC_ZONES } from "@/graphql/traffic";
import { GET_INCIDENTS } from "@/graphql/incidents";
import { GET_NOTIFICATIONS } from "@/graphql/notifications";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";

type Vehicle = {
  id: string;
  plateNumber: string;
  type: string;
  status: string;
};

type TrafficZone = {
  id: string;
  name: string;
  level: string;
  congested: boolean;
};

type Incident = {
  id: string;
  status: string;
};

type NotificationItem = {
  id: string;
  isRead: boolean;
};

type VehiclesResponse = {
  vehicles: Vehicle[];
};

type TrafficZonesResponse = {
  trafficZones: TrafficZone[];
};

type IncidentsResponse = {
  incidents: Incident[];
};

type NotificationsResponse = {
  notifications: NotificationItem[];
};

export default function OperatorDashboardPage() {
  const { data: vehiclesData, loading: vehiclesLoading } =
    useQuery<VehiclesResponse>(GET_VEHICLES);

  const { data: trafficData, loading: trafficLoading } =
    useQuery<TrafficZonesResponse>(GET_TRAFFIC_ZONES);

  const { data: incidentsData, loading: incidentsLoading } =
    useQuery<IncidentsResponse>(GET_INCIDENTS);

  const { data: notificationsData, loading: notificationsLoading } =
    useQuery<NotificationsResponse>(GET_NOTIFICATIONS);

  const vehicleCount = vehiclesData?.vehicles?.length ?? 0;
  const congestedCount =
    trafficData?.trafficZones?.filter((zone) => zone.congested).length ?? 0;
  const incidentCount = incidentsData?.incidents?.length ?? 0;
  const unreadNotifications =
    notificationsData?.notifications?.filter((notification) => !notification.isRead)
      .length ?? 0;

  const loading =
    vehiclesLoading || trafficLoading || incidentsLoading || notificationsLoading;

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />

        <main className="flex-1">
          <Header
            title="Operator Dashboard"
            subtitle="Operational monitoring and incident reporting"
          />

          <section className="space-y-6 p-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                Operator
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-950">
                Monitoring workspace
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                You can consult vehicles and traffic zones, add GPS positions,
                declare incidents and manage notification read status.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-4">
              <StatCard
                title="Vehicles"
                value={loading ? "..." : vehicleCount}
                description="Available for consultation"
              />

              <StatCard
                title="Congested zones"
                value={loading ? "..." : congestedCount}
                description="High traffic areas"
              />

              <StatCard
                title="Incidents"
                value={loading ? "..." : incidentCount}
                description="Reported incidents"
              />

              <StatCard
                title="Unread notifications"
                value={loading ? "..." : unreadNotifications}
                description="Need attention"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-950">
                  Operator actions
                </h3>

                <div className="mt-5 grid gap-3">
                  <Link
                    href="/vehicles"
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    View vehicles and add GPS positions
                  </Link>

                  <Link
                    href="/traffic"
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    View traffic zones
                  </Link>

                  <Link
                    href="/incidents"
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    Declare an incident
                  </Link>

                  <Link
                    href="/notifications"
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    View notifications
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-amber-950">
                  Access restrictions
                </h3>

                <div className="mt-5 space-y-3 text-sm text-amber-800">
                  <p>OPERATOR cannot create vehicles.</p>
                  <p>OPERATOR cannot create or update traffic zones.</p>
                  <p>OPERATOR cannot update incident status.</p>
                  <p>OPERATOR cannot create notifications.</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}