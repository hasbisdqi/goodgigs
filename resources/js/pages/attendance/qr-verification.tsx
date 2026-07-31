import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { generateQr, verifyQr } from "@/actions/App/Http/Controllers/VerificationController";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { ArrowLeft, QrCode } from "lucide-react";
import React, { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Input } from "@/components/ui/input";

export default function QrVerification({ session, auth }: any) {
    const isEmployer = auth.user.id === session.employer_id;
    const { flash } = usePage<any>().props;

    const { post, processing } = useForm({});
    const verifyForm = useForm({
        token: ""
    });

    const handleGenerate = () => {
        post(generateQr.url({ attendanceSession: session.id }), {
            onSuccess: () => toast.success("QR Generated!"),
        });
    };

    const handleScan = (text: string) => {
        if (verifyForm.processing) return;
        verifyForm.setData('token', text);
        // Automatically submit when scanned
        verifyForm.post(verifyQr.url({ attendanceSession: session.id }), {
            onSuccess: () => toast.success("QR Verified Successfully!"),
            onError: (err) => {
                toast.error(err.token || "QR Verification failed");
            }
        });
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        verifyForm.post(verifyQr.url({ attendanceSession: session.id }), {
            onSuccess: () => toast.success("QR Verified Successfully!"),
            onError: (err) => {
                toast.error(err.token || "QR Verification failed");
            }
        });
    };

    return (
        <div className="min-h-screen bg-neutral-50 pb-20">
            <Head title="QR Verification" />
            <Toaster position="top-center" richColors />
            
            <div className="max-w-md mx-auto bg-white min-h-screen shadow-sm">
                <div className="p-4 border-b bg-white flex items-center space-x-3">
                    <Link href={`/attendance/${session.id}`} className="p-2 -ml-2 rounded-full hover:bg-neutral-100">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="font-semibold text-lg">QR Verification</h1>
                </div>

                <div className="p-6">
                    {isEmployer ? (
                        <Card className="border-indigo-100 shadow-sm text-center">
                            <CardHeader>
                                <CardTitle>Generate QR Code</CardTitle>
                                <CardDescription>Show this QR to the worker to scan.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {flash?.qr_token ? (
                                    <div className="flex justify-center p-4 bg-white border rounded-lg">
                                        {/* Fallback to simply displaying the token as text if we don't have a QR generator library */}
                                        <div className="text-center space-y-4">
                                            <QrCode className="w-48 h-48 mx-auto text-neutral-800" />
                                            <p className="text-sm text-neutral-500 break-all">{flash.qr_token}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-12 bg-neutral-50 border border-dashed rounded-lg flex flex-col items-center justify-center text-neutral-400">
                                        <QrCode className="w-12 h-12 mb-2 opacity-50" />
                                        <p>No QR generated yet</p>
                                    </div>
                                )}
                                
                                <Button 
                                    className="w-full" 
                                    onClick={handleGenerate}
                                    disabled={processing}
                                >
                                    {processing ? "Generating..." : flash?.qr_token ? "Regenerate QR" : "Generate QR"}
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-indigo-100 shadow-sm">
                            <CardHeader className="text-center">
                                <CardTitle>Scan QR Code</CardTitle>
                                <CardDescription>Point your camera at the employer's screen.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="rounded-xl overflow-hidden border-2 border-indigo-100">
                                    <Scanner 
                                        onScan={(result) => {
                                            if (result && result.length > 0) {
                                                handleScan(result[0].rawValue);
                                            }
                                        }} 
                                        onError={(error) => toast.error(error.message || "Failed to start camera")} 
                                    />
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-white px-2 text-muted-foreground">Or enter token manually</span>
                                    </div>
                                </div>

                                <form onSubmit={handleManualSubmit} className="flex space-x-2">
                                    <Input 
                                        value={verifyForm.data.token} 
                                        onChange={e => verifyForm.setData('token', e.target.value)} 
                                        placeholder="Paste token here..." 
                                    />
                                    <Button type="submit" disabled={verifyForm.processing || !verifyForm.data.token}>
                                        Verify
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
