import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchOrganogramLayout, saveOrganogramLayout } from "../services";

const LAYOUT_KEY = ["organogram", "layout"] as const;

export function useOrganogramLayout() {
  return useQuery({ queryKey: LAYOUT_KEY, queryFn: fetchOrganogramLayout });
}

export function useSaveLayout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: saveOrganogramLayout,
    onSuccess: () => qc.invalidateQueries({ queryKey: LAYOUT_KEY }),
  });
}
