import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createRole,
  deleteRole,
  fetchRoleDetail,
  fetchRoles,
  updateRole,
} from "../services";

const ROLES_KEY = ["organogram", "roles"] as const;
const roleDetailKey = (id: string) => ["organogram", "role", id] as const;

export function useRoles() {
  return useQuery({ queryKey: ROLES_KEY, queryFn: fetchRoles });
}

export function useRoleDetail(id: string | null) {
  return useQuery({
    queryKey: roleDetailKey(id ?? ""),
    queryFn: () => fetchRoleDetail(id as string),
    enabled: !!id,
  });
}

export function useCreateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createRole,
    onSuccess: () => qc.invalidateQueries({ queryKey: ROLES_KEY }),
  });
}

export function useUpdateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: {
      id: string;
      name?: string;
      description?: string;
    }) => updateRole(id, payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ROLES_KEY });
      qc.invalidateQueries({ queryKey: roleDetailKey(vars.id) });
    },
  });
}

export function useDeleteRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteRole,
    onSuccess: () => qc.invalidateQueries({ queryKey: ROLES_KEY }),
  });
}
