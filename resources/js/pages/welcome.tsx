import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, User, ArrowRight, Briefcase, Settings } from "lucide-react";
import React from "react";

export default function Welcome({ auth }: any) {
    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
            <Head title="Welcome to GoodGigs" />
            
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-indigo-900 tracking-tight">GoodGigs</h1>
                    <p className="text-neutral-500 mt-2">Mobile-first local gig platform</p>
                </div>

                <Card className="shadow-sm border-neutral-200">
                    <CardHeader>
                        <CardTitle>Navigation Hub</CardTitle>
                        <CardDescription>Select a module to continue</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Link href="/attendance" className="block">
                            <div className="group border rounded-lg p-4 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors cursor-pointer">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-full">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-indigo-900">Attendance Module</h3>
                                            <p className="text-sm text-neutral-500">Check-in, QR/PIN & Dispute</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-indigo-600" />
                                </div>
                            </div>
                        </Link>

                        <Link href="/jobs" className="block">
                            <div className="group border rounded-lg p-4 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors cursor-pointer">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-full">
                                            <Briefcase className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-indigo-900">Job List</h3>
                                            <p className="text-sm text-neutral-500">Browse available gigs</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-indigo-600" />
                                </div>
                            </div>
                        </Link>

                        <Link href={`/user/${auth?.user?.id}`} className="block">
                            <div className="group border rounded-lg p-4 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors cursor-pointer">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-full">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-indigo-900">My Profile</h3>
                                            <p className="text-sm text-neutral-500">View public profile</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-indigo-600" />
                                </div>
                            </div>
                        </Link>

                        <Link href="/settings" className="block">
                            <div className="group border rounded-lg p-4 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors cursor-pointer">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-full">
                                            <Settings className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-indigo-900">Settings</h3>
                                            <p className="text-sm text-neutral-500">Update account details</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-indigo-600" />
                                </div>
                            </div>
                        </Link>
                    </CardContent>
                </Card>

                <div className="mt-8 text-center">
                    {auth?.user ? (
                        <p className="text-sm text-neutral-600">
                            Logged in as <span className="font-medium">{auth.user.name}</span>
                        </p>
                    ) : (
                        <div className="space-x-4">
                            <Button variant="outline" asChild>
                                <a href="/login">Log in</a>
                            </Button>
                            <Button asChild>
                                <a href="/register">Register</a>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
