'use client';

import React, { useState } from 'react';
import { Button, Select, SelectItem } from '@heroui/react';
import { User, Mail, Shield, Trash2, Check, X } from 'lucide-react';
import { TeamMember, Role } from '@/lib/api/access';
import { useChangeMemberRole, useRemoveMember } from '@/hooks/api/useAccess';

interface TeamMemberCardProps {
    member: TeamMember;
    companyId: number;
    roles: Role[];
    canManage: boolean;
    currentUserId: number;
}

export default function TeamMemberCard({
    member,
    companyId,
    roles,
    canManage,
    currentUserId,
}: TeamMemberCardProps) {
    const [editingRole, setEditingRole] = useState(false);
    const [selectedRoleId, setSelectedRoleId] = useState<string>('');
    const [confirmRemove, setConfirmRemove] = useState(false);

    const changeRole = useChangeMemberRole(companyId);
    const removeMember = useRemoveMember(companyId);

    const currentRole = member.roles[0];
    const isOwner = currentRole?.is_system && currentRole?.name === 'Owner';
    const isCurrentUser = member.user_id === currentUserId;
    const canAct = canManage && !isOwner && !isCurrentUser;

    // Assignable roles — exclude Owner
    const assignableRoles = roles.filter(r => !(r.is_system && r.name === 'Owner'));

    const handleRoleChange = () => {
        if (!selectedRoleId) return;
        changeRole.mutate(
            { membershipId: member.id, roleId: Number(selectedRoleId) },
            {
                onSuccess: () => {
                    setEditingRole(false);
                    setSelectedRoleId('');
                },
            }
        );
    };

    const handleRemove = () => {
        removeMember.mutate(member.id, {
            onSuccess: () => setConfirmRemove(false),
        });
    };

    return (
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                {/* Left: User info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-11 h-11 bg-black flex items-center justify-center flex-shrink-0">
                        <User className="text-white" size={20} />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-bold text-black">{member.username}</span>
                            {isCurrentUser && (
                                <span className="text-xs font-bold px-2 py-0.5 bg-black text-white">You</span>
                            )}
                            {isOwner && (
                                <span className="text-xs font-bold px-2 py-0.5 border-2 border-black text-black">Owner</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                <Mail size={13} className="flex-shrink-0" />
                                <span className="truncate">{member.email}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                <Shield size={13} className="flex-shrink-0" />
                                <span>{currentRole?.name ?? 'No role'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Actions */}
                {canAct && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {!editingRole && !confirmRemove && (
                            <>
                                <Button
                                    size="sm"
                                    radius="none"
                                    onPress={() => setEditingRole(true)}
                                    className="bg-white text-black font-bold border-2 border-black hover:bg-gray-100 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                                >
                                    Change Role
                                </Button>
                                <Button
                                    size="sm"
                                    radius="none"
                                    isIconOnly
                                    onPress={() => setConfirmRemove(true)}
                                    className="bg-white text-red-600 border-2 border-red-600 hover:bg-red-50 transition-all shadow-[2px_2px_0px_0px_rgba(220,38,38,1)] hover:shadow-none"
                                >
                                    <Trash2 size={15} />
                                </Button>
                            </>
                        )}

                        {/* Role change inline */}
                        {editingRole && (
                            <div className="flex items-center gap-2">
                                <Select
                                    size="sm"
                                    radius="none"
                                    placeholder="Select role"
                                    selectedKeys={selectedRoleId ? [selectedRoleId] : []}
                                    onSelectionChange={(keys) => setSelectedRoleId(Array.from(keys)[0] as string)}
                                    className="w-36"
                                    classNames={{
                                        trigger: "border-2 border-black rounded-none h-9 min-h-9",
                                    }}
                                >
                                    {assignableRoles.map((role) => (
                                        <SelectItem key={role.id.toString()}>
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </Select>
                                <Button
                                    size="sm"
                                    radius="none"
                                    isIconOnly
                                    isLoading={changeRole.isPending}
                                    isDisabled={!selectedRoleId}
                                    onPress={handleRoleChange}
                                    className="bg-black text-white border-2 border-black"
                                >
                                    {!changeRole.isPending && <Check size={15} />}
                                </Button>
                                <Button
                                    size="sm"
                                    radius="none"
                                    isIconOnly
                                    isDisabled={changeRole.isPending}
                                    onPress={() => { setEditingRole(false); setSelectedRoleId(''); }}
                                    className="bg-white text-black border-2 border-black"
                                >
                                    <X size={15} />
                                </Button>
                            </div>
                        )}

                        {/* Remove confirmation inline */}
                        {confirmRemove && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-red-600">Remove?</span>
                                <Button
                                    size="sm"
                                    radius="none"
                                    isLoading={removeMember.isPending}
                                    onPress={handleRemove}
                                    className="bg-red-600 text-white font-bold border-2 border-red-600"
                                >
                                    Yes
                                </Button>
                                <Button
                                    size="sm"
                                    radius="none"
                                    isDisabled={removeMember.isPending}
                                    onPress={() => setConfirmRemove(false)}
                                    className="bg-white text-black font-bold border-2 border-black"
                                >
                                    No
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}