"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { getUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role === "ADMIN") {
      router.replace("/dashboard/admin");
      return;
    }

    if (user.role === "OPERATOR") {
      router.replace("/dashboard/operator");
      return;
    }

    router.replace("/login");
  }, [router]);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Redirecting to your dashboard...
      </div>
    </ProtectedRoute>
  );
}