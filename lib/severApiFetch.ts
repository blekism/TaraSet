import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function serverApiFetch(path: string, options: RequestInit = {}) {
  const cookieStore = await cookies();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });

  if (res.status === 401) {
    redirect("login");
  }

  if (!res.ok) {
    throw new Error(`Rewuest failed: $(res.status)`);
  }

  return res.json();
}
