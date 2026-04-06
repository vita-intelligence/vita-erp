import { useQuery } from "@tanstack/react-query";

import { fetchOrgMembers } from "../services";

const ORG_MEMBERS_KEY = ["organogram", "orgMembers"] as const;

export function useOrgMembers() {
  return useQuery({ queryKey: ORG_MEMBERS_KEY, queryFn: fetchOrgMembers });
}
