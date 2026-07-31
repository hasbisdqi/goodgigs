import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Briefcase, DollarSign, ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import React, { useState } from "react";
import { store as applyStore } from "@/actions/App/Http/Controllers/JobApplicationController";

export default function JobShow({ job, hasApplied, auth }: any) {
    const isEmployer = auth.user.id === job.user_id;
    const [isOpen, setIsOpen] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        message: ''
    });

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();
        post(applyStore.url({ jobPosting: job.id }), {
            preserveScroll: true,
            onSuccess: () => {
                setIsOpen(false);
                toast.success("Your application has been submitted successfully!");
            },
            onError: (errors) => {
                if (errors.message) {
                    toast.error(errors.message);
                }
            }
        });
    };

    return (
        <div className="min-h-screen bg-neutral-50 pb-20 p-4">
            <Head title={job.title} />
            <Toaster position="top-center" richColors />
            
            <div className="max-w-md mx-auto">
                <div className="flex items-center space-x-4 mb-6">
                    <Button variant="ghost" size="icon" asChild className="shrink-0">
                        <Link href="/jobs"><ArrowLeft className="w-5 h-5" /></Link>
                    </Button>
                    <h1 className="text-xl font-bold text-indigo-900 truncate">Job Details</h1>
                </div>

                <Card className="mb-6">
                    <CardContent className="p-6">
                        <h2 className="text-2xl font-bold text-neutral-900 leading-tight mb-2">{job.title}</h2>
                        <p className="text-indigo-600 font-medium mb-4">{job.company || (job.user?.name)}</p>
                        
                        <div className="flex flex-wrap gap-3 mb-6">
                            <div className="flex items-center text-sm text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-md">
                                <MapPin className="w-4 h-4 mr-1.5" />
                                {job.location || 'Remote'}
                            </div>
                            <div className="flex items-center text-sm text-green-700 bg-green-50 px-3 py-1.5 rounded-md font-medium">
                                <DollarSign className="w-4 h-4 mr-1" />
                                Rp {Number(job.salary).toLocaleString('id-ID')}
                            </div>
                            <div className="flex items-center text-sm text-blue-700 bg-blue-50 px-3 py-1.5 rounded-md capitalize font-medium">
                                <Briefcase className="w-4 h-4 mr-1.5" />
                                {job.type}
                            </div>
                        </div>

                        <div className="prose prose-sm max-w-none text-neutral-700 mb-6 whitespace-pre-wrap">
                            {job.description}
                        </div>

                        {!isEmployer && (
                            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                <DialogTrigger asChild>
                                    <Button className="w-full" size="lg" disabled={hasApplied}>
                                        {hasApplied ? "Already Applied" : "Apply Now"}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md w-[90vw] rounded-lg">
                                    <DialogHeader>
                                        <DialogTitle>Apply for this Job</DialogTitle>
                                        <DialogDescription>
                                            Send a message to the employer explaining why you are a good fit.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleApply}>
                                        <div className="py-4">
                                            <Textarea
                                                placeholder="Write your cover letter or message..."
                                                value={data.message}
                                                onChange={(e) => setData('message', e.target.value)}
                                                rows={5}
                                                className={errors.message ? "border-red-500" : ""}
                                            />
                                            {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" className="w-full" disabled={processing}>
                                                <Send className="w-4 h-4 mr-2" />
                                                Send Application
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        )}

                        {isEmployer && (
                            <div className="bg-neutral-100 p-3 rounded-md text-center text-sm text-neutral-600">
                                This is your job posting.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
