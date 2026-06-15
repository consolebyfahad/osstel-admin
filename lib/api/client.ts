import { toast } from "sonner";
import { useAuthStore } from "@/lib/store/auth-store";
import type { ApiResponse } from "@/lib/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001/api/v1";

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

export async function apiClient<T>(
  path: string,
  options: RequestInit = {}
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
