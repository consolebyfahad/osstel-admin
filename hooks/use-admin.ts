"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  approvePlanRequest,
  blockOwner,
  getHostel,
  getHostels,
  getOwner,
  getOwners,
  getPlanRequests,
  getStats,
  getSupportRequest,
  getSupportRequests,
  login as apiLogin,
  rejectPlanRequest,
  replySupportRequest,
  updateOwnerPlan,
  updateSupportRequestStatus,
} from "@/lib/api/admin";
import { showApiError, showApiSuccess } from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/auth-store";
import type {
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
    mutationFn: ({ userId, password }: { userId: string; password: string }) =>
      apiLogin(userId, password),
    onSuccess: (data) => {
      if (data.user.role !== "admin") {
        showApiError(new Error("Only admin users can access this panel"));
        return;
      }
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
