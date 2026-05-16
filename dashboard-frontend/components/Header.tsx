"use client";

import { getUser, logout } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type HeaderProps = {
  title: string;
  subtitle?: string;
};

export default function Header({ title, subtitle }: HeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; role: string } | null>(
    null
  );

  useEffect(() => {
    const currentUser = getUser();

    if (currentUser) {
      setUser({
        email: currentUser.email,
        role: currentUser.role,
      });
    }
  }, []);

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-6 py-5 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-slate-950">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="text-right">
            <p className="text-sm font-medium text-slate-900">{user.email}</p>
            <p className="text-xs uppercase tracking-widest text-slate-500">
              {user.role}
            </p>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Logout
        </button>
      </div>
    </header>
  );
}