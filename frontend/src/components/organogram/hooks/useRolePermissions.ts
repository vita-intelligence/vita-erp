import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setRolePermissions } from "../services";
import type { RolePermissionEntry } from "../types";

export function useSetRolePermissions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      roleId,
      permissions,
    }: {
      roleId: string;
      permissions: RolePermissionEntry[];
    }) => setRolePermissions(roleId, permissions),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["organogram", "role", vars.roleId] });
    },
  });
}
