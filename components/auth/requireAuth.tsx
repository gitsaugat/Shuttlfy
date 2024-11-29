//@ts-nocheck

import { AuthContext } from "@/contexts/authContext";
import { useRouter } from "expo-router";
import { useContext, useEffect } from "react";

export function RequireAuth({ children }) {
  const { isLoggedIn } = useContext(AuthContext);
  const router = useRouter();
  useEffect(() => {
    if (!isLoggedIn) {
      setTimeout(() => {
        router.replace("/login");
      }, 0);
    }
  }, [isLoggedIn]);

  return children;
}
