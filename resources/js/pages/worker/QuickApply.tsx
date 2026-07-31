import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ChevronLeft, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function QuickApply({ gig }: any) {
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            setSuccess(true);
        }, 1200);
    };

    if (success) {
        return (
            <div className="bg-background text-on-background font-body-md min-h-screen flex items-center justify-center p-6">
                <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-xl max-w-sm w-full text-center border border-outline-variant">
                    <CheckCircle2 className="mx-auto text-secondary mb-6" size={64} />
                    <h2 className="font-headline-lg text-on-surface mb-2">Proposal Sent!</h2>
                    <p className="text-on-surface-variant mb-8">We've notified the employer. They will review your profile shortly.</p>
                    <Link href="/worker/dashboard">
                        <Button className="w-full">Return to Dashboard</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background text-on-background font-body-md min-h-screen pb-24">
            <Head title="Goodgigs | Quick Apply" />
            
            <header className="bg-surface shadow-sm sticky top-0 z-40">
                <div className="flex justify-between items-center px-4 md:px-8 w-full h-16 max-w-7xl mx-auto">
                    <Link href={`/gigs/${gig?.id || 1}/tracking`} className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2">
                        <ChevronLeft size={24} />
                        <span className="font-label-md hidden md:inline">Back to Gig</span>
                    </Link>
                    <h1 className="font-headline-md text-headline-md font-bold text-primary">Quick Apply</h1>
                    <div className="w-6" /> {/* spacer */}
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 md:px-0 mt-8">
                <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-sm border border-outline-variant/50">
                    
                    <div className="flex items-start gap-4 mb-8 pb-8 border-b border-outline-variant/30">
                        <div className="w-16 h-16 bg-primary-container rounded-xl flex items-center justify-center shrink-0">
                            <Zap className="text-primary" size={32} />
                        </div>
                        <div>
                            <h2 className="font-headline-md text-[20px] text-on-surface mb-1">
                                {gig?.title || 'Emergency Pipe Repair'}
                            </h2>
                            <p className="text-on-surface-variant font-body-md flex items-center gap-2">
                                <span className="font-bold text-secondary">{gig?.rate || '$80/hr'}</span>
                                <span>•</span>
                                <span>{gig?.client?.name || 'Mrs. Diana'}</span>
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block font-label-md text-on-surface mb-2">Include a quick note (Optional)</label>
                            <textarea 
                                className="w-full border-outline-variant rounded-xl p-4 focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
                                rows={3}
                                placeholder="E.g. I am 5 minutes away and have all the tools."
                            ></textarea>
                        </div>
                        
                        <div className="bg-surface-container-low p-4 rounded-xl flex gap-3 text-sm text-on-surface-variant border border-outline-variant/50">
                            <ShieldCheck className="shrink-0 text-primary" size={20} />
                            <p>
                                Quick Apply uses your existing profile and verified ID. The employer will instantly receive your contact info and rating.
                            </p>
                        </div>

                        <Button type="submit" size="lg" className="w-full text-lg h-14 rounded-xl mt-4 relative overflow-hidden group">
                            {submitting ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    Sending...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Zap size={20} className="group-hover:scale-110 transition-transform" />
                                    1-Click Apply
                                </span>
                            )}
                        </Button>
                    </form>

                </div>
            </main>
        </div>
    );
}
