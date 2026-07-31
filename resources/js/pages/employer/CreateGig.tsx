import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Briefcase, MapPin, DollarSign, Clock, FileText, CheckCircle2 } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';

interface CreateGigProps {
    categories: string[];
}

export default function CreateGig({ categories }: CreateGigProps) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        type: categories[0] || 'Design',
        description: '',
        location: '',
        latitude: '',
        longitude: '',
        salary: '',
        duration: '',
    });

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setData(data => ({
                        ...data,
                        latitude: position.coords.latitude.toString(),
                        longitude: position.coords.longitude.toString()
                    }));
                },
                (error) => {
                    // Fallback to Yogyakarta center if geolocation fails or is denied
                    alert("Using default Yogyakarta coordinates since location access was denied or failed.");
                    setData(data => ({
                        ...data,
                        latitude: '-7.7956',
                        longitude: '110.3695'
                    }));
                }
            );
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/gigs');
    };

    return (
        <DashboardLayout title="Create a New Gig" role="employer">
            <div className="max-w-3xl mx-auto pb-24">
                <div className="flex items-center gap-4 mb-6 mt-4">
                    <button onClick={() => window.history.back()} className="p-2 bg-surface-container-low rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-headline-md font-bold text-on-surface">Post a New Gig</h1>
                        <p className="text-body-md text-on-surface-variant">Fill in the details to find the best talent.</p>
                    </div>
                </div>

                <div className="bg-surface shadow-sm border border-outline-variant/30 rounded-2xl p-6 md:p-8">
                    <form onSubmit={submit} className="flex flex-col gap-6">
                        
                        {/* Title */}
                        <div>
                            <label className="block text-label-md font-semibold text-on-surface mb-2">Gig Title</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Briefcase className="h-5 w-5 text-outline" />
                                </div>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-outline-variant rounded-xl focus:ring-primary focus:border-primary bg-surface text-on-surface sm:text-body-md transition-shadow"
                                    placeholder="e.g. Senior Brand Designer"
                                />
                            </div>
                            {errors.title && <p className="mt-1 text-label-sm text-error">{errors.title}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Category */}
                            <div>
                                <label className="block text-label-md font-semibold text-on-surface mb-2">Category</label>
                                <select
                                    value={data.type}
                                    onChange={e => setData('type', e.target.value)}
                                    className="block w-full px-3 py-3 border border-outline-variant rounded-xl focus:ring-primary focus:border-primary bg-surface text-on-surface sm:text-body-md transition-shadow"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                {errors.type && <p className="mt-1 text-label-sm text-error">{errors.type}</p>}
                            </div>

                            {/* Location Name */}
                            <div>
                                <label className="block text-label-md font-semibold text-on-surface mb-2">Location Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPin className="h-5 w-5 text-outline" />
                                    </div>
                                    <input
                                        type="text"
                                        value={data.location}
                                        onChange={e => setData('location', e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-outline-variant rounded-xl focus:ring-primary focus:border-primary bg-surface text-on-surface sm:text-body-md transition-shadow"
                                        placeholder="e.g. Remote or Jakarta"
                                    />
                                </div>
                                {errors.location && <p className="mt-1 text-label-sm text-error">{errors.location}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Latitude */}
                            <div>
                                <label className="block text-label-md font-semibold text-on-surface mb-2">Map Latitude</label>
                                <input
                                    type="text"
                                    value={data.latitude}
                                    onChange={e => setData('latitude', e.target.value)}
                                    className="block w-full px-3 py-3 border border-outline-variant rounded-xl focus:ring-primary focus:border-primary bg-surface text-on-surface sm:text-body-md transition-shadow"
                                    placeholder="e.g. -7.7956"
                                />
                                {errors.latitude && <p className="mt-1 text-label-sm text-error">{errors.latitude}</p>}
                            </div>
                            
                            {/* Longitude */}
                            <div>
                                <label className="block text-label-md font-semibold text-on-surface mb-2">Map Longitude</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={data.longitude}
                                        onChange={e => setData('longitude', e.target.value)}
                                        className="block w-full px-3 py-3 border border-outline-variant rounded-xl focus:ring-primary focus:border-primary bg-surface text-on-surface sm:text-body-md transition-shadow"
                                        placeholder="e.g. 110.3695"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={handleGetLocation}
                                        className="bg-secondary-container text-on-secondary-container px-4 rounded-xl flex items-center justify-center hover:bg-secondary hover:text-white transition-colors"
                                        title="Get Current Location"
                                    >
                                        <MapPin size={20} />
                                    </button>
                                </div>
                                {errors.longitude && <p className="mt-1 text-label-sm text-error">{errors.longitude}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Salary */}
                            <div>
                                <label className="block text-label-md font-semibold text-on-surface mb-2">Salary / Budget (Rp)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <DollarSign className="h-5 w-5 text-outline" />
                                    </div>
                                    <input
                                        type="number"
                                        value={data.salary}
                                        onChange={e => setData('salary', e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-outline-variant rounded-xl focus:ring-primary focus:border-primary bg-surface text-on-surface sm:text-body-md transition-shadow"
                                        placeholder="e.g. 150000"
                                    />
                                </div>
                                <p className="mt-1 text-label-sm text-on-surface-variant">Min wage: Rp 50,000</p>
                                {errors.salary && <p className="mt-1 text-label-sm text-error">{errors.salary}</p>}
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="block text-label-md font-semibold text-on-surface mb-2">Duration</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Clock className="h-5 w-5 text-outline" />
                                    </div>
                                    <input
                                        type="text"
                                        value={data.duration}
                                        onChange={e => setData('duration', e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-outline-variant rounded-xl focus:ring-primary focus:border-primary bg-surface text-on-surface sm:text-body-md transition-shadow"
                                        placeholder="e.g. 2-3 Days"
                                    />
                                </div>
                                {errors.duration && <p className="mt-1 text-label-sm text-error">{errors.duration}</p>}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-label-md font-semibold text-on-surface mb-2">Gig Description</label>
                            <div className="relative">
                                <div className="absolute top-3 left-3 pointer-events-none">
                                    <FileText className="h-5 w-5 text-outline" />
                                </div>
                                <textarea
                                    rows={5}
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-outline-variant rounded-xl focus:ring-primary focus:border-primary bg-surface text-on-surface sm:text-body-md transition-shadow"
                                    placeholder="Describe the job requirements and expectations..."
                                ></textarea>
                            </div>
                            {errors.description && <p className="mt-1 text-label-sm text-error">{errors.description}</p>}
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-on-primary px-8 py-3 rounded-full font-label-lg font-bold shadow-md active:scale-95 transition-all disabled:opacity-50"
                            >
                                <CheckCircle2 size={20} />
                                Post Gig
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
