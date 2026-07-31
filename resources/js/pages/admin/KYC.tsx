import { Head, router } from '@inertiajs/react';
import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { kycVerify } from '@/actions/App/Http/Controllers/AdminController';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export default function KYC({ users }: any) {
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [processing, setProcessing] = useState(false);

    const handleVerify = (userId: number, status: 'verified' | 'rejected') => {
        setProcessing(true);
        router.post(kycVerify.url({ user: userId }), { status }, {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedUser(null);
                setProcessing(false);
            },
            onError: () => setProcessing(false),
            onFinish: () => setProcessing(false)
        });
    };

    return (
        <AdminLayout>
            <Head title="KYC Verification | Goodgigs Admin" />
            
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">KYC Verification Queue</h1>
                <p className="text-on-surface-variant">Review and approve pending identity verifications.</p>
            </div>

            <div className="bg-surface rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-variant/50 border-b border-outline-variant/30">
                                <th className="p-4 font-semibold text-sm">User</th>
                                <th className="p-4 font-semibold text-sm">Email</th>
                                <th className="p-4 font-semibold text-sm">Submitted</th>
                                <th className="p-4 font-semibold text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-on-surface-variant">
                                        No pending KYC verifications.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user: any) => (
                                    <tr key={user.id} className="border-b border-outline-variant/20 hover:bg-surface-variant/20 transition-colors">
                                        <td className="p-4 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden">
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-on-surface-variant">
                                                        {user.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-xs text-on-surface-variant">ID: #{user.id}</p>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-on-surface-variant">{user.email}</td>
                                        <td className="p-4 text-sm text-on-surface-variant">
                                            {new Date(user.updated_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => setSelectedUser(user)}
                                            >
                                                Review Details
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Review KYC: {selectedUser?.name}</DialogTitle>
                    </DialogHeader>
                    
                    {selectedUser && (
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-3 gap-2 text-sm">
                                <div className="font-semibold text-on-surface-variant">Full Name</div>
                                <div className="col-span-2">{selectedUser.name}</div>
                                
                                <div className="font-semibold text-on-surface-variant">Legal Name</div>
                                <div className="col-span-2">{selectedUser.legal_name || 'N/A'}</div>

                                <div className="font-semibold text-on-surface-variant">NIK (KTP)</div>
                                <div className="col-span-2">{selectedUser.nik || 'N/A'}</div>

                                <div className="font-semibold text-on-surface-variant">Email</div>
                                <div className="col-span-2">{selectedUser.email}</div>
                                
                                <div className="font-semibold text-on-surface-variant">Submitted</div>
                                <div className="col-span-2">{new Date(selectedUser.updated_at).toLocaleString()}</div>
                            </div>
                                
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-sm text-on-surface-variant">ID Card</h4>
                                    <div className="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/30 h-48 flex items-center justify-center">
                                        {selectedUser.kyc_id_path ? (
                                            <a href={`/admin/kyc/${selectedUser.id}/document/id`} target="_blank" rel="noreferrer">
                                                <img src={`/admin/kyc/${selectedUser.id}/document/id`} alt="ID Card" className="w-full h-full object-contain hover:scale-105 transition-transform" />
                                            </a>
                                        ) : (
                                            <span className="text-sm text-on-surface-variant">No ID uploaded</span>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-sm text-on-surface-variant">Selfie with ID</h4>
                                    <div className="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/30 h-48 flex items-center justify-center">
                                        {selectedUser.kyc_selfie_path ? (
                                            <a href={`/admin/kyc/${selectedUser.id}/document/selfie`} target="_blank" rel="noreferrer">
                                                <img src={`/admin/kyc/${selectedUser.id}/document/selfie`} alt="Selfie" className="w-full h-full object-contain hover:scale-105 transition-transform" />
                                            </a>
                                        ) : (
                                            <span className="text-sm text-on-surface-variant">No selfie uploaded</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <DialogFooter className="flex justify-end gap-2 mt-4 sm:space-x-0">
                        <Button 
                            variant="outline" 
                            disabled={processing}
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleVerify(selectedUser.id, 'rejected')}
                        >
                            Reject
                        </Button>
                        <Button 
                            disabled={processing}
                            className="bg-green-600 text-white hover:bg-green-700"
                            onClick={() => handleVerify(selectedUser.id, 'verified')}
                        >
                            Approve
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </AdminLayout>
    );
}
