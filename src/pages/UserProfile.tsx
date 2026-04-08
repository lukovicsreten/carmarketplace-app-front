import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Phone, Calendar, Trash2 } from "lucide-react";
import { getUserById, getAdsByUser, deleteAd, deleteOwnAccount } from "@/services/api";
import { UserResponseDto, AdResponseDto } from "@/types/api";
import CarCard from "@/components/CarCard";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated, logout } = useAuth();
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [ads, setAds] = useState<AdResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = isAuthenticated && authUser && id && authUser.userId === parseInt(id);

  const fetchData = () => {
    if (!id) return;
    const userId = parseInt(id);
    Promise.all([
      getUserById(userId),
      getAdsByUser(userId).catch(() => []),
    ])
      .then(([userData, adsData]) => {
        setUser(userData);
        setAds(adsData);
      })
      .catch(() => toast({ title: "Greška", description: "Korisnik nije pronađen.", variant: "destructive" }))
      .finally(() => setLoading(false));
  };

  useEffect(fetchData, [id]);

  const handleDeleteAd = async (adId: number) => {
    if (!confirm("Da li ste sigurni da želite da obrišete ovaj oglas?")) return;
    try {
      await deleteAd(adId);
      setAds((prev) => prev.filter((a) => a.id !== adId));
      toast({ title: "Obrisano", description: "Oglas je obrisan." });
    } catch (err: any) {
      toast({ title: "Greška", description: err.message, variant: "destructive" });
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Da li ste SIGURNI da želite da obrišete svoj nalog? Ova akcija je nepovratna.")) return;
    try {
      await deleteOwnAccount();
      logout();
      toast({ title: "Obrisano", description: "Vaš nalog je obrisan." });
      navigate("/");
    } catch (err: any) {
      toast({ title: "Greška", description: err.message, variant: "destructive" });
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-xl text-muted-foreground">Učitavanje...</p></div>;
  if (!user) return <div className="min-h-screen flex items-center justify-center"><p className="text-xl">Korisnik nije pronađen</p></div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link to="/"><Button variant="ghost" className="mb-6"><ArrowLeft className="mr-2" size={20} /> Nazad</Button></Link>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl">{user.firstName} {user.lastName}</CardTitle>
                <p className="text-muted-foreground">@{user.username}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">{user.role}</Badge>
                {isOwnProfile && (
                  <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
                    <Trash2 size={14} className="mr-1" /> Obriši nalog
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Mail size={16} />{user.email}</div>
              {user.phone && <div className="flex items-center gap-2"><Phone size={16} />{user.phone}</div>}
              <div className="flex items-center gap-2"><Calendar size={16} />Član od: {user.createdAt?.split("T")[0]}</div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{ads.length} {ads.length === 1 ? "Oglas" : "Oglasa"}</h2>
          {isOwnProfile && <Link to="/create-ad"><Button>Postavi novi oglas</Button></Link>}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <div key={ad.id} className="relative">
              <CarCard ad={ad} />
              {isOwnProfile && (
                <div className="absolute top-2 left-2 flex gap-2 z-10">
                  <Link to={`/edit-ad/${ad.id}`}><Button size="sm" variant="secondary">Izmeni</Button></Link>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteAd(ad.id)}>Obriši</Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
