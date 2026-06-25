import { toast } from "sonner";
import { useAuthStore } from "@/lib/store/auth-store";
import type { ApiResponse } from "@/lib/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const AUTH_PATHS_WITHOUT_REFRESH = new Set([
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/logout",
]);

export class ApiError extends Error {
  errors?: string[];

  constructor(message: string, errors?: string[]) {
    super(message);
    this.name = "ApiError";
    this.errors = errors;
  }
}

function handleUnauthorized() {
  useAuthStore.getState().logout();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

function shouldAttemptRefresh(path: string) {
  return !AUTH_PATHS_WITHOUT_REFRESH.has(path);
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const { refreshToken, user, updateTokens } = useAuthStore.getState();

    if (!refreshToken || !user) {
      return null;
    }

    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    let json: ApiResponse<{
      accessToken?: string;
      refreshToken?: string;
      token?: string;
    }>;

    try {
      json = await response.json();
    } catch {
      return null;
    }

    if (!response.ok || !json.success || !json.data) {
      return null;
    }

    const accessToken = json.data.accessToken ?? json.data.token ?? null;
    if (!accessToken) {
      return null;
    }

    updateTokens(accessToken, json.data.refreshToken ?? refreshToken);
    return accessToken;
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

export async function apiClient<T>(
  path: string,
  options: RequestInit = {},
  hasRetried = false,
): Promise<T> {
  const { accessToken } = useAuthStore.getState();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  let json: ApiResponse<T>;
  try {
    json = await response.json();
  } catch {
    throw new ApiError("Failed to parse server response");
  }

  if (response.status === 401) {
    if (!hasRetried && shouldAttemptRefresh(path)) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        return apiClient<T>(path, options, true);
      }
    }

    handleUnauthorized();
    throw new ApiError(json.message || "Unauthorized");
  }

  if (!json.success) {
    const message = json.message || "Request failed";
    throw new ApiError(message, json.errors);
  }

  return json.data;
}

export function showApiError(error: unknown) {
  if (error instanceof ApiError) {
    toast.error(error.message);
    if (error.errors?.length) {
      error.errors.forEach((e) => toast.error(e));
    }
  } else if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error("Something went wrong");
  }
}

export function showApiSuccess(message: string) {
  toast.success(message);
}
