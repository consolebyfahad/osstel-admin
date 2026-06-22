export type OwnerStatus = "active" | "blocked";
export type HostelStatus = "active" | "vacant";
export type SubscriptionPlan = "free" | "standard" | "premium";
export type PlanRequestStatus = "pending" | "approved" | "rejected";
export type RoomStatus = "occupied" | "vacant" | "active";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface AdminUser {
  id: string;
  name: string;
  phone: string;
  userId?: string | null;
  role: string;
  avatarUrl?: string | null;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AdminUser;
}

export interface DashboardStats {
  totalOwners: number;
  blockedOwners: number;
  totalHostels: number;
  pendingPlanRequests: number;
  newContactInquiries?: number;
  standardOwners: number;
  premiumOwners: number;
}

export interface OwnerHostelSummary {
  id: string;
  name: string;
  city: string;
  address: string;
  roomsCount: number;
  tenantsCount: number;
  status: HostelStatus;
}

export interface OwnerListItem {
  id: string;
  name: string;
  phone: string;
  status: OwnerStatus;
  subscriptionPlan: SubscriptionPlan;
  hostelsCount: number;
  hostels: OwnerHostelSummary[];
  createdAt: string;
}

export interface PendingPlanRequest {
  id: string;
  currentPlan: SubscriptionPlan;
  requestedPlan: SubscriptionPlan;
  note?: string;
  status: PlanRequestStatus;
  createdAt: string;
}

export interface OwnerDetail {
  id: string;
  name: string;
  phone: string;
  status: OwnerStatus;
  subscriptionPlan: SubscriptionPlan;
  hostelsCount: number;
  hostels: OwnerHostelSummary[];
  createdAt: string;
  pendingPlanRequest?: PendingPlanRequest | null;
}

export interface HostelOwnerInfo {
  id: string;
  name: string;
  phone: string;
  status: OwnerStatus;
  subscriptionPlan: SubscriptionPlan;
}

export interface HostelListItem {
  id: string;
  name: string;
  city: string;
  address: string;
  roomsCount: number;
  tenantsCount: number;
  status: HostelStatus;
  owner: HostelOwnerInfo;
}

export interface Room {
  id: string;
  roomNumber: string;
  capacity: number;
  rent: number;
  status: RoomStatus;
}

export interface Tenant {
  id: string;
  name: string;
  phone: string;
  cnic: string;
  roomNumber: string;
  checkInDate: string;
}

export interface HostelDetail {
  id: string;
  name: string;
  address: string;
  city: string;
  contactPhone: string;
  status: HostelStatus;
  owner: HostelOwnerInfo;
  totalRooms: number;
  totalTenants: number;
  totalCapacity: number;
  rooms: Room[];
  tenants: Tenant[];
}

export interface PlanRequest {
  id: string;
  owner: {
    id: string;
    name: string;
    phone: string;
    subscriptionPlan: SubscriptionPlan;
  };
  currentPlan: SubscriptionPlan;
  requestedPlan: SubscriptionPlan;
  note?: string;
  adminNote?: string;
  status: PlanRequestStatus;
  createdAt: string;
}

export interface OwnersListParams {
  page?: number;
  limit?: number;
  status?: OwnerStatus | "all";
  plan?: SubscriptionPlan | "all";
  search?: string;
}

export interface HostelsListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PlanRequestsListParams {
  page?: number;
  limit?: number;
  status?: PlanRequestStatus | "all";
}

export type SupportRequestStatus =
  | "open"
  | "pending"
  | "in_progress"
  | "resolved"
  | "closed";

export interface SupportRequestUser {
  id: string;
  name: string;
  phone: string;
}

export interface SupportRequest {
  id: string;
  subject?: string;
  message: string;
  status: SupportRequestStatus;
  adminReply?: string | null;
  user?: SupportRequestUser;
  owner?: SupportRequestUser;
  createdAt: string;
  updatedAt?: string;
}

export interface SupportRequestsListParams {
  page?: number;
  limit?: number;
  status?: SupportRequestStatus | "all";
  search?: string;
}

export interface UpdateSupportStatusPayload {
  adminReply?: string;
  status: SupportRequestStatus;
}

export type ContactInquiryStatus =
  | "new"
  | "in_progress"
  | "replied"
  | "closed";

export interface ContactInquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  source: "website";
  status: ContactInquiryStatus;
  adminReply?: string | null;
  repliedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface ContactInquiriesListParams {
  page?: number;
  limit?: number;
  status?: ContactInquiryStatus | "all";
  search?: string;
}

export interface UpdateContactInquiryStatusPayload {
  adminReply?: string;
  status: ContactInquiryStatus;
}

export interface AdminProfileFormData {
  name: string;
  avatarUrl: string | null;
}
