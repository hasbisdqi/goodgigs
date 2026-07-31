import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Zap, ShieldCheck, ArrowRight, Compass, Search, Map as MapIcon, Clock, Briefcase, Zap as ZapIcon, CheckCircle2, Navigation2 } from "lucide-react";
import React, { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function Welcome({ auth }: any) {
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const [activePath, setActivePath] = useState<'worker' | 'employer'>('worker');

    return (
        <div className="min-h-screen bg-background text-on-background font-body-md selection:bg-primary selection:text-on-primary">
            <Head title="Goodgigs | Jobs near you—right now" />
            
            {/* Header */}
            <header className="w-full bg-background border-b border-outline-variant/30 z-50 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
                            <span className="text-on-primary font-bold">G</span>
                        </div>
                        <span className="text-xl font-bold text-primary tracking-tight">Goodgigs</span>
                    </div>
                    
                    <nav className="hidden md:flex gap-8 items-center text-label-md text-on-surface-variant">
                        <a href="#how-it-works" className="hover:text-primary transition-colors">How it works</a>
                        <a href="#employers" className="hover:text-primary transition-colors">For Employers</a>
                        <a href="#workers" className="hover:text-primary transition-colors">For workers</a>
                        <a href="#support" className="hover:text-primary transition-colors">Support</a>
                    </nav>

                    {/* Mobile Menu Icon (Placeholder) */}
                    <div className="md:hidden flex items-center">
                        <button className="text-on-surface-variant hover:text-primary">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="bg-primary text-on-primary pt-16 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                    {/* Decorative background blur */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 blur-[100px] rounded-full -z-10 pointer-events-none"></div>

                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
                        {/* Placeholder Left Block */}
                        <div className="w-full md:w-1/2 aspect-[4/3] bg-primary-container/50 rounded-2xl border border-outline/20 shadow-2xl overflow-hidden flex items-center justify-center relative">
                            {/* Graphic mockup placeholder */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary-container to-surface-tint opacity-50"></div>
                            <Compass className="text-on-primary-container/30 w-32 h-32" />
                        </div>
                        
                        {/* Content Right */}
                        <div className="w-full md:w-1/2 flex flex-col justify-center">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-on-primary">
                                Jobs near you—<br className="hidden lg:block"/>right now.
                            </h1>
                            <p className="text-on-primary/80 text-body-lg mb-8 max-w-lg">
                                Get matched to local roles within your radius, with clear pay and quick apply. No forms. No guessing.
                            </p>
                            
                            <div className="w-full max-w-md bg-surface rounded-xl p-1.5 flex items-center mb-6 shadow-lg border border-outline-variant/20">
                                <Search className="text-on-surface-variant w-5 h-5 ml-2" />
                                <input 
                                    type="text" 
                                    placeholder="Local role-based job discovery..." 
                                    className="flex-1 bg-transparent border-none text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none px-3 text-body-md py-2"
                                />
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <button className="px-6 py-3 rounded-full bg-surface/10 hover:bg-surface/20 text-on-primary font-label-md transition-colors border border-outline/30 backdrop-blur-md">
                                    I'm an Employer
                                </button>
                                <button className="px-6 py-3 rounded-full bg-secondary hover:bg-secondary-container hover:text-on-secondary-container text-on-secondary font-label-md transition-colors shadow-lg">
                                    See jobs near me
                                </button>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 rounded-full bg-primary-container text-on-primary-container text-label-sm font-medium border border-outline/20">Hire me</span>
                                <span className="px-3 py-1 rounded-full bg-primary-container text-on-primary-container text-label-sm font-medium border border-outline/20">Popular roles</span>
                                <span className="px-3 py-1 rounded-full bg-tertiary-container text-on-tertiary-container text-label-sm font-medium border border-outline/20">Same-day</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Location Query Bar */}
                <section className="py-20 bg-surface-container-lowest border-b border-outline-variant/30">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-headline-lg text-on-surface mb-2 tracking-tight">Location query bar (minimal friction)</h2>
                            <p className="text-on-surface-variant text-body-md max-w-2xl mx-auto">Interactive search that drives the core preview section immediately. Default is auto-detect location + smart radius. Users can change radius and role without searching persona.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 bg-surface p-6 rounded-3xl border border-outline-variant/50 shadow-sm">
                            {/* Input Group 1 */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-label-md text-on-surface">Location</label>
                                <input type="text" placeholder="Gathering..." className="border border-outline-variant rounded-xl px-4 py-2.5 text-body-md bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow" />
                                <p className="text-[11px] text-on-surface-variant/70 leading-tight mt-1">Smart logic: auto-detect location, fallback to State/Area.</p>
                            </div>
                            
                            {/* Input Group 2 */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-label-md text-on-surface">Role search</label>
                                <input type="text" placeholder="Try: Barista, Cleaner..." className="border border-outline-variant rounded-xl px-4 py-2.5 text-body-md bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow" />
                                <p className="text-[11px] text-on-surface-variant/70 leading-tight mt-1">Populates local demand suggestions dynamically.</p>
                            </div>
                            
                            {/* Input Group 3 */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-label-md text-on-surface">Radius</label>
                                <select className="border border-outline-variant rounded-xl px-4 py-2.5 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-surface">
                                    <option>Up to 5 km</option>
                                    <option>Up to 10 km</option>
                                    <option>Up to 25 km</option>
                                </select>
                                <p className="text-[11px] text-on-surface-variant/70 leading-tight mt-1">Microcopy: 'Widen to see more jobs nearby'.</p>
                            </div>
                            
                            {/* Input Group 4 */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-label-md text-on-surface">Time preference <span className="font-normal text-on-surface-variant">(Optional)</span></label>
                                <select className="border border-outline-variant rounded-xl px-4 py-2.5 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-surface">
                                    <option>Today / This week</option>
                                    <option>Anytime</option>
                                </select>
                                <p className="text-[11px] text-on-surface-variant/70 leading-tight mt-1">Prioritizes Same-day / Urgent tags.</p>
                            </div>
                        </div>
                        
                        <div className="flex justify-center gap-4">
                            <button className="px-6 py-3 border-2 border-outline-variant rounded-full text-label-md hover:bg-surface-variant transition-colors text-on-surface">
                                Use a different location
                            </button>
                            <button className="px-6 py-3 bg-primary text-on-primary rounded-full text-label-md hover:bg-primary/90 transition-colors shadow-md">
                                Update jobs
                            </button>
                        </div>
                    </div>
                </section>

                {/* Map Section */}
                <section className="py-12 bg-surface-container-lowest">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="w-full h-[300px] md:h-[400px] bg-surface-container-highest rounded-3xl flex items-center justify-center relative overflow-hidden border border-outline-variant/40 shadow-inner">
                            {/* Crosshatch background pattern simulation using branding colors */}
                            <div className="absolute inset-0 opacity-10" style={{
                                backgroundImage: `linear-gradient(45deg, var(--color-on-surface) 25%, transparent 25%, transparent 75%, var(--color-on-surface) 75%, var(--color-on-surface)), linear-gradient(45deg, var(--color-on-surface) 25%, transparent 25%, transparent 75%, var(--color-on-surface) 75%, var(--color-on-surface))`,
                                backgroundSize: `40px 40px`,
                                backgroundPosition: `0 0, 20px 20px`
                            }}></div>
                            
                            <div className="relative z-10 flex flex-col items-center gap-3 bg-surface/90 px-6 py-4 rounded-2xl backdrop-blur-md shadow-lg border border-outline-variant/50">
                                <MapPin className="text-secondary" size={32} />
                                <span className="text-label-md text-on-surface">Jobs Near You [Core Hook: dynamic live preview]</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Real Utility Preview */}
                <section className="py-24 bg-surface-container-lowest border-b border-outline-variant/30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-headline-lg text-on-surface mb-4 tracking-tight">Real utility preview</h2>
                            <p className="text-on-surface-variant text-body-lg max-w-2xl mx-auto">Replace generic feature boxes with a "preview of outcomes". Each item is framed as a direct benefit, triggered by the live search.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Card 1 */}
                            <div className="flex flex-col border border-outline-variant/40 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-surface">
                                <div className="h-56 bg-surface-container-highest p-4 flex flex-col relative border-b border-outline-variant/30">
                                    <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider bg-surface/50 w-max px-2 py-1 rounded-md backdrop-blur-sm">Instant</span>
                                    <div className="flex-1 flex items-center justify-center text-center p-4">
                                        <p className="text-sm text-on-surface-variant/80 italic">A secure pin-code map with distance and pay highlighted</p>
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col gap-2">
                                    <h3 className="text-headline-md text-on-surface">Find the closest match</h3>
                                    <p className="text-body-md text-on-surface-variant mb-4">Cards update as you change radius.</p>
                                    <div className="flex gap-2">
                                        <div className="w-8 h-8 rounded-full bg-error-container text-on-error-container flex items-center justify-center"><MapPin size={14} /></div>
                                        <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center"><Zap size={14} /></div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Card 2 */}
                            <div className="flex flex-col border border-outline-variant/40 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-surface">
                                <div className="h-56 bg-surface-container-highest p-4 flex flex-col relative border-b border-outline-variant/30">
                                    <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider bg-surface/50 w-max px-2 py-1 rounded-md backdrop-blur-sm">Clear</span>
                                    <div className="flex-1 flex items-center justify-center text-center p-4">
                                        <p className="text-sm text-on-surface-variant/80 italic">A map pin hovering over a neighborhood with an Urgent badge</p>
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col gap-2">
                                    <h3 className="text-headline-md text-on-surface">See urgency at a glance</h3>
                                    <p className="text-body-md text-on-surface-variant mb-4">Badges prioritize Same-day / Urgent roles.</p>
                                    <div className="flex gap-2">
                                        <div className="w-8 h-8 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center"><Clock size={14} /></div>
                                        <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center"><Briefcase size={14} /></div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Card 3 */}
                            <div className="flex flex-col border border-outline-variant/40 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-surface">
                                <div className="h-56 bg-surface-container-highest p-4 flex flex-col relative border-b border-outline-variant/30">
                                    <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider bg-surface/50 w-max px-2 py-1 rounded-md backdrop-blur-sm">Low effort</span>
                                    <div className="flex-1 flex items-center justify-center text-center p-4">
                                        <p className="text-sm text-on-surface-variant/80 italic">A quick apply confirmation toast after tapping 'Hire' CTA.</p>
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col gap-2">
                                    <h3 className="text-headline-md text-on-surface">Apply faster</h3>
                                    <p className="text-body-md text-on-surface-variant mb-4">Micro-CTA keeps you in-flow, without forms.</p>
                                    <div className="flex gap-2">
                                        <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center"><CheckCircle2 size={14} /></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Choose Path Section */}
                <section className="py-24 bg-surface-container">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-headline-lg text-on-surface mb-4 tracking-tight">Choose your path—without<br className="hidden md:block"/>forcing a choice too early</h2>
                            <p className="text-on-surface-variant text-body-lg max-w-2xl mx-auto">Dual value proposition section placed after the 'Aha!' moment. Users have already seen jobs; persona switch is secondary, not a hard gate.</p>
                        </div>
                        
                        <div className="flex justify-center gap-4 mb-16">
                            <button 
                                onClick={() => setActivePath('worker')}
                                className={`px-8 py-3 rounded-full text-label-md transition-all ${
                                    activePath === 'worker' 
                                    ? "bg-surface border-2 border-primary text-primary shadow-sm" 
                                    : "bg-transparent border border-outline-variant text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
                                }`}
                            >
                                Keep browsing as a Worker
                            </button>
                            <button 
                                onClick={() => setActivePath('employer')}
                                className={`px-8 py-3 rounded-full text-label-md transition-all ${
                                    activePath === 'employer'
                                    ? "bg-primary text-on-primary shadow-md border-2 border-primary"
                                    : "bg-transparent border border-outline-variant text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
                                }`}
                            >
                                Switch to Employer
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Worker Card */}
                            <div 
                                className={`p-8 rounded-3xl border-2 ${activePath === 'worker' ? 'border-primary shadow-lg bg-surface' : 'border-outline-variant/30 bg-surface/50 hover:bg-surface hover:border-outline-variant'} transition-all cursor-pointer flex flex-col xl:flex-row gap-6`}
                                onClick={() => setActivePath('worker')}
                            >
                                <div className="w-full xl:w-40 aspect-square bg-surface-container-highest rounded-2xl shrink-0 flex items-center justify-center">
                                    <Briefcase className="text-on-surface-variant/40 w-12 h-12" />
                                </div>
                                <div className="flex flex-col flex-1 justify-center">
                                    <h3 className="text-headline-md text-on-surface mb-1">For Workers</h3>
                                    <p className="text-label-sm text-secondary mb-3">Local jobs that fit your schedule</p>
                                    <p className="text-body-md text-on-surface-variant mb-6">
                                        Browse jobs near you with pay + distance upfront. Save roles, get alerts when new matches appear.
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        <span className="px-3 py-1 rounded-lg bg-secondary-container text-on-secondary-container text-label-sm">Immediate</span>
                                        <span className="px-3 py-1 rounded-lg bg-surface-variant text-on-surface text-label-sm">Top-tier</span>
                                        <span className="px-3 py-1 rounded-lg bg-tertiary-container text-on-tertiary-container text-label-sm">Quick apply</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 mt-auto">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${activePath === 'worker' ? 'border-primary' : 'border-outline'}`}>
                                            {activePath === 'worker' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                                        </div>
                                        <span className="text-label-md text-on-surface">Worker view</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Employer Card */}
                            <div 
                                className={`p-8 rounded-3xl border-2 ${activePath === 'employer' ? 'border-primary shadow-lg bg-surface' : 'border-outline-variant/30 bg-surface/50 hover:bg-surface hover:border-outline-variant'} transition-all cursor-pointer flex flex-col xl:flex-row gap-6`}
                                onClick={() => setActivePath('employer')}
                            >
                                <div className="w-full xl:w-40 aspect-square bg-surface-container-highest rounded-2xl shrink-0 flex items-center justify-center">
                                    <Navigation2 className="text-on-surface-variant/40 w-12 h-12" />
                                </div>
                                <div className="flex flex-col flex-1 justify-center">
                                    <h3 className="text-headline-md text-on-surface mb-1">For Employers</h3>
                                    <p className="text-label-sm text-secondary mb-3">Hire skills faster in your neighborhood</p>
                                    <p className="text-body-md text-on-surface-variant mb-6">
                                        Post roles with radius targeting, reach nearby candidates, and track urgency.
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        <span className="px-3 py-1 rounded-lg bg-secondary-container text-on-secondary-container text-label-sm">Same-day staffing</span>
                                        <span className="px-3 py-1 rounded-lg bg-surface-variant text-on-surface text-label-sm">Relevant applicants</span>
                                        <span className="px-3 py-1 rounded-lg bg-tertiary-container text-on-tertiary-container text-label-sm">Urgency badges</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 mt-auto">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${activePath === 'employer' ? 'border-primary' : 'border-outline'}`}>
                                            {activePath === 'employer' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                                        </div>
                                        <span className="text-label-md text-on-surface">Employer view</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer CTA Placeholder */}
                <section className="py-24 bg-surface-container-lowest">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="w-full h-[300px] bg-primary rounded-[2rem] flex flex-col items-center justify-center border border-outline-variant/20 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 blur-[80px] rounded-full"></div>
                            <h2 className="text-headline-lg text-on-primary mb-4 z-10">Start your journey today</h2>
                            <p className="text-on-primary/80 mb-8 z-10">Employer still bypassing, show deferred CTA here.</p>
                            <button className="px-8 py-4 bg-secondary text-on-secondary rounded-full font-label-md hover:bg-secondary-container hover:text-on-secondary-container transition-colors z-10">
                                Create an Account
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-surface py-12 border-t border-outline-variant/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-label-md text-on-surface-variant">
                        <a href="#how-it-works" className="hover:text-primary transition-colors">How it works</a>
                        <a href="#workers" className="hover:text-primary transition-colors">For Workers</a>
                        <a href="#employers" className="hover:text-primary transition-colors">For Employers</a>
                        <a href="#safety" className="hover:text-primary transition-colors">Safety & privacy</a>
                        <a href="#terms" className="hover:text-primary transition-colors">Terms</a>
                        <a href="#support" className="hover:text-primary transition-colors">Support</a>
                        <span className="text-outline">© Goodgigs</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
