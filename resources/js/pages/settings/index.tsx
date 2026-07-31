import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import React from "react";
import { update as updateSettings } from "@/actions/App/Http/Controllers/SettingsController";

export default function SettingsIndex({ auth }: any) {
    const { data, setData, patch, processing, errors } = useForm({
        name: auth.user.name || '',
        bio: auth.user.bio || '',
        active_mode: auth.user.active_mode || 'worker',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(updateSettings.url(), {
            preserveScroll: true,
            onSuccess: () => toast.success("Profile updated successfully"),
            onError: () => toast.error("Please check the form for errors")
        });
    };

    return (
        <div className="min-h-screen bg-neutral-50 pb-20 p-4">
            <Head title="Profile Settings" />
            <Toaster position="top-center" richColors />
            
            <div className="max-w-md mx-auto">
                <div className="flex items-center space-x-4 mb-6">
                    <Button variant="ghost" size="icon" asChild className="shrink-0">
                        <Link href="/"><ArrowLeft className="w-5 h-5" /></Link>
                    </Button>
                    <h1 className="text-2xl font-bold text-indigo-900">Settings</h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardContent className="p-4 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Name</label>
                                <Input 
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Your name"
                                    className={errors.name ? "border-red-500" : ""}
                                />
                                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Active Mode</label>
                                <Select 
                                    value={data.active_mode} 
                                    onValueChange={(value) => setData('active_mode', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select mode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="worker">Worker</SelectItem>
                                        <SelectItem value="employer">Employer</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.active_mode && <p className="text-xs text-red-500">{errors.active_mode}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Biography</label>
                                <Textarea 
                                    value={data.bio}
                                    onChange={e => setData('bio', e.target.value)}
                                    placeholder="Tell others about yourself..."
                                    rows={4}
                                    className={errors.bio ? "border-red-500" : ""}
                                />
                                {errors.bio && <p className="text-xs text-red-500">{errors.bio}</p>}
                            </div>

                            <Button type="submit" className="w-full" disabled={processing}>
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </Button>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </div>
    );
}
