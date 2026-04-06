"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";

import {
  ComboBox,
  ComboBoxInput,
  ComboBoxInputGroup,
  ComboBoxListBox,
  ComboBoxPopover,
  ComboBoxTrigger,
} from "@/components/ui/combo-box";
import { ListBox } from "@/components/ui/select";

import { useAssignMember, useOrgMembers, useUnassignMember } from "../hooks";
import type { RoleMember } from "../types";

type Props = {
  roleId: string;
  members: RoleMember[];
  isDisabled: boolean;
};

/**
 * Displays assigned members with ability to add/remove.
 */
export default function MemberList({ roleId, members, isDisabled }: Props) {
  const t = useTranslations("organogram");
  const { data: orgMembers } = useOrgMembers();
  const assignMutation = useAssignMember();
  const unassignMutation = useUnassignMember();
  const [search, setSearch] = useState("");

  const assignedIds = useMemo(
    () => new Set(members.map((m) => m.user_id)),
    [members],
  );

  const availableMembers = useMemo(
    () =>
      (orgMembers ?? []).filter(
        (m) =>
          !assignedIds.has(m.user_id) &&
          m.email.toLowerCase().includes(search.toLowerCase()),
      ),
    [orgMembers, assignedIds, search],
  );

  const handleAssign = useCallback(
    (key: React.Key | null) => {
      if (!key) return;
      assignMutation.mutate({ roleId, userId: String(key) });
      setSearch("");
    },
    [roleId, assignMutation],
  );

  const handleUnassign = useCallback(
    (userId: string) => {
      unassignMutation.mutate({ roleId, userId });
    },
    [roleId, unassignMutation],
  );

  return (
    <div>
      {/* Assigned members */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {members.length === 0 && (
          <p
            style={{
              fontSize: 13,
              color: "var(--vita-text-muted)",
              padding: "8px 0",
            }}
          >
            {t("members.noMembers")}
          </p>
        )}
        {members.map((m) => (
          <div
            key={m.user_id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "6px 8px",
              borderRadius: 6,
              background: "var(--vita-background)",
              border: "1px solid var(--vita-border)",
            }}
          >
            <span
              style={{
                fontSize: 13,
                color: "var(--vita-text-primary)",
              }}
            >
              {m.email}
            </span>
            {!isDisabled && (
              <button
                type="button"
                onClick={() => handleUnassign(m.user_id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: 2,
                  border: "none",
                  background: "transparent",
                  color: "var(--vita-text-muted)",
                  cursor: "pointer",
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add member combobox */}
      {!isDisabled && (
        <div style={{ marginTop: 12 }}>
          <ComboBox
            onSelectionChange={handleAssign}
            selectedKey={null}
            aria-label={t("members.addMemberLabel")}
            allowsCustomValue={false}
            menuTrigger="focus"
            inputValue={search}
            onInputChange={setSearch}
          >
            <ComboBoxInputGroup>
              <ComboBoxInput
                placeholder={t("members.searchPlaceholder")}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  padding: "8px 12px",
                  fontSize: 13,
                  color: "var(--vita-text-primary)",
                }}
              />
              <ComboBoxTrigger />
            </ComboBoxInputGroup>
            <ComboBoxPopover>
              <ComboBoxListBox>
                {availableMembers.map((m) => (
                  <ListBox.Item
                    key={m.user_id}
                    id={m.user_id}
                    textValue={m.email}
                  >
                    {m.email}
                  </ListBox.Item>
                ))}
              </ComboBoxListBox>
            </ComboBoxPopover>
          </ComboBox>
        </div>
      )}
    </div>
  );
}
