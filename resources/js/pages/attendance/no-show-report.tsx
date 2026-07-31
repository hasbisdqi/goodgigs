import { Head, Link, useForm } from "@inertiajs/react";
import { reportNoShow } from "@/actions/App/Http/Controllers/DisputeController";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import React from "react";
import { Textarea } from "@/components/ui/textarea";

export default function NoShowReport({ session, auth }: any) {
    const { data, setData, post, processing, errors } = useForm({
        reason: ""
    });

    const isWorker = auth.user.id === session.worker_id;
    const partnerRole = isWorker ? "employer" : "worker";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        post(reportNoShow.url({ attendanceSession: session.id }), {
            onSuccess: () => {
                toast.success("No-show reported successfully.");
            },
            onError: () => {
                toast.error(errors.grace_period || errors.reason || "Failed to submit report");
            }
        });
    };

    const hasDisputes = session.disputes && session.disputes.length > 0;

    return (
        <div className="min-h-screen bg-neutral-50 pb-20">
            <Head title="Report No-Show" />
            <Toaster position="top-center" richColors />
            
            <div className="max-w-md mx-auto bg-white min-h-screen shadow-sm">
                <div className="p-4 border-b bg-white flex items-center space-x-3">
                    <Link href={`/attendance/${session.id}`} className="p-2 -ml-2 rounded-full hover:bg-neutral-100">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="font-semibold text-lg">Disputes</h1>
                </div>

                <div className="p-6 space-y-6">
                    {session.status !== 'completed' && session.status !== 'cancelled' && (
                        <Card className="border-red-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-red-600 flex items-center space-x-2">
                                    <AlertTriangle className="w-5 h-5" />
                                    <span>Report No-Show</span>
                                </CardTitle>
                                <CardDescription>
                                    If the {partnerRole} hasn't arrived within 30 minutes of the job start time, you can report a no-show.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Textarea 
                                            placeholder="Please provide details about the situation..." 
                                            value={data.reason}
                                            onChange={e => setData('reason', e.target.value)}
                                            rows={4}
                                            className="resize-none"
                                            required
                                        />
                                        {errors.reason && <p className="text-sm text-red-500">{errors.reason}</p>}
                                        {errors.grace_period && <p className="text-sm text-red-500 font-medium">{errors.grace_period}</p>}
                                    </div>
                                    
                                    <Button 
                                        type="submit" 
                                        variant="destructive" 
                                        className="w-full" 
                                        disabled={processing || !data.reason}
                                    >
                                        {processing ? "Submitting..." : "Submit Report"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    <div>
                        <h3 className="font-medium text-neutral-800 mb-4 px-1">Dispute History</h3>
                        <div className="space-y-4">
                            {hasDisputes ? session.disputes.map((dispute: any) => (
                                <Card key={dispute.id} className="border-neutral-200">
                                    <CardHeader className="py-3 px-4 bg-neutral-50 border-b">
                                        <div className="flex justify-between items-center">
                                            <CardTitle className="text-sm font-medium">
                                                {dispute.reporter_id === auth.user.id ? "Reported by You" : "Reported by Partner"}
                                            </CardTitle>
                                            <span className="text-xs font-semibold px-2 py-1 bg-red-100 text-red-700 rounded-full capitalize">
                                                {dispute.status}
                                            </span>
                                        </div>
                                        <CardDescription className="text-xs mt-1">
                                            {new Date(dispute.created_at).toLocaleString()}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <p className="text-sm text-neutral-700 whitespace-pre-wrap">{dispute.reason}</p>
                                        {dispute.resolution && (
                                            <div className="mt-4 p-3 bg-neutral-100 rounded-md">
                                                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Resolution</p>
                                                <p className="text-sm">{dispute.resolution}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )) : (
                                <p className="text-sm text-neutral-500 px-1">No disputes have been filed.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
