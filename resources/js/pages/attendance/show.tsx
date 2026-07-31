import { Head, Link, useForm } from "@inertiajs/react";
import { store as checkinStore } from "@/actions/App/Http/Controllers/AttendanceController";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { MapPin, User, CheckCircle2, AlertCircle } from "lucide-react";
import React, { useState } from "react";

export default function AttendanceShow({ session, auth }: any) {
    const isWorker = auth.user.id === session.worker_id;
    const isEmployer = auth.user.id === session.employer_id;
    const userRole = isWorker ? 'worker' : 'employer';

    const [isCheckingIn, setIsCheckingIn] = useState(false);

    const checkInForm = useForm({
        latitude: '',
        longitude: '',
        accuracy: ''
    });

    const handleCheckIn = () => {
        setIsCheckingIn(true);
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            setIsCheckingIn(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                checkInForm.transform((data) => ({
                    ...data,
                    latitude: position.coords.latitude.toString(),
                    longitude: position.coords.longitude.toString(),
                    accuracy: position.coords.accuracy.toString(),
                })).post(checkinStore.url({ jobPosting: session.job_posting_id }), {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success("Checked in successfully!");
                        setIsCheckingIn(false);
                    },
                    onError: (errors) => {
                        if (errors.location) {
                            toast.error(errors.location);
                        } else if (errors.grace_period) {
                            toast.error(errors.grace_period);
                        } else if (errors.general) {
                            toast.error(errors.general);
                        } else {
                            toast.error("Failed to check in. Please try again.");
                        }
                        setIsCheckingIn(false);
                    }
                });
            },
            (error) => {
                toast.error("Unable to retrieve your location");
                setIsCheckingIn(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    const hasCheckedIn = session.check_ins?.some((ci: any) => ci.user_id === auth.user.id);
    const partnerHasCheckedIn = session.check_ins?.some((ci: any) => ci.user_id !== auth.user.id);

    return (
        <div className="min-h-screen bg-neutral-50 pb-20">
            <Head title="Attendance Hub" />
            <Toaster position="top-center" richColors />
            
            <div className="max-w-md mx-auto bg-white min-h-screen shadow-sm">
                <div className="p-4 border-b bg-white sticky top-0 z-10 flex items-center justify-between">
                    <h1 className="font-semibold text-lg">Attendance Hub</h1>
                    <div className="text-sm px-2 py-1 bg-neutral-100 rounded-full font-medium text-neutral-600 capitalize">
                        {session.status.replace('_', ' ')}
                    </div>
                </div>

                <div className="p-4 space-y-6">
                    {/* Status Card */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Your Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className={`p-2 rounded-full ${hasCheckedIn ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                    {hasCheckedIn ? <CheckCircle2 className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="font-medium">{hasCheckedIn ? "Checked In" : "Pending Check-in"}</p>
                                    <p className="text-xs text-neutral-500">
                                        {hasCheckedIn ? "You have arrived at the location" : "Waiting for your arrival"}
                                    </p>
                                </div>
                            </div>

                            {!hasCheckedIn && ['waiting_checkin', 'waiting_employer', 'waiting_worker'].includes(session.status) && (
                                <Button 
                                    className="w-full" 
                                    onClick={handleCheckIn}
                                    disabled={isCheckingIn}
                                >
                                    {isCheckingIn ? "Acquiring Location..." : "Check In Now"}
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* Verification Card (If Meeting Confirmed) */}
                    {session.status === 'meeting_confirmed' && (
                        <Card className="border-indigo-100 bg-indigo-50/30">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base text-indigo-900">Verify Meeting</CardTitle>
                                <CardDescription className="text-indigo-700">Both parties have checked in. Please verify to start working.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {isEmployer ? (
                                    <>
                                        <p className="text-sm text-indigo-800">Generate a code for the worker to scan or input.</p>
                                        <div className="flex space-x-2">
                                            <Button variant="outline" className="w-full bg-white border-indigo-200 hover:bg-indigo-50" asChild>
                                                <Link href={`/attendance/${session.id}/qr-display`}>Show QR</Link>
                                            </Button>
                                            <Button variant="outline" className="w-full bg-white border-indigo-200 hover:bg-indigo-50" asChild>
                                                <Link href={`/attendance/${session.id}/pin-display`}>Show PIN</Link>
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-sm text-indigo-800">Scan or input the code from the employer.</p>
                                        <div className="flex space-x-2">
                                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700" asChild>
                                                <Link href={`/attendance/${session.id}/qr-scanner`}>Scan QR</Link>
                                            </Button>
                                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700" asChild>
                                                <Link href={`/attendance/${session.id}/pin-verification`}>Enter PIN</Link>
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Actions Card */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <Link href={`/attendance/${session.id}/evidence`}>Upload Evidence</Link>
                            </Button>
                            
                            <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100" asChild>
                                <Link href={`/attendance/${session.id}/no-show`}>Report No-Show</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Timeline */}
                    <div className="pt-4">
                        <h3 className="font-semibold text-lg mb-4">Timeline</h3>
                        <div className="space-y-4 pl-2">
                            {session.events?.map((event: any, index: number) => (
                                <div key={event.id} className="relative pl-6 pb-4 border-l border-neutral-200 last:border-0 last:pb-0">
                                    <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-neutral-300 border-2 border-white ring-2 ring-transparent"></div>
                                    <div className="text-sm font-medium capitalize">{event.event.replace(/_/g, ' ')}</div>
                                    <div className="text-xs text-neutral-500 mt-0.5">
                                        {new Date(event.created_at).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                            {session.events?.length === 0 && (
                                <div className="text-sm text-neutral-500">No events recorded yet.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
