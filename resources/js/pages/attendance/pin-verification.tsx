import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { generatePin, verifyPin } from "@/actions/App/Http/Controllers/VerificationController";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";

export default function PinVerification({ session, auth }: any) {
    const isEmployer = auth.user.id === session.employer_id;
    const { flash } = usePage<any>().props;

    const { post, processing } = useForm({});
    const verifyForm = useForm({
        pin: ""
    });

    const handleGenerate = () => {
        post(generatePin.url({ attendanceSession: session.id }), {
            onSuccess: () => toast.success("PIN Generated!"),
        });
    };

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        verifyForm.post(verifyPin.url({ attendanceSession: session.id }), {
            onSuccess: () => toast.success("PIN Verified Successfully!"),
            onError: (err) => {
                toast.error(err.pin || "Verification failed");
            }
        });
    };

    return (
        <div className="min-h-screen bg-neutral-50 pb-20">
            <Head title="PIN Verification" />
            <Toaster position="top-center" richColors />
            
            <div className="max-w-md mx-auto bg-white min-h-screen shadow-sm">
                <div className="p-4 border-b bg-white flex items-center space-x-3">
                    <Link href={`/attendance/${session.id}`} className="p-2 -ml-2 rounded-full hover:bg-neutral-100">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="font-semibold text-lg">PIN Verification</h1>
                </div>

                <div className="p-6">
                    {isEmployer ? (
                        <Card className="border-indigo-100 shadow-sm text-center">
                            <CardHeader>
                                <CardTitle>Generate PIN</CardTitle>
                                <CardDescription>Show this PIN to the worker to verify the meeting.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {flash?.pin ? (
                                    <div className="py-6 bg-neutral-100 rounded-lg text-4xl font-mono font-bold tracking-[0.2em] text-neutral-800">
                                        {flash.pin}
                                    </div>
                                ) : (
                                    <div className="py-6 bg-neutral-50 border border-dashed rounded-lg text-neutral-400">
                                        No PIN generated yet
                                    </div>
                                )}
                                
                                <Button 
                                    className="w-full" 
                                    onClick={handleGenerate}
                                    disabled={processing}
                                >
                                    {processing ? "Generating..." : flash?.pin ? "Regenerate PIN" : "Generate PIN"}
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-indigo-100 shadow-sm text-center">
                            <CardHeader>
                                <CardTitle>Enter PIN</CardTitle>
                                <CardDescription>Enter the 6-digit PIN provided by the employer.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleVerify} className="space-y-8 flex flex-col items-center">
                                    <InputOTP 
                                        maxLength={6} 
                                        value={verifyForm.data.pin}
                                        onChange={(val) => verifyForm.setData('pin', val)}
                                    >
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>

                                    <Button 
                                        type="submit" 
                                        className="w-full" 
                                        disabled={verifyForm.processing || verifyForm.data.pin.length < 6}
                                    >
                                        {verifyForm.processing ? "Verifying..." : "Verify PIN"}
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
