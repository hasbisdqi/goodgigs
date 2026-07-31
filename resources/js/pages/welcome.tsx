import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Zap, ShieldCheck, ArrowRight, Compass } from "lucide-react";
import React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function Welcome({ auth }: any) {
    const isDesktop = useMediaQuery('(min-width: 768px)');

    return (
        <div className="min-h-screen bg-background text-on-background font-body-md overflow-x-hidden selection:bg-primary selection:text-on-primary">
            <Head title="GigConnect | Your Next Job is Here" />
            
            {/* Minimal Header */}
            <header className="w-full fixed top-0 z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                            <span className="text-on-primary font-bold text-xl">G</span>
                        </div>
                        <span className="text-xl font-bold text-primary tracking-tight">GigConnect</span>
                    </div>
                    
                    <nav className="hidden md:flex gap-8 items-center text-on-surface-variant font-label-md">
                        <a href="#features" className="hover:text-primary transition-colors">Features</a>
                        <a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a>
                        <a href="#testimonials" className="hover:text-primary transition-colors">Testimonials</a>
                    </nav>

                    <div className="flex items-center gap-3">
                        {auth?.user ? (
                            <Link href="/worker/dashboard">
                                <Button className="rounded-full px-6">Dashboard</Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/login" className="hidden sm:block text-on-surface-variant font-label-md hover:text-primary transition-colors">
                                    Sign In
                                </Link>
                                <Link href="/register">
                                    <Button className="rounded-full px-6">Get Started</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
                    
                    {/* Background blob for aesthetics */}
                    <div className="absolute top-20 right-10 md:top-40 md:-right-20 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-primary/20 blur-[100px] rounded-full -z-10 animate-pulse pointer-events-none"></div>
                    <div className="absolute bottom-10 left-10 w-[250px] h-[250px] bg-tertiary/20 blur-[80px] rounded-full -z-10 pointer-events-none"></div>

                    <div className="flex-1 text-center md:text-left z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-secondary mb-6 border border-secondary/20">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                            </span>
                            <span className="font-label-sm">Live in Yogyakarta & Jakarta</span>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-bold text-on-surface tracking-tight leading-[1.1] mb-6">
                            Find local gigs <br className="hidden md:block"/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary">
                                in real-time.
                            </span>
                        </h1>
                        
                        <p className="text-lg md:text-xl text-on-surface-variant mb-10 max-w-2xl mx-auto md:mx-0">
                            The smartest mobile-first platform connecting skilled workers with immediate local jobs. Track jobs live, get paid securely.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                            <Link href="/worker/dashboard" className="w-full sm:w-auto">
                                <Button size="lg" className="w-full sm:w-auto rounded-full h-14 px-8 text-lg flex items-center gap-2 group">
                                    Find Work
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                </Button>
                            </Link>
                            <Link href="/employer/dashboard" className="w-full sm:w-auto">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full h-14 px-8 text-lg text-on-surface border-outline">
                                    Hire Talent
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Hero Graphic / Prototype Preview */}
                    <div className="flex-1 w-full max-w-md relative z-10 hidden md:block">
                        <div className="relative mx-auto border-8 border-surface-container-highest rounded-[3rem] overflow-hidden shadow-2xl bg-white rotate-[-2deg] hover:rotate-0 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                            <img 
                                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000" 
                                alt="App Preview" 
                                className="w-full object-cover"
                            />
                            {/* Floating UI Element */}
                            <div className="absolute top-1/2 left-0 -translate-x-1/2 bg-surface p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce border border-outline-variant/30">
                                <div className="w-12 h-12 bg-primary-container rounded-full flex items-center justify-center">
                                    <Zap className="text-primary" />
                                </div>
                                <div>
                                    <p className="font-label-md text-on-surface">Pipe Repair</p>
                                    <p className="text-label-sm text-secondary">Matched in 2m</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-24 bg-surface-container-lowest">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold text-on-surface mb-4">Why GigConnect?</h2>
                            <p className="text-on-surface-variant max-w-2xl mx-auto">Everything you need to find work or hire talent instantly.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="bg-surface p-8 rounded-3xl shadow-sm border border-outline-variant/30 hover:border-primary/50 transition-colors group">
                                <div className="w-14 h-14 bg-primary-container rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Compass className="text-primary" size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-on-surface mb-3">Live Map Explorer</h3>
                                <p className="text-on-surface-variant">Browse available gigs near you in real-time on our interactive map. Filter by categories and see exact distances.</p>
                            </div>

                            {/* Feature 2 */}
                            <div className="bg-surface p-8 rounded-3xl shadow-sm border border-outline-variant/30 hover:border-secondary/50 transition-colors group">
                                <div className="w-14 h-14 bg-secondary-container rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Zap className="text-secondary" size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-on-surface mb-3">1-Click Quick Apply</h3>
                                <p className="text-on-surface-variant">See a gig you like? Apply instantly with your verified profile. No long cover letters needed for urgent local work.</p>
                            </div>

                            {/* Feature 3 */}
                            <div className="bg-surface p-8 rounded-3xl shadow-sm border border-outline-variant/30 hover:border-tertiary/50 transition-colors group">
                                <div className="w-14 h-14 bg-tertiary-container rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <ShieldCheck className="text-tertiary" size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-on-surface mb-3">Secure Escrow</h3>
                                <p className="text-on-surface-variant">Funds are secured before you start working. Get paid immediately upon gig completion without chasing invoices.</p>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* CTA Section */}
                <section className="py-24 px-4">
                    <div className="max-w-5xl mx-auto bg-primary text-on-primary rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
                        
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 relative z-10">Ready to start?</h2>
                        <p className="text-primary-container text-lg max-w-xl mx-auto mb-10 relative z-10">
                            Join thousands of freelancers and employers connecting every day on GigConnect.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                            <Link href="/worker/dashboard">
                                <Button size="lg" variant="secondary" className="rounded-full h-14 px-8 text-lg text-primary w-full sm:w-auto">
                                    Explore as Freelancer
                                </Button>
                            </Link>
                            <Link href="/employer/dashboard">
                                <Button size="lg" className="rounded-full h-14 px-8 text-lg bg-primary-fixed text-on-primary-fixed hover:bg-primary-fixed-dim w-full sm:w-auto">
                                    Post a Gig
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-surface-container-lowest py-12 border-t border-outline-variant/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-on-primary font-bold">G</span>
                        </div>
                        <span className="font-bold text-on-surface">GigConnect</span>
                    </div>
                    <p className="text-on-surface-variant font-label-sm">
                        &copy; {new Date().getFullYear()} GigConnect Inc. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">Privacy</a>
                        <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">Terms</a>
                        <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">Help</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
