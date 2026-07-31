import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import React from 'react';
import { userProfile, updateProfile } from '@/actions/App/Http/Controllers/DashboardController';

import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';

registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginFileValidateType,
    FilePondPluginImageCrop,
    FilePondPluginImageTransform
);

export default function EditProfile({ user }: any) {
    const { data, setData, post, processing, errors } = useForm({
        name: user.name || '',
        title: user.title || '',
        description: user.description || '',
        location: user.location || '',
        avatar: null as File | null,
    });
    const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(updateProfile.url());
    };

    return (
        <div className="min-h-screen bg-surface-container-lowest text-on-surface pb-20">
            <Head title="Edit Profile | Goodgigs" />
            
            <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={userProfile.url()} className="w-10 h-10 rounded-full hover:bg-surface-variant flex items-center justify-center transition-colors">
                            <ArrowLeft size={20} className="text-on-surface" />
                        </Link>
                        <h1 className="text-xl font-bold">Edit Profile</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 pt-8">
                <form onSubmit={submit} className="space-y-8">
                    
                    {/* Avatar Section */}
                    <div className="bg-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-on-surface">Profile Picture</h3>
                            <p className="text-sm text-on-surface-variant mt-1">Upload a new avatar (PNG, JPG, or GIF up to 5MB).</p>
                        </div>
                        <div className="w-full max-w-45 mx-auto">
                            <FilePond
                                allowMultiple={false}
                                maxFiles={1}
                                name="avatar"
                                labelIdle='Drag & Drop your picture or <span class="filepond--label-action">Browse</span>'
                                acceptedFileTypes={['image/png', 'image/jpeg', 'image/gif']}
                                onupdatefiles={(fileItems) => {
                                    if (fileItems.length > 0) {
                                        setData('avatar', fileItems[0].file as File);
                                    } else {
                                        setData('avatar', null);
                                    }
                                }}
                                stylePanelLayout="compact circle"
                                styleLoadIndicatorPosition="center bottom"
                                styleProgressIndicatorPosition="right bottom"
                                styleButtonRemoveItemPosition="left bottom"
                                styleButtonProcessItemPosition="right bottom"
                                imagePreviewHeight={140}
                                imageCropAspectRatio="1:1"
                                imageResizeTargetWidth={200}
                                imageResizeTargetHeight={200}
                            />
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="bg-surface p-6 rounded-2xl border border-outline-variant/30 space-y-6 shadow-sm">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium text-on-surface">Full Name</label>
                            <input 
                                id="name" 
                                type="text" 
                                value={data.name} 
                                onChange={e => setData('name', e.target.value)} 
                                className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="title" className="text-sm font-medium text-on-surface">Professional Title</label>
                            <input 
                                id="title" 
                                type="text" 
                                value={data.title} 
                                onChange={e => setData('title', e.target.value)} 
                                placeholder="e.g. UX Designer, Plumber"
                                className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="location" className="text-sm font-medium text-on-surface">Location</label>
                            <input 
                                id="location" 
                                type="text" 
                                value={data.location} 
                                onChange={e => setData('location', e.target.value)} 
                                placeholder="e.g. Jakarta, Indonesia"
                                className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-medium text-on-surface">Bio / Description</label>
                            <textarea 
                                id="description" 
                                rows={5}
                                value={data.description} 
                                onChange={e => setData('description', e.target.value)} 
                                placeholder="Tell us about yourself..."
                                className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface resize-y"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Link href={userProfile.url()}>
                            <Button type="button" variant="outline" className="rounded-full px-6 border-outline-variant text-on-surface">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={processing} className="rounded-full px-8 gap-2 bg-primary text-on-primary hover:bg-primary/90">
                            <Save size={18} />
                            Save Changes
                        </Button>
                    </div>
                </form>
            </main>
        </div>
    );
}
