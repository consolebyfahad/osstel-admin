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
  ContactInquiry,
  ContactInquiriesListParams,
  ContactInquiryStatus,
  UpdateContactInquiryStatusPayload,
  UpdateSupportStatusPayload,
} from "@/lib/types";

export async function login(userId: string, password: string) {
  return apiClient<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ userId, password }),
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
    openSupportRequests: raw.openSupportRequests ?? 0,
    newContactInquiries: raw.newContactInquiries ?? 0,
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
  const data = await apiClient<
    | { owners: OwnerListItem[]; pagination: Pagination }
    | { data: { owners: OwnerListItem[]; pagination: Pagination } }
  >(`/admin/owners${query ? `?${query}` : ""}`);

  if (
    typeof data === "object" &&
    data !== null &&
    "data" in data &&
    data.data?.owners
  ) {
    return data.data;
  }

  return data as { owners: OwnerListItem[]; pagination: Pagination };
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

export async function grantOwnerTrial(id: string, days: 10 | 20 | 30) {
  return apiClient<{ owner: OwnerDetail }>(`/admin/owners/${id}/trial`, {
    method: "POST",
    body: JSON.stringify({ days }),
  });
}

export async function cancelOwnerTrial(id: string) {
  return apiClient<{ owner: OwnerDetail }>(`/admin/owners/${id}/trial`, {
    method: "DELETE",
  });
}

export async function extendOwnerSubscription(id: string) {
  return apiClient<{ owner: OwnerDetail }>(
    `/admin/owners/${id}/extend-subscription`,
    {
      method: "POST",
    }
  );
}

export async function getHostels(params: HostelsListParams = {}) {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  const data = await apiClient<
    | { hostels: HostelListItem[]; pagination: Pagination }
    | { data: { hostels: HostelListItem[]; pagination: Pagination } }
  >(`/admin/hostels${query ? `?${query}` : ""}`);

  if (
    typeof data === "object" &&
    data !== null &&
    "data" in data &&
    data.data?.hostels
  ) {
    return data.data;
  }

  return data as { hostels: HostelListItem[]; pagination: Pagination };
}

type HostelDetailResponse = HostelDetail & {
  stats?: {
    totalRooms: number;
    totalTenants: number;
    totalCapacity: number;
  };
};

export async function getHostel(id: string) {
  const data = await apiClient<{ hostel: HostelDetailResponse }>(
    `/admin/hostels/${id}`
  );

  const { stats, ...hostel } = data.hostel;

  return {
    hostel: {
      ...hostel,
      totalRooms: hostel.totalRooms ?? stats?.totalRooms ?? 0,
      totalTenants: hostel.totalTenants ?? stats?.totalTenants ?? 0,
      totalCapacity: hostel.totalCapacity ?? stats?.totalCapacity ?? 0,
    },
  };
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
  return apiClient<{ requests: SupportRequest[]; pagination: Pagination }>(
    `/admin/support-requests${query ? `?${query}` : ""}`
  );
}

export async function getSupportRequest(id: string) {
  const data = await apiClient<
    | { request: SupportRequest }
    | { supportRequest: SupportRequest }
    | SupportRequest
  >(`/admin/support-requests/${id}`);

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
    `/admin/support-requests/${id}/reply`,
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
    `/admin/support-requests/${id}/status`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );
}

export async function getContactInquiries(
  params: ContactInquiriesListParams = {}
) {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.status && params.status !== "all")
    searchParams.set("status", params.status);
  if (params.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  return apiClient<{ inquiries: ContactInquiry[]; pagination: Pagination }>(
    `/admin/contact-inquiries${query ? `?${query}` : ""}`
  );
}

export async function getContactInquiry(id: string) {
  const data = await apiClient<
    | { inquiry: ContactInquiry }
    | { contactInquiry: ContactInquiry }
    | ContactInquiry
  >(`/admin/contact-inquiries/${id}`);

  if (typeof data === "object" && data !== null && "inquiry" in data) {
    return { inquiry: data.inquiry };
  }
  if (
    typeof data === "object" &&
    data !== null &&
    "contactInquiry" in data
  ) {
    return { inquiry: data.contactInquiry };
  }
  return { inquiry: data as ContactInquiry };
}

export async function replyContactInquiry(id: string, adminReply: string) {
  return apiClient<{ inquiry: ContactInquiry }>(
    `/admin/contact-inquiries/${id}/reply`,
    {
      method: "PATCH",
      body: JSON.stringify({ adminReply }),
    }
  );
}

export async function updateContactInquiryStatus(
  id: string,
  payload: UpdateContactInquiryStatusPayload
) {
  return apiClient<{ inquiry: ContactInquiry }>(
    `/admin/contact-inquiries/${id}/status`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );
}
