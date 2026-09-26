// api.ts (frontend)

function getCsrfToken(): string | undefined {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith('csrfToken='))
    ?.split('=')[1];
}

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  const res = await fetch('/api/refresh', {
    method: 'POST',
    credentials: 'include',
    headers: { 'X-CSRF-Token': getCsrfToken() ?? '' }, // refresh mutates state too — needs it
  });
  return res.ok;
}

const MUTATING_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const method = (options.method ?? 'GET').toUpperCase();

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> | undefined),
  };
  if (MUTATING_METHODS.includes(method)) {
    headers['X-CSRF-Token'] = getCsrfToken() ?? '';
  }

  const res = await fetch(url, { ...options, headers, credentials: 'include' });

  if (res.status === 401) {
    const body = await res.clone().json().catch(() => ({}));

    if (body.code === 'TOKEN_EXPIRED') {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshAccessToken().finally(() => { isRefreshing = false; });
      }
      const refreshed = await refreshPromise;

      if (refreshed) {
        // retry original request, with a fresh CSRF header too (cookie may have rotated)
        const retryHeaders: Record<string, string> = {
          ...(options.headers as Record<string, string> | undefined),
        };
        if (MUTATING_METHODS.includes(method)) {
          retryHeaders['X-CSRF-Token'] = getCsrfToken() ?? '';
        }
        return fetch(url, { ...options, headers: retryHeaders, credentials: 'include' });
      }
    }

    window.location.href = '/login';
  }

  if (res.status === 403) {
    const body = await res.clone().json().catch(() => ({}));
    if (body.error?.toLowerCase().includes('csrf')) {
      console.error('CSRF check failed — the request was blocked for the user\'s protection.');
      // Not retried automatically, unlike expired tokens — see explanation below.
    }
  }

  return res;
}

