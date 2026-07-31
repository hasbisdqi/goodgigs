import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Search, CheckCircle, Building2, Home, FileText, Info } from 'lucide-react';
import BottomNavLayout from '@/layouts/BottomNavLayout';

interface ProposalSuccessProps {
    proposal: {
        gig_title: string;
        company: string;
        bid_amount: number;
        duration: string;
        status: string;
    };
}

export default function ProposalSuccess({ proposal }: ProposalSuccessProps) {
    return (
        <BottomNavLayout>
        <div className="bg-background text-on-background font-body-md min-h-screen overflow-x-hidden">
            <Head title="GigConnect | Proposal Submitted" />

            {/* Top Navigation Bar */}
            <header className="bg-surface shadow-sm fixed top-0 w-full z-50 flex justify-between items-center px-container-padding-mobile h-16">
                <div className="flex items-center gap-stack-sm">
                    <span className="font-headline-md text-headline-md font-bold text-primary">GigConnect</span>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-primary hover:bg-surface-container transition-colors p-2 rounded-full active:scale-95 transition-transform">
                        <Search size={24} />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant">
                        <img 
                            className="w-full h-full object-cover" 
                            alt="User avatar" 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrI1RbyxfshKZFepPIKNkEVah8aLAD7R2lGKUt-StbkeRvLatPCFRhvBMq4O1jWMUZnNWxtFUsOMZBeyDfb_16YSyJ0dmh4bx-llPgh7DwLTuXtV1stNc5XKwOK7LPdzW_NjAz9nqZgWbzjIJ8M31uKjRalKOIUNFENGa-2JcvJ3qe0s7a8vDmGRUDHv4_sKAhegT1I9MOxTxzYKKR7wgXeHPcQn_dhZWkxSffeBNi6iN7mhqM3EopIQ" 
                        />
                    </div>
                </div>
            </header>

            {/* Main Content Canvas */}
            <main className="pt-24 pb-32 px-container-padding-mobile max-w-lg mx-auto">
                {/* Success Illustration & Header */}
                <section className="flex flex-col items-center text-center mb-stack-lg">
                    <div className="relative w-32 h-32 mb-stack-md animate-bounce">
                        {/* Abstract Celebration Graphic */}
                        <div className="absolute inset-0 bg-secondary-container rounded-full opacity-20 scale-125 blur-xl"></div>
                        <div className="relative w-full h-full rounded-full bg-secondary-container flex items-center justify-center shadow-[0_0_40px_rgba(108,248,187,0.3)]">
                            <CheckCircle className="text-on-secondary-container" size={64} />
                        </div>
                        {/* Particle Accents */}
                        <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-primary-container"></div>
                        <div className="absolute bottom-4 -left-4 w-3 h-3 rounded-full bg-secondary animate-pulse"></div>
                    </div>
                    <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-stack-sm font-bold">
                        Proposal Terkirim!
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant max-w-[320px]">
                        Proposal Anda untuk <span className="font-semibold text-on-surface">'{proposal.gig_title}'</span> di {proposal.company} telah berhasil dikirim. Kami akan memberi tahu Anda jika klien merespons.
                    </p>
                </section>

                {/* Summary Card */}
                <section className="bg-surface-container-lowest rounded-xl p-stack-md border border-outline-variant shadow-sm mb-stack-lg">
                    <h2 className="font-label-md text-label-md text-outline uppercase tracking-wider mb-stack-md">Ringkasan Proposal</h2>
                    
                    <div className="flex items-center gap-stack-md mb-stack-md">
                        <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                            <Building2 className="text-primary" size={24} />
                        </div>
                        <div>
                            <h3 className="font-label-md text-label-md text-on-surface">{proposal.gig_title}</h3>
                            <p className="text-label-sm font-label-sm text-on-surface-variant">{proposal.company}</p>
                        </div>
                    </div>

                    <div className="space-y-stack-sm border-t border-outline-variant pt-stack-md">
                        <div className="flex justify-between items-center">
                            <span className="text-label-md font-label-md text-on-surface-variant">Penawaran Anda</span>
                            <span className="text-label-md font-label-md text-primary">${proposal.bid_amount} / bln</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-label-md font-label-md text-on-surface-variant">Estimasi Durasi</span>
                            <span className="text-label-md font-label-md text-on-surface">{proposal.duration}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-label-md font-label-md text-on-surface-variant">Status</span>
                            <div className="flex items-center gap-1 bg-secondary-container px-2 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-on-secondary-container"></span>
                                <span className="text-[10px] font-bold text-on-secondary-container uppercase">{proposal.status}</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Action Buttons */}
                <div className="flex flex-col gap-stack-md">
                    <Link href="/worker/dashboard" className="w-full bg-secondary py-4 rounded-xl font-label-md text-label-md text-on-secondary shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2">
                        Kembali ke Beranda
                        <Home size={18} />
                    </Link>
                    <button className="w-full bg-surface-container-low py-4 rounded-xl font-label-md text-label-md text-primary hover:bg-surface-container transition-colors active:scale-95 transition-transform flex items-center justify-center gap-2">
                        <FileText size={18} />
                        Lihat Proposal Saya
                    </button>
                </div>

                {/* Next Step Insight */}
                <div className="mt-stack-lg p-stack-md bg-primary-fixed/30 rounded-xl flex gap-stack-sm items-start">
                    <Info className="text-primary-container shrink-0 mt-0.5" size={20} />
                    <div>
                        <h4 className="text-label-md font-label-md text-on-primary-fixed-variant">Tip untuk Anda</h4>
                        <p className="text-label-sm font-label-sm text-on-surface-variant mt-1">Lengkapi profil portofolio Anda untuk meningkatkan peluang diterima hingga 40%.</p>
                    </div>
                </div>
            </main>
        </div>
        </BottomNavLayout>
    );
}
