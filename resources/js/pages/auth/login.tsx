import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import React from "react";

export default function Login({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="min-h-screen bg-surface-container-lowest flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Sign In | Goodgigs" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6">
                    <ArrowLeft size={20} />
                    <span>Back to Home</span>
                </Link>
                <div className="flex items-center gap-2 mb-8 justify-center">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                        <span className="text-on-primary font-bold text-xl">G</span>
                    </div>
                    <span className="text-2xl font-bold text-primary tracking-tight">Goodgigs</span>
                </div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Card className="border-outline-variant/30 shadow-lg">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
                        <CardDescription className="text-center">
                            Enter your email to sign in to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {status && (
                            <div className="mb-4 font-medium text-sm text-green-600">
                                {status}
                            </div>
                        )}
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="alex@example.com"
                                    required
                                    autoComplete="username"
                                />
                                {errors.email && <p className="text-sm text-error">{errors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                    autoComplete="current-password"
                                />
                                {errors.password && <p className="text-sm text-error">{errors.password}</p>}
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4 rounded border-outline text-primary focus:ring-primary"
                                />
                                <Label htmlFor="remember" className="ml-2 block text-sm text-on-surface-variant font-normal">
                                    Remember me
                                </Label>
                            </div>

                            <Button type="submit" className="w-full rounded-full h-12 text-lg" disabled={processing}>
                                {processing ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-on-surface-variant">Don't have an account? </span>
                            <Link href="/register" className="text-primary hover:underline font-medium">
                                Sign up
                            </Link>
                        </div>
                    </CardContent>
                </Card>
                
                {/* Debug Info */}
                <div className="mt-8 text-center text-sm text-on-surface-variant">
                    <p className="font-medium mb-2">Test Accounts:</p>
                    <p>Employer: alex@example.com / password</p>
                    <p>Worker: sarah@example.com / password</p>
                </div>
            </div>
        </div>
    );
}
