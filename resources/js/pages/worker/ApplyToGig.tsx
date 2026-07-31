import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Upload, FileText, X, Send } from 'lucide-react';
import BottomNavLayout from '@/layouts/BottomNavLayout';

interface ApplyToGigProps {
    gig: {
        id: number;
        title: string;
        company: string;
        rate: number;
        company_logo: string;
    };
}

export default function ApplyToGig({ gig }: ApplyToGigProps) {
    const [rate, setRate] = useState<number>(gig.rate);
    const platformFee = 0.10; // 10% fee
    const estimatedReceived = rate * (1 - platformFee);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/gigs/${gig.id}/apply`);
    };

    return (
        <BottomNavLayout>
        <div className="bg-background text-on-background font-body-md min-h-screen">
            <Head title="Goodgigs | Submit Proposal" />

            {/* Top AppBar */}
            <header className="fixed top-0 left-0 w-full h-16 bg-surface shadow-sm flex justify-between items-center px-container-padding-mobile z-50">
                <div className="flex items-center gap-4">
                    <Link href="/worker/dashboard" className="active:scale-95 transition-transform p-2 hover:bg-surface-container rounded-full">
                        <ArrowLeft className="text-primary" size={24} />
                    </Link>
                    <h1 className="font-headline-md text-headline-md font-bold text-primary">Submit Proposal</h1>
                </div>
                <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high border-2 border-primary-fixed">
                    <img 
                        className="w-full h-full object-cover" 
                        alt="User Avatar" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiogl3FnDMIILuEDPGtHkRDiYXwXb2AjYGwGX8dM2GXukPcJ5AJSnkyhIk-CGgu_2-WDjGbV-jtOCdS_Cj1k7hQP2PIhxueSHNOp5ZBcfer9ICgdxbPgKNFOkjSTw8PNwfrynh1oPh1scmUMnVtvjgs7FTVg2UTLjGT_HKg3o7Y5J4mNPao2jikQW5bXK-X2p2o7RcbA0f7qkKMTkleGmlKciJrh0AwlhkCfMx1MfO4H4q0pvWv4CCkg" 
                    />
                </div>
            </header>

            <main className="max-w-[768px] mx-auto px-4 pt-20 pb-32">
                {/* Job Summary Card */}
                <section className="mt-stack-md">
                    <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm flex items-center gap-stack-md animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-surface-container shrink-0">
                            <img className="w-full h-full object-cover" alt="Company Logo" src={gig.company_logo} />
                        </div>
                        <div className="grow">
                            <h2 className="font-headline-md text-headline-md text-on-surface">{gig.title}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-on-surface-variant font-label-md">{gig.company}</span>
                                <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                                <span className="text-primary font-bold">${gig.rate}/hr</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Form Sections */}
                <form onSubmit={handleSubmit} className="mt-stack-lg flex flex-col gap-stack-lg">
                    
                    {/* Cover Letter */}
                    <div className="flex flex-col gap-stack-sm">
                        <label className="font-label-md text-on-surface-variant px-1" htmlFor="cover_letter">Cover Letter</label>
                        <textarea 
                            className="w-full p-4 rounded-xl border border-outline-variant bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none resize-none" 
                            id="cover_letter" 
                            placeholder="Introduce yourself and explain why you're a good fit for this project..." 
                            rows={6}
                        ></textarea>
                    </div>

                    {/* Bid Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                        <div className="flex flex-col gap-stack-sm">
                            <label className="font-label-md text-on-surface-variant px-1" htmlFor="hourly_rate">Your Hourly Rate</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">$</span>
                                <input 
                                    className="w-full pl-8 pr-12 py-3 rounded-xl border border-outline-variant bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" 
                                    id="hourly_rate" 
                                    type="number" 
                                    value={rate}
                                    onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant">/ hr</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-stack-sm">
                            <label className="font-label-md text-on-surface-variant px-1">Estimated Received</label>
                            <div className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-dashed border-outline-variant flex justify-between items-center">
                                <span className="text-secondary font-bold">${estimatedReceived.toFixed(2)}</span>
                                <span className="text-label-sm text-outline">After 10% Fee</span>
                            </div>
                        </div>
                    </div>

                    {/* Estimated Duration */}
                    <div className="flex flex-col gap-stack-sm">
                        <label className="font-label-md text-on-surface-variant px-1" htmlFor="duration">Estimated Duration</label>
                        <select 
                            className="w-full p-4 rounded-xl border border-outline-variant bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none cursor-pointer" 
                            id="duration"
                            defaultValue="1_3"
                        >
                            <option value="less_1">Less than 1 month</option>
                            <option value="1_3">1-3 months</option>
                            <option value="3_6">3-6 months</option>
                            <option value="6_plus">More than 6 months</option>
                        </select>
                    </div>

                    {/* Attachments */}
                    <div className="flex flex-col gap-stack-sm">
                        <label className="font-label-md text-on-surface-variant px-1">Attachments</label>
                        <div className="group relative border-2 border-dashed border-outline-variant rounded-xl p-8 bg-white hover:bg-surface-container-low transition-colors cursor-pointer flex flex-col items-center justify-center gap-2">
                            <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <Upload size={24} />
                            </div>
                            <p className="text-on-surface font-label-md">Upload portfolio or resume</p>
                            <p className="text-label-sm text-on-surface-variant">Max file size: 10MB</p>
                            <input className="absolute inset-0 opacity-0 cursor-pointer" multiple type="file" />
                        </div>
                        
                        {/* File Preview (Static for now) */}
                        <div className="flex flex-wrap gap-2 mt-2">
                            <div className="flex items-center gap-2 px-3 py-2 bg-secondary-container text-on-secondary-container rounded-full text-label-sm">
                                <FileText size={16} />
                                <span>Portfolio_2024.pdf</span>
                                <button type="button" className="hover:text-error transition-colors">
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Submission Footer */}
                    <div className="mt-8 flex justify-center pb-8">
                        <button type="submit" className="w-full md:max-w-[400px] bg-primary text-on-primary py-4 rounded-xl font-label-md flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all">
                            Submit Proposal
                            <Send size={20} />
                        </button>
                    </div>
                </form>
            </main>
        </div>
        </BottomNavLayout>
    );
}
