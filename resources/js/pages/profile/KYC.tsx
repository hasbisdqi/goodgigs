import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldCheck, UploadCloud, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import React from 'react';
import { userProfile, submitKyc } from '@/actions/App/Http/Controllers/DashboardController';

import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType);
export default function KYC({ user }: any) {
    const { data, setData, post, processing, errors } = useForm({
        full_name: user.name || '',
        nik: '',
        address: '',
        id_card: null as File | null,
        selfie: null as File | null,
    });

    const isVerified = user.kyc_status === 'verified';
    const isPending = user.kyc_status === 'pending';

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(submitKyc.url());
    };

    return (
        <div className="min-h-screen bg-surface-container-lowest text-on-surface pb-20">
            <Head title="Identity Verification | Goodgigs" />
            
            <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={userProfile.url()} className="w-10 h-10 rounded-full hover:bg-surface-variant flex items-center justify-center transition-colors">
                            <ArrowLeft size={20} className="text-on-surface" />
                        </Link>
                        <h1 className="text-xl font-bold">Identity Verification</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 pt-8">
                
                {isVerified && (
                    <div className="bg-secondary-container text-on-secondary-container p-6 rounded-2xl mb-8 flex items-start gap-4 border border-secondary/20 shadow-sm">
                        <CheckCircle2 className="text-secondary shrink-0 mt-1" />
                        <div>
                            <h3 className="text-lg font-bold mb-1">Your Identity is Verified</h3>
                            <p className="text-sm">Thank you for keeping our community safe. You have full access to all Goodgigs features.</p>
                        </div>
                    </div>
                )}

                {isPending && (
                    <div className="bg-surface-variant text-on-surface p-6 rounded-2xl mb-8 flex items-start gap-4 border border-outline-variant/50 shadow-sm">
                        <Info className="text-on-surface-variant shrink-0 mt-1" />
                        <div>
                            <h3 className="text-lg font-bold mb-1">Verification Pending</h3>
                            <p className="text-sm text-on-surface-variant">We are currently reviewing your documents. This usually takes 1-2 business days. We'll notify you once it's complete.</p>
                        </div>
                    </div>
                )}

                {!isVerified && !isPending && (
                    <>
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2 text-on-surface">
                                <ShieldCheck className="text-secondary" />
                                Why verify your identity?
                            </h2>
                            <p className="text-on-surface-variant text-base leading-relaxed">
                                Verification helps build trust in our community. It allows employers to hire with confidence and unlocks advanced features like direct payments and urgent gigs.
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-8">
                            
                            <div className="bg-surface p-6 rounded-2xl border border-outline-variant/30 space-y-6 shadow-sm">
                                <h3 className="text-lg font-bold border-b border-outline-variant/30 pb-4 text-on-surface">Personal Information</h3>
                                
                                <div className="space-y-2">
                                    <label htmlFor="full_name" className="text-sm font-medium text-on-surface">Legal Full Name (as per ID)</label>
                                    <input 
                                        id="full_name" 
                                        type="text" 
                                        value={data.full_name} 
                                        onChange={e => setData('full_name', e.target.value)} 
                                        className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface"
                                        required
                                    />
                                    {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="nik" className="text-sm font-medium text-on-surface">ID Number (NIK / SSN)</label>
                                    <input 
                                        id="nik" 
                                        type="text" 
                                        value={data.nik} 
                                        onChange={e => setData('nik', e.target.value)} 
                                        className={`w-full border rounded-xl px-4 py-3 bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface ${errors.nik ? 'border-red-500' : 'border-outline-variant'}`}
                                        required
                                    />
                                    {errors.nik && <p className="text-red-500 text-xs mt-1">{errors.nik}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="address" className="text-sm font-medium text-on-surface">Current Address</label>
                                    <textarea 
                                        id="address" 
                                        rows={3}
                                        value={data.address} 
                                        onChange={e => setData('address', e.target.value)} 
                                        className={`w-full border rounded-xl px-4 py-3 bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface resize-y ${errors.address ? 'border-red-500' : 'border-outline-variant'}`}
                                        required
                                    />
                                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                                </div>
                            </div>

                            <div className="bg-surface p-6 rounded-2xl border border-outline-variant/30 space-y-6 shadow-sm">
                                <h3 className="text-lg font-bold border-b border-outline-variant/30 pb-4 text-on-surface">Document Upload</h3>
                                
                                <div className="space-y-4">
                                    <label className="text-sm font-medium text-on-surface">ID Card (KTP / Driver's License)</label>
                                    <FilePond
                                        onupdatefiles={(fileItems) => {
                                            setData('id_card', fileItems.length > 0 ? fileItems[0].file as File : null);
                                        }}
                                        allowMultiple={false}
                                        maxFiles={1}
                                        acceptedFileTypes={['image/*']}
                                        name="id_card"
                                        labelIdle='Drag & Drop your ID card or <span class="filepond--label-action">Browse</span>'
                                    />
                                    {errors.id_card && <p className="text-red-500 text-xs mt-1">{errors.id_card}</p>}
                                </div>

                                <div className="space-y-4 pt-4 border-t border-outline-variant/20">
                                    <label className="text-sm font-medium text-on-surface">Selfie with ID</label>
                                    <FilePond
                                        onupdatefiles={(fileItems) => {
                                            setData('selfie', fileItems.length > 0 ? fileItems[0].file as File : null);
                                        }}
                                        allowMultiple={false}
                                        maxFiles={1}
                                        acceptedFileTypes={['image/*']}
                                        name="selfie"
                                        labelIdle='Drag & Drop your Selfie or <span class="filepond--label-action">Browse</span>'
                                    />
                                    {errors.selfie && <p className="text-red-500 text-xs mt-1">{errors.selfie}</p>}
                                </div>
                            </div>

                            <div className="bg-surface-variant/50 p-5 rounded-xl flex items-start gap-4 border border-outline-variant/30">
                                <AlertTriangle className="text-on-surface-variant shrink-0 mt-0.5" size={20} />
                                <p className="text-sm text-on-surface-variant leading-relaxed">
                                    Your data is securely encrypted and never shared with third parties. By submitting, you agree to our Terms of Service and Privacy Policy regarding identity verification.
                                </p>
                            </div>

                            <div className="flex justify-end gap-4 pb-10">
                                <Link href={userProfile.url()}>
                                    <Button type="button" variant="outline" className="rounded-full px-6 border-outline-variant text-on-surface">Cancel</Button>
                                </Link>
                                <Button type="submit" disabled={processing} className="rounded-full px-8 bg-primary text-on-primary hover:bg-primary/90 shadow-md">
                                    Submit for Verification
                                </Button>
                            </div>
                        </form>
                    </>
                )}
            </main>
        </div>
    );
}
