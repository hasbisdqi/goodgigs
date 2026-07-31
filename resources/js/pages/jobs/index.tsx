import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Briefcase, DollarSign, ArrowLeft } from "lucide-react";
import React from "react";

export default function JobIndex({ jobs }: any) {
    return (
        <div className="min-h-screen bg-neutral-50 pb-20 p-4">
            <Head title="Job List" />
            
            <div className="max-w-md mx-auto">
                <div className="flex items-center space-x-4 mb-6">
                    <Button variant="ghost" size="icon" asChild className="shrink-0">
                        <Link href="/"><ArrowLeft className="w-5 h-5" /></Link>
                    </Button>
                    <h1 className="text-2xl font-bold text-indigo-900">Available Jobs</h1>
                </div>

                <div className="space-y-4">
                    {jobs.length === 0 ? (
                        <div className="text-center py-10 bg-white rounded-lg border border-dashed border-neutral-300">
                            <Briefcase className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                            <p className="text-neutral-500 font-medium">No jobs available right now.</p>
                        </div>
                    ) : (
                        jobs.map((job: any) => (
                            <Link href={`/jobs/${job.id}`} key={job.id} className="block">
                                <Card className="hover:border-indigo-300 hover:shadow-sm transition-all">
                                    <CardContent className="p-4">
                                        <h3 className="font-semibold text-lg text-indigo-900">{job.title}</h3>
                                        <p className="text-sm text-neutral-600 mb-3">{job.company || (job.user?.name)}</p>
                                        
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <div className="flex items-center text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded-md">
                                                <MapPin className="w-3.5 h-3.5 mr-1" />
                                                {job.location || 'Remote'}
                                            </div>
                                            <div className="flex items-center text-xs text-green-700 bg-green-50 px-2 py-1 rounded-md font-medium">
                                                <DollarSign className="w-3.5 h-3.5 mr-0.5" />
                                                Rp {Number(job.salary).toLocaleString('id-ID')}
                                            </div>
                                        </div>
                                        <p className="text-sm text-neutral-600 line-clamp-2">{job.description}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
