"use client";

import { useEffect } from "react";
import { ensureCsrfToken } from "@/lib/auth";

export function Providers({children}: {children: React.ReactNode}){
    useEffect(() => {
        ensureCsrfToken();
    }, []);
    return <>{children}</>;
}

