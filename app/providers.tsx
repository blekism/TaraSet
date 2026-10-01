"use client";

import { useEffect } from "react";
import { ensureCsrfToken } from "@/services/auth.service";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    ensureCsrfToken();
  }, []);
  return <>{children}</>;
}
