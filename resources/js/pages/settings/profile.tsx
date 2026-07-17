import { Form, Head, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import { useState } from 'react';
import type { Auth } from '@/types';
import { MapPin } from 'lucide-react';

type PageProps = {
    auth: Auth;
};

export default function Profile({
    mustVerifyEmail,
    status,
    portfolios,
}: {
    mustVerifyEmail: boolean;
    status?: string;
    portfolios?: any[];
}) {
    const { auth } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Profile"
                    description="Update your name and email address"
                />

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>

                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.name}
                                    name="name"
                                    required
                                    autoComplete="name"
                                    placeholder="Full name"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.name}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>

                                <Input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.email}
                                    name="email"
                                    required
                                    autoComplete="username"
                                    placeholder="Email address"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.email}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="bio">Bio / Tentang Saya</Label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    defaultValue={auth.user.bio || ''}
                                    className="mt-1 block w-full rounded-md border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    rows={4}
                                    placeholder="Tuliskan sedikit tentang diri Anda..."
                                />
                                <InputError className="mt-2" message={errors.bio} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="address">Alamat (Opsional)</Label>
                                <Input
                                    id="address"
                                    name="address"
                                    defaultValue={auth.user.address || ''}
                                    className="mt-1 block w-full"
                                    placeholder="Contoh: Jl. Sudirman No. 12, Jakarta"
                                />
                                <InputError className="mt-2" message={errors.address} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="latitude">Latitude</Label>
                                    <Input
                                        id="latitude"
                                        name="latitude"
                                        type="number"
                                        step="any"
                                        defaultValue={auth.user.latitude || ''}
                                        className="mt-1 block w-full"
                                        placeholder="-6.2088"
                                    />
                                    <InputError className="mt-2" message={errors.latitude} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="longitude">Longitude</Label>
                                    <Input
                                        id="longitude"
                                        name="longitude"
                                        type="number"
                                        step="any"
                                        defaultValue={auth.user.longitude || ''}
                                        className="mt-1 block w-full"
                                        placeholder="106.8456"
                                    />
                                    <InputError className="mt-2" message={errors.longitude} />
                                </div>
                            </div>
                            <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                className="w-fit"
                                onClick={() => {
                                    if (navigator.geolocation) {
                                        navigator.geolocation.getCurrentPosition(
                                            (position) => {
                                                const latInput = document.getElementById('latitude') as HTMLInputElement;
                                                const lngInput = document.getElementById('longitude') as HTMLInputElement;
                                                if (latInput && lngInput) {
                                                    latInput.value = position.coords.latitude.toString();
                                                    lngInput.value = position.coords.longitude.toString();
                                                }
                                            },
                                            (error) => alert('Gagal mendapatkan lokasi: ' + error.message)
                                        );
                                    } else {
                                        alert('Geolocation tidak didukung di browser ini.');
                                    }
                                }}
                            >
                                <MapPin className="w-4 h-4 mr-2" />
                                Deteksi Lokasi Saat Ini
                            </Button>

                            <div className="grid gap-2">
                                <Label htmlFor="skills">Keahlian (Pisahkan dengan koma)</Label>
                                <Input
                                    id="skills"
                                    name="skills"
                                    defaultValue={Array.isArray(auth.user.skills) ? auth.user.skills.join(', ') : ''}
                                    className="mt-1 block w-full"
                                    placeholder="Contoh: Menjahit, Pipa, Desain Grafis"
                                />
                                <p className="text-[10px] text-muted-foreground mt-1">Pisahkan setiap keahlian dengan tanda koma (,)</p>
                                <InputError className="mt-2" message={errors.skills} />
                            </div>

                            {mustVerifyEmail &&
                                auth.user.email_verified_at === null && (
                                    <div>
                                        <p className="-mt-4 text-sm text-muted-foreground">
                                            Your email address is unverified.{' '}
                                            <Link
                                                href={send()}
                                                as="button"
                                                className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                            >
                                                Click here to re-send the
                                                verification email.
                                            </Link>
                                        </p>

                                        {status ===
                                            'verification-link-sent' && (
                                            <div className="mt-2 text-sm font-medium text-green-600">
                                                A new verification link has been
                                                sent to your email address.
                                            </div>
                                        )}
                                    </div>
                                )}

                            <div className="flex items-center gap-4">
                                <Button
                                    disabled={processing}
                                    data-test="update-profile-button"
                                >
                                    Save
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>

            {/* Trust & Safety Section */}
            <div className="space-y-6 pt-6 border-t mt-6">
                <Heading
                    variant="small"
                    title="Kepercayaan & Keamanan (Trust & Safety)"
                    description="Tingkatkan kepercayaan profil Anda dengan memverifikasi identitas dan keahlian khusus."
                />

                <div className="bg-muted/30 p-4 rounded-lg border">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-sm">Verifikasi Identitas</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                                {auth.user.is_identity_verified 
                                    ? 'Identitas Anda telah diverifikasi.' 
                                    : 'Upload foto KTP atau Selfie dengan KTP untuk mendapatkan badge Verified.'}
                            </p>
                        </div>
                        {auth.user.is_identity_verified && (
                            <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-md font-medium">Terverifikasi</span>
                        )}
                    </div>
                    
                    {!auth.user.is_identity_verified && (
                        <form 
                            onSubmit={(e) => {
                                e.preventDefault();
                                const form = e.target as HTMLFormElement;
                                const formData = new FormData(form);
                                formData.append('type', 'identity');
                                import('@inertiajs/react').then(({ router }) => {
                                    router.post('/verifications', formData, {
                                        preserveScroll: true,
                                        onSuccess: () => form.reset(),
                                    });
                                });
                            }} 
                            className="space-y-4"
                        >
                            <div className="grid gap-2">
                                <Label htmlFor="identity_doc" className="text-xs">Upload KTP (JPG/PNG/PDF)</Label>
                                <Input id="identity_doc" type="file" name="document" accept=".jpg,.jpeg,.png,.pdf" required className="text-xs" />
                            </div>
                            <Button type="submit" size="sm" variant="secondary">Ajukan Verifikasi Identitas</Button>
                        </form>
                    )}
                </div>

                <div className="bg-muted/30 p-4 rounded-lg border">
                    <div className="mb-4">
                        <h3 className="font-semibold text-sm">Verifikasi Keahlian</h3>
                        <p className="text-xs text-muted-foreground mt-1">Upload sertifikat teknis/keahlian khusus Anda.</p>
                        {auth.user.verified_skills && auth.user.verified_skills.length > 0 && (
                            <div className="mt-2 flex gap-2 flex-wrap">
                                {auth.user.verified_skills.map((skill: string) => (
                                    <span key={skill} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-md font-medium">✓ {skill}</span>
                                ))}
                            </div>
                        )}
                    </div>

                    <form 
                        onSubmit={(e) => {
                            e.preventDefault();
                            const form = e.target as HTMLFormElement;
                            const formData = new FormData(form);
                            formData.append('type', 'skill');
                            import('@inertiajs/react').then(({ router }) => {
                                router.post('/verifications', formData, {
                                    preserveScroll: true,
                                    onSuccess: () => form.reset(),
                                });
                            });
                        }} 
                        className="space-y-4"
                    >
                        <div className="grid gap-2">
                            <Label htmlFor="skill_name" className="text-xs">Nama Keahlian</Label>
                            <Input id="skill_name" name="skill_name" required placeholder="Contoh: Teknisi Listrik Tersertifikasi" className="text-xs" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="skill_doc" className="text-xs">Upload Sertifikat (JPG/PNG/PDF)</Label>
                            <Input id="skill_doc" type="file" name="document" accept=".jpg,.jpeg,.png,.pdf" required className="text-xs" />
                        </div>
                        <Button type="submit" size="sm" variant="secondary">Ajukan Verifikasi Keahlian</Button>
                    </form>
                </div>
            </div>

            <DeleteUser />

            {auth.user.active_mode === 'worker' && (
                <div className="space-y-6 pt-6 border-t mt-6">
                    <Heading
                        variant="small"
                        title="Portofolio"
                        description="Tampilkan hasil pekerjaan Anda sebelumnya untuk menarik pemberi kerja."
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {portfolios?.map((item: any) => (
                            <div key={item.id} className="border rounded-md p-4 relative group">
                                {item.image_path && (
                                    <img src={`/storage/${item.image_path}`} alt={item.title} className="w-full h-32 object-cover rounded-sm mb-3" />
                                )}
                                <h3 className="font-semibold text-sm">{item.title}</h3>
                                {item.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>}
                                <Link
                                    href={`/portfolios/${item.id}`}
                                    method="delete"
                                    as="button"
                                    className="absolute top-2 right-2 bg-rose-500 text-white rounded p-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                                >
                                    Hapus
                                </Link>
                            </div>
                        ))}
                    </div>

                    <form 
                        onSubmit={(e) => {
                            e.preventDefault();
                            const form = e.target as HTMLFormElement;
                            const formData = new FormData(form);
                            router.post('/portfolios', formData, {
                                preserveScroll: true,
                                onSuccess: () => form.reset(),
                            });
                        }} 
                        className="space-y-4 border rounded-lg p-4 bg-muted/20"
                    >
                        <h4 className="text-sm font-semibold">Tambah Portofolio Baru</h4>
                        <div className="grid gap-2">
                            <Label htmlFor="portfolio_title">Judul</Label>
                            <Input id="portfolio_title" name="title" required placeholder="Contoh: Perbaikan Pipa Dapur" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="portfolio_description">Deskripsi</Label>
                            <textarea id="portfolio_description" name="description" className="w-full rounded-md border-input bg-transparent px-3 py-2 text-sm shadow-sm" rows={2} placeholder="Jelaskan pekerjaan yang Anda lakukan..." />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="portfolio_image">Foto</Label>
                            <Input id="portfolio_image" type="file" name="image" accept="image/*" />
                        </div>
                        <Button type="submit" size="sm">Tambah Portofolio</Button>
                    </form>
                </div>
            )}
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Profile settings',
            href: edit(),
        },
    ],
};
