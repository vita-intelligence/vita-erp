import { useAcceptInvite, useDeclineInvite } from "@/hooks/api/useInvite";
import { Invite } from "@/lib/api/invite";
import { Button } from "@heroui/react";
import { Mail, Building2, Shield, Clock, CheckCheck, X, Inbox } from 'lucide-react';


// ============================================================================
// STATUS CHIP
// ============================================================================

function StatusChip({ status }: { status: Invite['status'] }) {
    const config = {
        pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
        accepted: { label: 'Accepted', className: 'bg-green-100 text-green-800 border-green-300' },
        declined: { label: 'Declined', className: 'bg-red-100 text-red-800 border-red-300' },
        expired: { label: 'Expired', className: 'bg-gray-100 text-gray-600 border-gray-300' },
        cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-600 border-gray-300' },
    };

    const { label, className } = config[status];

    return (
        <span className={`text-xs font-bold px-2 py-1 border-2 ${className}`}>
            {label}
        </span>
    );
}

// ============================================================================
// INVITE CARD
// ============================================================================

export function InviteCard({ invite }: { invite: Invite }) {
    const acceptInvite = useAcceptInvite();
    const declineInvite = useDeclineInvite();

    const isPending = invite.status === 'pending' && !invite.is_expired;
    const isActing = acceptInvite.isPending || declineInvite.isPending;

    const expiresAt = new Date(invite.expires_at);
    const daysLeft = Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    return (
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">

                {/* Left: Company + Info */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-black flex items-center justify-center flex-shrink-0">
                        <Building2 className="text-white" size={22} />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap mb-2">
                            <h3 className="text-lg font-bold text-black">
                                {invite.company_name}
                            </h3>
                            <StatusChip status={invite.is_expired ? 'expired' : invite.status} />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            {/* Invited by */}
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail size={14} className="flex-shrink-0" />
                                <span>Invited by <span className="font-semibold text-black">{invite.inviter_name}</span></span>
                            </div>

                            {/* Role */}
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Shield size={14} className="flex-shrink-0" />
                                <span>Role: <span className="font-semibold text-black">{invite.role_name}</span></span>
                            </div>

                            {/* Expiry */}
                            {isPending && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Clock size={14} className="flex-shrink-0" />
                                    <span>
                                        {daysLeft > 0
                                            ? `Expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`
                                            : 'Expires today'
                                        }
                                    </span>
                                </div>
                            )}

                            {/* Optional message */}
                            {invite.message && (
                                <p className="mt-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 px-3 py-2 italic">
                                    "{invite.message}"
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Actions */}
                {isPending && (
                    <div className="flex sm:flex-col gap-2 sm:flex-shrink-0">
                        <Button
                            size="sm"
                            radius="none"
                            isLoading={acceptInvite.isPending}
                            isDisabled={isActing}
                            onPress={() => acceptInvite.mutate(invite.id)}
                            startContent={!acceptInvite.isPending && <CheckCheck size={16} />}
                            className="flex-1 sm:flex-none bg-black text-white font-bold border-2 border-black hover:bg-white hover:text-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                        >
                            Accept
                        </Button>
                        <Button
                            size="sm"
                            radius="none"
                            isLoading={declineInvite.isPending}
                            isDisabled={isActing}
                            onPress={() => declineInvite.mutate(invite.id)}
                            startContent={!declineInvite.isPending && <X size={16} />}
                            className="flex-1 sm:flex-none bg-white text-black font-bold border-2 border-black hover:bg-gray-100 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                        >
                            Decline
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}