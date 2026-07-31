import { Head, Link, useForm } from "@inertiajs/react";
import { upload } from "@/actions/App/Http/Controllers/EvidenceController";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { ArrowLeft, Upload, FileImage, FileVideo, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EvidenceUpload({ session, auth }: any) {
    const { data, setData, post, processing, progress, errors } = useForm<{ file: File | null, latitude: string, longitude: string }>({
        file: null,
        latitude: "",
        longitude: ""
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [fileType, setFileType] = useState<'photo' | 'video' | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // check file type
        const type = file.type.startsWith('video/') ? 'video' : 'photo';
        setFileType(type);
        setData('file', file);

        // Generate preview
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
    };

    const clearFile = () => {
        setData('file', null);
        setPreviewUrl(null);
        setFileType(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!data.file) {
            toast.error("Please select a file to upload");
            return;
        }

        toast.info("Acquiring location before upload...");
        
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setData(d => ({
                    ...d,
                    latitude: position.coords.latitude.toString(),
                    longitude: position.coords.longitude.toString(),
                }));

                // Using a small timeout to let the state update before posting
                setTimeout(() => {
                    post(upload.url({ attendanceSession: session.id }), {
                        onSuccess: () => {
                            toast.success("Evidence uploaded successfully!");
                            clearFile();
                        },
                        onError: () => {
                            toast.error(errors.file || errors.general || "Failed to upload evidence");
                        }
                    });
                }, 100);
            },
            (error) => {
                toast.error("Unable to retrieve your location for metadata");
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    return (
        <div className="min-h-screen bg-neutral-50 pb-20">
            <Head title="Upload Evidence" />
            <Toaster position="top-center" richColors />
            
            <div className="max-w-md mx-auto bg-white min-h-screen shadow-sm">
                <div className="p-4 border-b bg-white flex items-center space-x-3">
                    <Link href={`/attendance/${session.id}`} className="p-2 -ml-2 rounded-full hover:bg-neutral-100">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="font-semibold text-lg">Upload Evidence</h1>
                </div>

                <div className="p-6">
                    <Card className="border-indigo-100 shadow-sm">
                        <CardHeader>
                            <CardTitle>Submit Proof of Work</CardTitle>
                            <CardDescription>Upload photos or videos as evidence. Max size: 10MB.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    {!previewUrl ? (
                                        <div 
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full aspect-video border-2 border-dashed border-neutral-300 rounded-xl flex flex-col items-center justify-center text-neutral-500 cursor-pointer hover:bg-neutral-50 transition-colors"
                                        >
                                            <Upload className="w-8 h-8 mb-2 text-indigo-400" />
                                            <p className="font-medium text-neutral-700">Tap to select a file</p>
                                            <p className="text-xs">JPG, PNG, MP4, MOV</p>
                                        </div>
                                    ) : (
                                        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border">
                                            <button 
                                                type="button" 
                                                onClick={clearFile}
                                                className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full z-10"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            {fileType === 'photo' ? (
                                                <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                                            ) : (
                                                <video src={previewUrl} controls className="w-full h-full object-contain" />
                                            )}
                                        </div>
                                    )}
                                    <Input 
                                        ref={fileInputRef}
                                        type="file" 
                                        className="hidden" 
                                        accept="image/jpeg,image/png,image/jpg,video/mp4,video/quicktime"
                                        onChange={handleFileChange}
                                    />
                                    {errors.file && <p className="text-sm text-red-500 mt-2">{errors.file}</p>}
                                </div>

                                {progress && (
                                    <div className="w-full bg-neutral-200 rounded-full h-2.5">
                                        <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress.percentage}%` }}></div>
                                    </div>
                                )}

                                <Button 
                                    type="submit" 
                                    className="w-full bg-indigo-600 hover:bg-indigo-700" 
                                    disabled={processing || !data.file}
                                >
                                    {processing ? "Uploading..." : "Upload Evidence"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="mt-8">
                        <h3 className="font-medium text-neutral-800 mb-4 px-1">Previously Uploaded</h3>
                        <div className="space-y-3">
                            {session.evidences?.length > 0 ? session.evidences.map((ev: any) => (
                                <div key={ev.id} className="flex items-center space-x-3 p-3 bg-white border rounded-lg shadow-sm">
                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-md">
                                        {ev.type === 'photo' ? <FileImage className="w-5 h-5" /> : <FileVideo className="w-5 h-5" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-neutral-900 truncate">Evidence uploaded</p>
                                        <p className="text-xs text-neutral-500">{new Date(ev.created_at).toLocaleString()}</p>
                                    </div>
                                    <a href={`/storage/${ev.file_path}`} target="_blank" rel="noreferrer" className="text-xs font-medium text-indigo-600 hover:underline">
                                        View
                                    </a>
                                </div>
                            )) : (
                                <p className="text-sm text-neutral-500 px-1">No evidence uploaded yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
