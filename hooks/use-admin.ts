"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  approvePlanRequest,
  blockOwner,
  cancelOwnerTrial,
  extendOwnerSubscription,
  getContactInquiry,
  getContactInquiries,
  getHostel,
  getHostels,
  getOwner,
  getOwners,
  grantOwnerTrial,
  getPlanRequests,
  getStats,
  getSupportRequest,
  getSupportRequests,
  login as apiLogin,
  rejectPlanRequest,
  replyContactInquiry,
  replySupportRequest,
  updateContactInquiryStatus,
  updateOwnerPlan,
  updateSupportRequestStatus,
} from "@/lib/api/admin";
import { showApiError, showApiSuccess } from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/auth-store";
import type {
  ContactInquiriesListParams,
  ContactInquiryStatus,
  HostelsListParams,
  OwnersListParams,
  PlanRequestsListParams,
  SubscriptionPlan,
  SupportRequestsListParams,
  SupportRequestStatus,
} from "@/lib/types";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: getStats,
  });
}

export function useOwners(params: OwnersListParams) {
  return useQuery({
    queryKey: ["owners", params],
    queryFn: () => getOwners(params),
  });
}

export function useOwner(id: string) {
  return useQuery({
    queryKey: ["owner", id],
    queryFn: () => getOwner(id),
    enabled: !!id,
  });
}

export function useBlockOwner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, blocked }: { id: string; blocked: boolean }) =>
      blockOwner(id, blocked),
    onSuccess: (data, variables) => {
      showApiSuccess(
        variables.blocked ? "Owner blocked successfully" : "Owner unblocked successfully"
      );
      queryClient.invalidateQueries({ queryKey: ["owners"] });
      queryClient.invalidateQueries({ queryKey: ["owner", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: showApiError,
  });
}

export function useUpdateOwnerPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, plan }: { id: string; plan: SubscriptionPlan }) =>
      updateOwnerPlan(id, plan),
    onSuccess: (_, variables) => {
      showApiSuccess("Owner plan updated successfully");
      queryClient.invalidateQueries({ queryKey: ["owners"] });
      queryClient.invalidateQueries({ queryKey: ["owner", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: showApiError,
  });
}

export function useGrantOwnerTrial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, days }: { id: string; days: 10 | 20 | 30 }) =>
      grantOwnerTrial(id, days),
    onSuccess: (_, variables) => {
      showApiSuccess(`Pro trial granted for ${variables.days} days`);
      queryClient.invalidateQueries({ queryKey: ["owners"] });
      queryClient.invalidateQueries({ queryKey: ["owner", variables.id] });
    },
    onError: showApiError,
  });
}

export function useCancelOwnerTrial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cancelOwnerTrial(id),
    onSuccess: (_, id) => {
      showApiSuccess("Trial cancelled");
      queryClient.invalidateQueries({ queryKey: ["owners"] });
      queryClient.invalidateQueries({ queryKey: ["owner", id] });
    },
    onError: showApiError,
  });
}

export function useExtendOwnerSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => extendOwnerSubscription(id),
    onSuccess: (_, id) => {
      showApiSuccess("Subscription extended by 1 month");
      queryClient.invalidateQueries({ queryKey: ["owners"] });
      queryClient.invalidateQueries({ queryKey: ["owner", id] });
    },
    onError: showApiError,
  });
}

export function useHostels(params: HostelsListParams) {
  return useQuery({
    queryKey: ["hostels", params],
    queryFn: () => getHostels(params),
  });
}

export function useHostel(id: string) {
  return useQuery({
    queryKey: ["hostel", id],
    queryFn: () => getHostel(id),
    enabled: !!id,
  });
}

export function usePlanRequests(params: PlanRequestsListParams) {
  return useQuery({
    queryKey: ["plan-requests", params],
    queryFn: () => getPlanRequests(params),
  });
}

export function useApprovePlanRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, adminNote }: { id: string; adminNote: string }) =>
      approvePlanRequest(id, adminNote),
    onSuccess: () => {
      showApiSuccess("Plan request approved");
      queryClient.invalidateQueries({ queryKey: ["plan-requests"] });
      queryClient.invalidateQueries({ queryKey: ["owners"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: showApiError,
  });
}

export function useRejectPlanRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, adminNote }: { id: string; adminNote: string }) =>
      rejectPlanRequest(id, adminNote),
    onSuccess: () => {
      showApiSuccess("Plan request rejected");
      queryClient.invalidateQueries({ queryKey: ["plan-requests"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: showApiError,
  });
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async ({ userId, password }: { userId: string; password: string }) => {
      const data = await apiLogin(userId, password);
      if (data.user.role !== "admin") {
        throw new Error("Only admin users can access this panel");
      }
      return data;
    },
    onSuccess: (data) => {
      setAuth(data.accessToken, data.refreshToken, data.user);
      showApiSuccess("Login successful");
    },
    onError: showApiError,
  });
}

export function useSupportRequests(params: SupportRequestsListParams) {
  return useQuery({
    queryKey: ["support-requests", params],
    queryFn: () => getSupportRequests(params),
  });
}

export function useSupportRequest(id: string) {
  return useQuery({
    queryKey: ["support-request", id],
    queryFn: () => getSupportRequest(id),
    enabled: !!id,
  });
}

export function useReplySupportRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, adminReply }: { id: string; adminReply: string }) =>
      replySupportRequest(id, adminReply),
    onSuccess: (_, variables) => {
      showApiSuccess("Reply sent successfully");
      queryClient.invalidateQueries({ queryKey: ["support-requests"] });
      queryClient.invalidateQueries({
        queryKey: ["support-request", variables.id],
      });
    },
    onError: showApiError,
  });
}

export function useUpdateSupportStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      adminReply,
      status,
    }: {
      id: string;
      adminReply?: string;
      status: SupportRequestStatus;
    }) => updateSupportRequestStatus(id, { adminReply, status }),
    onSuccess: (_, variables) => {
      showApiSuccess("Support request updated");
      queryClient.invalidateQueries({ queryKey: ["support-requests"] });
      queryClient.invalidateQueries({
        queryKey: ["support-request", variables.id],
      });
    },
    onError: showApiError,
  });
}

export function useContactInquiries(params: ContactInquiriesListParams) {
  return useQuery({
    queryKey: ["contact-inquiries", params],
    queryFn: () => getContactInquiries(params),
  });
}

export function useContactInquiry(id: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["contact-inquiry", id],
    queryFn: async () => {
      const result = await getContactInquiry(id);
      await queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      await queryClient.invalidateQueries({ queryKey: ["contact-inquiries"] });
      return result;
    },
    enabled: !!id,
  });
}

export function useReplyContactInquiry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, adminReply }: { id: string; adminReply: string }) =>
      replyContactInquiry(id, adminReply),
    onSuccess: (_, variables) => {
      showApiSuccess("Reply saved successfully");
      queryClient.invalidateQueries({ queryKey: ["contact-inquiries"] });
      queryClient.invalidateQueries({
        queryKey: ["contact-inquiry", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: showApiError,
  });
}

export function useUpdateContactInquiryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      adminReply,
      status,
    }: {
      id: string;
      adminReply?: string;
      status: ContactInquiryStatus;
    }) => updateContactInquiryStatus(id, { status }),
    onSuccess: (_, variables) => {
      showApiSuccess(
        variables.status === "closed"
          ? "Inquiry marked as handled"
          : "Inquiry updated"
      );
      queryClient.invalidateQueries({ queryKey: ["contact-inquiries"] });
      queryClient.invalidateQueries({
        queryKey: ["contact-inquiry", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: showApiError,
  });
}
