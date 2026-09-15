"use client";

import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useAuthStore } from "@/store/authStore";
import { getUserById } from "@/actions/user";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const initializeUser = async (userId: string) => {
      const user = await getUserById(userId)
      setUser(user);
    };

    if (!isPending) {
      if (session?.user) {
        initializeUser(session.user.id);
      } else {
        setUser(null);
      }
    }
  }, [session, isPending]);

  return <>{children}</>;
}
