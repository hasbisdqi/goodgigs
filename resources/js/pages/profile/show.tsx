import { Head, router, Link } from '@inertiajs/react';
import { Star, Shield, Award, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ReportModal from '@/components/report-modal';
import { dashboard } from '@/routes';
import { cn } from '@/lib/utils';
import type { Auth } from '@/types';

type Review = {
    id: number;
    reviewer_id: number;
    rating: number;
    comment: string;
    created_at: string;
    reviewer?: {
        id: number;
        name: string;
    };
};

type ProfileProps = {
    profileUser: {
        id: number;
        name: string;
        active_mode: string;
        created_at: string;
    };
    stats: {
        average_rating: number;
        total_reviews: number;
        total_endorsements: number;
    };
    reviews: Review[];
    has_endorsed: boolean;
    auth: Auth;
};

export default function PublicProfile({ profileUser, stats, reviews, has_endorsed, auth }: ProfileProps) {
    const isSelf = auth?.user?.id === profileUser.id;

    const handleEndorse = () => {
        router.post(`/user/${profileUser.id}/endorse`, {}, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title={`Profil: ${profileUser.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-4xl mx-auto w-full">
                {/* Header Profile Section */}
                <Card className="border-t-4 border-t-primary shadow-sm overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent"></div>
                    <CardHeader className="pb-4 relative z-10">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="size-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-3xl shadow-md border-4 border-background">
                                    {profileUser.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-bold">{profileUser.name}</CardTitle>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="outline" className="capitalize text-xs font-medium">
                                            {profileUser.active_mode}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Calendar className="size-3" />
                                            Bergabung sejak {new Date(profileUser.created_at).getFullYear()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {!isSelf && auth.user && (
                                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                                    <Button 
                                        onClick={handleEndorse} 
                                        disabled={has_endorsed}
                                        variant={has_endorsed ? "secondary" : "default"}
                                        className="w-full sm:w-auto"
                                    >
                                        <Award className="size-4 mr-2" />
                                        {has_endorsed ? 'Telah Di-Endorse' : 'Endorse Pengguna Ini'}
                                    </Button>
                                    <ReportModal reportableId={profileUser.id} reportableType="App\Models\User" />
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10 pt-0">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                            <div className="bg-muted/30 p-4 rounded-xl border flex flex-col items-center justify-center text-center">
                                <div className="flex items-center gap-1 text-amber-500 mb-1">
                                    <Star className="size-5 fill-current" />
                                    <span className="text-xl font-bold text-foreground">{stats.average_rating}</span>
                                </div>
                                <span className="text-xs text-muted-foreground font-medium">Rata-rata Rating</span>
                            </div>
                            
                            <div className="bg-muted/30 p-4 rounded-xl border flex flex-col items-center justify-center text-center">
                                <div className="text-xl font-bold mb-1">{stats.total_reviews}</div>
                                <span className="text-xs text-muted-foreground font-medium">Total Ulasan</span>
                            </div>
                            
                            <div className="bg-primary/5 border-primary/20 p-4 rounded-xl border flex flex-col items-center justify-center text-center col-span-2 md:col-span-1">
                                <div className="text-xl font-bold mb-1 text-primary flex items-center gap-1">
                                    <Shield className="size-5" />
                                    {stats.total_endorsements}
                                </div>
                                <span className="text-xs text-primary/80 font-medium">Community Endorsements</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Reviews Section */}
                <div className="mt-4">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Star className="size-5 text-amber-500" />
                        Ulasan Pekerjaan ({stats.total_reviews})
                    </h3>
                    
                    {reviews.length === 0 ? (
                        <div className="bg-card border border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center text-muted-foreground">
                            <Star className="size-10 mb-3 opacity-20" />
                            <p className="font-medium text-foreground">Belum ada ulasan</p>
                            <p className="text-sm mt-1">Pengguna ini belum menerima ulasan pekerjaan.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <Card key={review.id} className="shadow-sm">
                                    <CardContent className="p-4 sm:p-5">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex gap-3 w-full">
                                                <div className="size-10 rounded-full bg-muted flex items-center justify-center font-bold shrink-0">
                                                    {review.reviewer?.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                                                        <h4 className="font-semibold text-sm truncate">{review.reviewer?.name}</h4>
                                                        <span className="hidden sm:inline text-muted-foreground text-xs">•</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {new Date(review.created_at).toLocaleDateString(undefined, { 
                                                                year: 'numeric', 
                                                                month: 'long', 
                                                                day: 'numeric' 
                                                            })}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-1 mb-2">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star 
                                                                key={star} 
                                                                className={cn(
                                                                    "size-3.5",
                                                                    star <= review.rating ? "text-amber-500 fill-amber-500" : "text-muted"
                                                                )} 
                                                            />
                                                        ))}
                                                    </div>
                                                    
                                                    {review.comment && (
                                                        <p className="text-sm text-foreground/90 whitespace-pre-wrap mt-2">
                                                            {review.comment}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

PublicProfile.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Profil Pengguna',
        },
    ],
};
