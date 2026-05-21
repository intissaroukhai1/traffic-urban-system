"use client";

import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import {
  CREATE_NOTIFICATION,
  GET_NOTIFICATIONS,
  MARK_NOTIFICATION_AS_READ,
} from "@/graphql/notifications";
import { getUser } from "@/lib/auth";
import { useMutation, useQuery } from "@apollo/client/react";
import { FormEvent, useEffect, useState } from "react";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

type NotificationsResponse = {
  notifications: NotificationItem[];
};

export default function NotificationsPage() {
  const { data, loading, error, refetch } =
    useQuery<NotificationsResponse>(GET_NOTIFICATIONS);

  const [createNotification, { loading: creating }] =
    useMutation(CREATE_NOTIFICATION);

  const [markNotificationAsRead, { loading: marking }] =
    useMutation(MARK_NOTIFICATION_AS_READ);

  const [role, setRole] = useState("");

  const [title, setTitle] = useState("");
  const [messageText, setMessageText] = useState("");

  const [notificationId, setNotificationId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const user = getUser();
    setRole(user?.role ?? "");
  }, []);

  const isAdmin = role === "ADMIN";

  async function handleCreateNotification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    try {
      await createNotification({
        variables: {
          title,
          message: messageText,
        },
      });

      setTitle("");
      setMessageText("");
      setMessage("Notification created successfully.");
      await refetch();
    } catch {
      setMessage("Unable to create notification. ADMIN role is required.");
    }
  }

  async function handleMarkAsRead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    try {
      await markNotificationAsRead({
        variables: {
          notificationId: Number(notificationId),
        },
      });

      setNotificationId("");
      setMessage("Notification marked as read.");
      await refetch();
    } catch {
      setMessage("Unable to mark notification as read.");
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />

        <main className="flex-1">
          <Header
            title="Notifications"
            subtitle="Create, consult and manage notifications"
          />

          <section className="space-y-6 p-6">
          <div className="grid gap-6 xl:grid-cols-2">
  {isAdmin ? (
    <form
      onSubmit={handleCreateNotification}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-slate-950">
        Create notification
      </h3>

      <div className="mt-5 grid gap-4">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Title"
          className="rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-950"
          required
        />

        <textarea
          value={messageText}
          onChange={(event) => setMessageText(event.target.value)}
          placeholder="Message"
          className="min-h-28 rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-950"
          required
        />

        <button
          disabled={creating}
          className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {creating ? "Creating..." : "Create notification"}
        </button>
      </div>
    </form>
  ) : (
    <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
      You are connected as OPERATOR. You can view notifications and mark them as read,
      but cannot create new notifications.
    </div>
  )}

  {!isAdmin ? (
    <form
      onSubmit={handleMarkAsRead}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-slate-950">
        Mark notification as read
      </h3>

      <div className="mt-5 grid gap-4">
        <input
          value={notificationId}
          onChange={(event) => setNotificationId(event.target.value)}
          type="number"
          placeholder="Notification ID"
          className="rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-950"
          required
        />

        <button
          disabled={marking}
          className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {marking ? "Updating..." : "Mark as read"}
        </button>
      </div>
    </form>
  ) : (
    <div className="rounded-3xl border border-blue-200 bg-blue-50 p-6 text-sm text-blue-800">
      ADMIN creates notifications. Operators can mark them as read after reading them.
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
                Notification list
              </h3>

              {loading && (
                <p className="mt-4 text-sm">Loading notifications...</p>
              )}

              {error && (
                <p className="mt-4 text-sm text-red-600">
                  Unable to load notifications.
                </p>
              )}

              {!loading && !error && (
                <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-100 text-slate-600">
                      <tr>
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">Title</th>
                        <th className="px-4 py-3">Message</th>
                        <th className="px-4 py-3">Read</th>
                      </tr>
                    </thead>

                    <tbody>
                      {data?.notifications?.map((notification) => (
                        <tr key={notification.id} className="border-t">
                          <td className="px-4 py-3">{notification.id}</td>
                          <td className="px-4 py-3 font-medium">
                            {notification.title}
                          </td>
                          <td className="px-4 py-3">
                            {notification.message}
                          </td>
                          <td className="px-4 py-3">
                            {notification.isRead ? "Yes" : "No"}
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