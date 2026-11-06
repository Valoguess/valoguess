"use client";

import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useAuthStore } from "@/store/authStore";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();

  const storeUser = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    if (!isPending) {
      const nextUser = session?.user
        ? { ...session.user, username: session.user.username ?? undefined }
        : null;

      if (storeUser?.id !== nextUser?.id) {
        setUser(nextUser);
      }
    }
  }, [session, isPending, storeUser]);
  return <>{children}</>;
}
