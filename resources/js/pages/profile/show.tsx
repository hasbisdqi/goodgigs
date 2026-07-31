import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, MapPin, Briefcase, ArrowLeft } from "lucide-react";
import React from "react";

export default function ProfileShow({ profileUser }: any) {
    return (
        <div className="min-h-screen bg-neutral-50 pb-20 p-4">
            <Head title={`${profileUser.name} - Profile`} />
            
            <div className="max-w-md mx-auto">
                <div className="flex items-center space-x-4 mb-6">
                    <Button variant="ghost" size="icon" asChild className="shrink-0">
                        <Link href="/"><ArrowLeft className="w-5 h-5" /></Link>
                    </Button>
                    <h1 className="text-xl font-bold text-indigo-900">User Profile</h1>
                </div>

                <Card className="mb-4">
                    <CardContent className="p-6 text-center">
                        <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full mx-auto flex items-center justify-center mb-4 border-4 border-white shadow-sm">
                            <User className="w-12 h-12" />
                        </div>
                        <h2 className="text-2xl font-bold text-neutral-900">{profileUser.name}</h2>
                        <p className="text-indigo-600 font-medium capitalize mt-1">
                            {profileUser.active_mode || 'User'} Mode
                        </p>
                        
                        {profileUser.address && (
                            <p className="text-sm text-neutral-500 flex items-center justify-center mt-3">
                                <MapPin className="w-4 h-4 mr-1" />
                                {profileUser.address}
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3 border-b">
                        <CardTitle className="text-base flex items-center">
                            <Briefcase className="w-4 h-4 mr-2 text-indigo-500" /> 
                            About
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        {profileUser.bio ? (
                            <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
                                {profileUser.bio}
                            </p>
                        ) : (
                            <p className="text-sm text-neutral-400 italic">No biography provided.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
