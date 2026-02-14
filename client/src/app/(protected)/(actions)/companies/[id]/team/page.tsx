'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button, Pagination, Skeleton } from '@heroui/react';
import { UserPlus, Users } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useTeamMembers, useMyPermissions, useCompanyRoles } from '@/hooks/api/useAccess';
import { useCurrentUser } from '@/hooks/api/useAuth';
import TeamMemberCard from '@/components/pages/companies/team/TeamMemberCard';

export default function TeamPage() {
    const params = useParams();
    const router = useRouter();
    const companyId = Number(params.id);

    const [page, setPage] = useState(1);

    const { data: teamData, isLoading: teamLoading } = useTeamMembers(companyId, page);
    const { can } = useMyPermissions(companyId);
    const { data: roles, isLoading: rolesLoading } = useCompanyRoles(companyId);
    const { data: currentUser } = useCurrentUser();

    const headerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const header = headerRef.current;
        const list = listRef.current;
        if (!header || !list) return;

        gsap.set([header, list], { opacity: 0, y: 20 });
        gsap.timeline()
            .to(header, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' })
            .to(list, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3');
    }, []);

    const totalPages = teamData ? Math.ceil(teamData.count / 20) : 1;
    const currentUserId = currentUser?.id;

    return (
        <div className="space-y-6">

            {/* Header */}
            <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-black mb-2">Team</h1>
                    {teamLoading ? (
                        <Skeleton className="h-5 w-28 rounded-none" />
                    ) : (
                        <p className="text-gray-600">
                            {teamData?.count ?? 0} {teamData?.count === 1 ? 'member' : 'members'}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {can('roles.view') && (
                        <Button
                            radius="none"
                            onPress={() => router.push(`/companies/${companyId}/team/roles`)}
                            className="bg-white text-black font-bold border-2 border-black hover:bg-gray-100 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                        >
                            Roles
                        </Button>
                    )}
                    {can('members.invite') && (
                        <Button
                            radius="none"
                            onPress={() => router.push(`/companies/${companyId}/team/add-member`)}
                            startContent={<UserPlus size={18} />}
                            className="bg-black text-white font-bold border-2 border-black hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                        >
                            Invite Member
                        </Button>
                    )}
                </div>
            </div>

            {/* List */}
            <div ref={listRef} className="space-y-3">
                {teamLoading || rolesLoading ? (
                    [1, 2, 3].map((i) => (
                        <div key={i} className="bg-white border-2 border-black p-5">
                            <div className="flex items-center gap-4">
                                <Skeleton className="w-11 h-11 rounded-none flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-1/4 rounded-none" />
                                    <Skeleton className="h-3 w-1/3 rounded-none" />
                                    <Skeleton className="h-3 w-1/5 rounded-none" />
                                </div>
                            </div>
                        </div>
                    ))
                ) : teamData && teamData.results.length > 0 ? (
                    <>
                        {teamData.results.map((member) => (
                            <TeamMemberCard
                                key={member.id}
                                member={member}
                                companyId={companyId}
                                roles={roles ?? []}
                                canManage={can('roles.assign')}
                                currentUserId={currentUserId ?? -1}
                            />
                        ))}

                        {totalPages > 1 && (
                            <div className="flex justify-center pt-4">
                                <Pagination
                                    total={totalPages}
                                    page={page}
                                    onChange={setPage}
                                    radius="none"
                                    showControls
                                    classNames={{
                                        cursor: "bg-black text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                                        item: "border-2 border-black bg-white hover:bg-gray-100",
                                    }}
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="bg-white border-2 border-black p-12 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <div className="w-16 h-16 bg-gray-100 border-2 border-black mx-auto mb-4 flex items-center justify-center">
                            <Users className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-black mb-2">No members yet</h3>
                        <p className="text-gray-600 mb-6">Invite people to start building your team</p>
                        {can('members.invite') && (
                            <Button
                                radius="none"
                                onPress={() => router.push(`/companies/${companyId}/team/add-member`)}
                                startContent={<UserPlus size={16} />}
                                className="bg-black text-white font-bold border-2 border-black hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                            >
                                Invite Member
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}