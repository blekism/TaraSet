import { apiFetch } from "@/backend/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function getCircles() {
  const res = await apiFetch(`${API_URL}/circles/getAllCircles`);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Request Failed");
  }

  const message = await res.json();

  return {
    status: res.status,
    data: message,
  };
}

export async function getACircle(circle_id: string) {
  const res = await apiFetch(`${API_URL}/circles/${circle_id}`);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Request Failed");
  }

  const message = await res.json();

  return {
    status: res.status,
    data: message,
  };
}

export async function getItinerary(circle_id: string) {
  const res = await apiFetch(`${API_URL}/circles/itinerary/${circle_id}`);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Request Failed");
  }

  const message = await res.json();

  return {
    status: res.status,
    data: message,
  };
}

export async function createCircle(circle_name: string) {
  const res = await apiFetch(`${API_URL}/circles/createCircle`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      circle_name: circle_name,
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Request Failed");
  }

  const message = await res.json();

  return {
    status: res.status,
    data: message.circle,
  };
}

export async function joinCircle(circle_code: string) {
  const res = await apiFetch(`${API_URL}/circles/joinCircle`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      circle_code: circle_code,
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Request Failed");
  }

  const message = await res.json();

  return {
    status: res.status,
    data: message.circle,
  };
}
