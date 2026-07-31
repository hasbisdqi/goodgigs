import { Head, useForm } from '@inertiajs/react';
import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { updateSettings } from '@/actions/App/Http/Controllers/AdminController';
import { Save } from 'lucide-react';

export default function Settings({ settings }: any) {
    const { data, setData, post, processing } = useForm({
        settings: {
            site_name: settings.site_name || 'Goodgigs',
            platform_fee: settings.platform_fee || '10',
            support_email: settings.support_email || 'support@goodgigs.com',
            maintenance_mode: settings.maintenance_mode || 'false',
        }
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(updateSettings.url());
    };

    const handleChange = (key: string, value: string) => {
        setData('settings', {
            ...data.settings,
            [key]: value
        });
    };

    return (
        <AdminLayout>
            <Head title="Site Settings | Goodgigs Admin" />
            
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">Platform Settings</h1>
                <p className="text-on-surface-variant">Configure global site settings and platform fees.</p>
            </div>

            <div className="max-w-2xl">
                <form onSubmit={submit} className="space-y-6">
                    
                    <div className="bg-surface p-6 rounded-2xl border border-outline-variant/30 space-y-6 shadow-sm">
                        <h3 className="text-lg font-bold border-b border-outline-variant/30 pb-4">General Configuration</h3>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Site Name</label>
                            <input 
                                type="text" 
                                value={data.settings.site_name} 
                                onChange={e => handleChange('site_name', e.target.value)} 
                                className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Support Email</label>
                            <input 
                                type="email" 
                                value={data.settings.support_email} 
                                onChange={e => handleChange('support_email', e.target.value)} 
                                className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Platform Fee (%)</label>
                            <input 
                                type="number" 
                                value={data.settings.platform_fee} 
                                onChange={e => handleChange('platform_fee', e.target.value)} 
                                className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <p className="text-xs text-on-surface-variant mt-1">Percentage taken from each completed gig.</p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
                            <div>
                                <p className="font-medium">Maintenance Mode</p>
                                <p className="text-sm text-on-surface-variant">Disable user access temporarily</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer"
                                    checked={data.settings.maintenance_mode === 'true'}
                                    onChange={e => handleChange('maintenance_mode', e.target.checked ? 'true' : 'false')}
                                />
                                <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing} className="rounded-full px-8 gap-2 bg-primary text-on-primary hover:bg-primary/90">
                            <Save size={18} />
                            Save Configuration
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
