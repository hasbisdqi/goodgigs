import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, ArrowRight, User } from "lucide-react";
import React from "react";
import { index as attendanceIndex } from "@/actions/App/Http/Controllers/AttendanceController";

export default function AttendanceIndex({ sessions, auth }: any) {
    return (
        <div className="min-h-screen bg-neutral-50 pb-20 p-4">
            <Head title="Attendance Sessions" />
            
            <div className="max-w-md mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-indigo-900">Attendance</h1>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/">Back</Link>
                    </Button>
                </div>

                <div className="space-y-4">
                    {sessions.length === 0 ? (
                        <div className="text-center py-10 bg-white rounded-lg border border-dashed border-neutral-300">
                            <MapPin className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                            <p className="text-neutral-500 font-medium">No attendance sessions found.</p>
                            <p className="text-sm text-neutral-400 mt-1">Sessions will appear here once you accept a job.</p>
                        </div>
                    ) : (
                        sessions.map((session: any) => (
                            <Link href={`/attendance/${session.id}`} key={session.id} className="block">
                                <Card className="hover:border-indigo-300 hover:shadow-sm transition-all">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-indigo-900">
                                                {session.job_posting?.title || 'Unknown Job'}
                                            </h3>
                                            <p className="text-sm text-neutral-500 flex items-center mt-1">
                                                <User className="w-3.5 h-3.5 mr-1" />
                                                {auth.user.id === session.worker_id ? 'As Worker' : 'As Employer'}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-xs font-medium px-2 py-1 bg-neutral-100 text-neutral-600 rounded-full capitalize">
                                                {session.status.replace(/_/g, ' ')}
                                            </span>
                                            <ArrowRight className="w-4 h-4 text-neutral-400" />
                                        </div>
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
