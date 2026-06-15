import { apiClient } from "./client";
import type {
  DashboardStats,
  HostelDetail,
  HostelListItem,
  HostelsListParams,
  LoginResponse,
  OwnerDetail,
  OwnerListItem,
  OwnersListParams,
  Pagination,
  PlanRequest,
  PlanRequestsListParams,
  SubscriptionPlan,
  SupportRequest,
  SupportRequestsListParams,
  UpdateSupportStatusPayload,
} from "@/lib/types";

export async function login(phone: string, password: string) {
  return apiClient<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ phone, password }),
  });
}

export async function getStats() {
  const data = await apiClient<DashboardStats | { stats: DashboardStats }>(
    "/admin/stats"
  );

  const raw =
    typeof data === "object" && data !== null && "stats" in data && data.stats
      ? data.stats
      : (data as DashboardStats);

  return {
    totalOwners: raw.totalOwners ?? 0,
    blockedOwners: raw.blockedOwners ?? 0,
    totalHostels: raw.totalHostels ?? 0,
    pendingPlanRequests: raw.pendingPlanRequests ?? 0,
    standardOwners: raw.standardOwners ?? 0,
    premiumOwners: raw.premiumOwners ?? 0,
  };
}

export async function getOwners(params: OwnersListParams = {}) {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.status && params.status !== "all")
    searchParams.set("status", params.status);
  if (params.plan && params.plan !== "all")
    searchParams.set("plan", params.plan);
  if (params.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  return apiClient<{ owners: OwnerListItem[]; pagination: Pagination }>(
    `/admin/owners${query ? `?${query}` : ""}`
  );
}

export async function getOwner(id: string) {
  return apiClient<{ owner: OwnerDetail }>(`/admin/owners/${id}`);
}

export async function blockOwner(id: string, blocked: boolean) {
  return apiClient<{ owner: OwnerDetail }>(`/admin/owners/${id}/block`, {
    method: "PATCH",
    body: JSON.stringify({ blocked }),
  });
}

export async function updateOwnerPlan(id: string, plan: SubscriptionPlan) {
  return apiClient<{ owner: OwnerDetail }>(`/admin/owners/${id}/plan`, {
    method: "PATCH",
    body: JSON.stringify({ plan }),
  });
}

export async function getHostels(params: HostelsListParams = {}) {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  return apiClient<{ hostels: HostelListItem[]; pagination: Pagination }>(
    `/admin/hostels${query ? `?${query}` : ""}`
  );
}

export async function getHostel(id: string) {
  return apiClient<{ hostel: HostelDetail }>(`/admin/hostels/${id}`);
}

export async function getPlanRequests(params: PlanRequestsListParams = {}) {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.status && params.status !== "all")
    searchParams.set("status", params.status);

  const query = searchParams.toString();
  return apiClient<{ requests: PlanRequest[]; pagination: Pagination }>(
    `/admin/plan-requests${query ? `?${query}` : ""}`
  );
}

export async function approvePlanRequest(id: string, adminNote: string) {
  return apiClient<{ request: PlanRequest }>(
    `/admin/plan-requests/${id}/approve`,
    {
      method: "PATCH",
      body: JSON.stringify({ adminNote }),
    }
  );
}

export async function rejectPlanRequest(id: string, adminNote: string) {
  return apiClient<{ request: PlanRequest }>(
    `/admin/plan-requests/${id}/reject`,
    {
      method: "PATCH",
      body: JSON.stringify({ adminNote }),
    }
  );
}

export async function getSupportRequests(params: SupportRequestsListParams = {}) {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.status && params.status !== "all")
    searchParams.set("status", params.status);
  if (params.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  const data = await apiClient<
    | { requests: SupportRequest[]; pagination: Pagination }
    | { supportRequests: SupportRequest[]; pagination: Pagination }
    | { support: SupportRequest[]; pagination?: Pagination }
  >(`/support${query ? `?${query}` : ""}`);

  const requests =
    "requests" in data && data.requests
      ? data.requests
      : "supportRequests" in data && data.supportRequests
        ? data.supportRequests
        : "support" in data && Array.isArray(data.support)
          ? data.support
          : [];

  const pagination =
    "pagination" in data && data.pagination
      ? data.pagination
      : {
          total: requests.length,
          page: params.page ?? 1,
          limit: params.limit ?? 20,
          pages: 1,
        };

  return { requests, pagination };
}

export async function getSupportRequest(id: string) {
  const data = await apiClient<
    | { request: SupportRequest }
    | { supportRequest: SupportRequest }
    | SupportRequest
  >(`/support-requests/${id}`);

  if (typeof data === "object" && data !== null && "request" in data) {
    return { request: data.request };
  }
  if (typeof data === "object" && data !== null && "supportRequest" in data) {
    return { request: data.supportRequest };
  }
  return { request: data as SupportRequest };
}

export async function replySupportRequest(id: string, adminReply: string) {
  return apiClient<{ request: SupportRequest }>(
    `/support-requests/${id}/reply`,
    {
      method: "PATCH",
      body: JSON.stringify({ adminReply }),
    }
  );
}

export async function updateSupportRequestStatus(
  id: string,
  payload: UpdateSupportStatusPayload
) {
  return apiClient<{ request: SupportRequest }>(
    `/support-requests/${id}/status`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );
}
