import { useDeleteRole } from "@/hooks/api/useAccess";
import { Role } from "@/lib/api/access";
import { Button } from "@heroui/react";
import { Lock, Pencil, Shield, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface RoleCardProps {
    role: Role;
    companyId: number;
    canEdit: boolean;
    canDelete: boolean;
}

export function RoleCard({ role, companyId, canEdit, canDelete }: RoleCardProps) {
    const router = useRouter();
    const deleteRole = useDeleteRole(companyId);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleDelete = () => {
        deleteRole.mutate(role.id, {
            onSuccess: () => setConfirmDelete(false),
        });
    };

    return (
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                {/* Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${role.is_system ? 'bg-gray-200' : 'bg-black'}`}>
                        {role.is_system
                            ? <Lock size={18} className="text-gray-500" />
                            : <Shield size={18} className="text-white" />
                        }
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <span className="font-bold text-black">{role.name}</span>
                            {role.is_system && (
                                <span className="text-xs font-bold px-2 py-0.5 border-2 border-gray-400 text-gray-500">
                                    System
                                </span>
                            )}
                        </div>
                        {role.description
                            ? <p className="text-sm text-gray-600 truncate">{role.description}</p>
                            : <p className="text-sm text-gray-400 italic">No description</p>
                        }
                    </div>
                </div>

                {/* Actions */}
                {!role.is_system && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {!confirmDelete ? (
                            <>
                                {canEdit && (
                                    <Button
                                        size="sm"
                                        radius="none"
                                        isIconOnly
                                        onPress={() => router.push(`/companies/${companyId}/team/roles/${role.id}/edit`)}
                                        className="bg-white text-black border-2 border-black hover:bg-gray-100 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                                    >
                                        <Pencil size={15} />
                                    </Button>
                                )}
                                {canDelete && (
                                    <Button
                                        size="sm"
                                        radius="none"
                                        isIconOnly
                                        onPress={() => setConfirmDelete(true)}
                                        className="bg-white text-red-600 border-2 border-red-600 hover:bg-red-50 transition-all shadow-[2px_2px_0px_0px_rgba(220,38,38,1)] hover:shadow-none"
                                    >
                                        <Trash2 size={15} />
                                    </Button>
                                )}
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-red-600">Delete?</span>
                                <Button
                                    size="sm"
                                    radius="none"
                                    isLoading={deleteRole.isPending}
                                    onPress={handleDelete}
                                    className="bg-red-600 text-white font-bold border-2 border-red-600"
                                >
                                    Yes
                                </Button>
                                <Button
                                    size="sm"
                                    radius="none"
                                    isDisabled={deleteRole.isPending}
                                    onPress={() => setConfirmDelete(false)}
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