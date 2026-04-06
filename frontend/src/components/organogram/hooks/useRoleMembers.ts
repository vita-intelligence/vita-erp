import { useMutation, useQueryClient } from "@tanstack/react-query";

import { assignMember, unassignMember } from "../services";

export function useAssignMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, userId }: { roleId: string; userId: string }) =>
      assignMember(roleId, userId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["organogram", "roles"] });
      qc.invalidateQueries({
        queryKey: ["organogram", "role", vars.roleId],
      });
    },
  });
}

export function useUnassignMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, userId }: { roleId: string; userId: string }) =>
      unassignMember(roleId, userId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["organogram", "roles"] });
      qc.invalidateQueries({
        queryKey: ["organogram", "role", vars.roleId],
      });
    },
  });
}
