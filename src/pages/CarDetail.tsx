import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AdResponseDto, CommentResponseDto, UserResponseDto, CommentRequestDto } from "@/types/api";
import { getAdById, getCommentsByAd, getUserById, createComment, deleteComment, deleteAd, getAdImageUrl } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Phone, Mail, Fuel, Gauge, Calendar, Settings, MapPin, Zap, Palette, Edit, Trash2, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [ad, setAd] = useState<AdResponseDto | null>(null);
  const [seller, setSeller] = useState<UserResponseDto | null>(null);
  const [comments, setComments] = useState<CommentResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState(5);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (!id) return;
    const adId = parseInt(id);
    getAdById(adId)
      .then(async (adData) => {
        setAd(adData);
        const [sellerData, commentsData] = await Promise.all([
          getUserById(adData.userId).catch(() => null),
          getCommentsByAd(adId).catch(() => []),
        ]);
        setSeller(sellerData);
        setComments(commentsData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const isOwner = isAuthenticated && ad && user?.userId === ad.userId;

  const handleDeleteAd = async () => {
    if (!ad || !confirm("Da li ste sigurni da želite da obrišete ovaj oglas?")) return;
    try {
      await deleteAd(ad.id);
      toast({ title: "Obrisano", description: "Oglas je obrisan." });
      navigate("/");
    } catch (err: any) {
      toast({ title: "Greška", description: err.message, variant: "destructive" });
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ad || !commentText.trim() || !isAuthenticated) return;
    setSubmittingComment(true);
    try {
      const data: CommentRequestDto = {
        content: commentText, text: commentText,
        datePosted: new Date().toISOString().split("T")[0],
        rating: commentRating, userId: user!.userId, adId: ad.id,
      };
      const newComment = await createComment(data);
      setComments((prev) => [...prev, newComment]);
      setCommentText("");
      toast({ title: "Uspešno", description: "Komentar postavljen!" });
    } catch (err: any) {
      toast({ title: "Greška", description: err.message, variant: "destructive" });
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm("Obriši komentar?")) return;
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast({ title: "Obrisano", description: "Komentar obrisan." });
    } catch (err: any) {
      toast({ title: "Greška", description: err.message, variant: "destructive" });
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-xl text-muted-foreground">Učitavanje...</p></div>;
  if (error || !ad) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Oglas nije pronađen</h1>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Link to="/"><Button>Nazad na oglase</Button></Link>
      </div>
    </div>
  );

  const { car } = ad;
  const imageUrl = ad.imageUrl ? getAdImageUrl(ad.id) : "/placeholder.svg";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link to="/"><Button variant="ghost"><ArrowLeft className="mr-2" size={20} /> Nazad</Button></Link>
          {isOwner && (
            <div className="flex gap-2">
              <Link to={`/edit-ad/${ad.id}`}><Button variant="outline"><Edit className="mr-2" size={16} /> Izmeni</Button></Link>
              <Button variant="destructive" onClick={handleDeleteAd}><Trash2 className="mr-2" size={16} /> Obriši</Button>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <div className="relative h-[500px] rounded-2xl overflow-hidden">
              <img src={imageUrl} alt={ad.title} className="w-full h-full object-cover" />
            </div>
          </div>

          <div>
            <div className="mb-6">
              <div className="flex gap-2 mb-4">
                <Badge>{car.year}</Badge>
                <Badge variant="outline">{ad.status}</Badge>
                {ad.location && <Badge variant="secondary"><MapPin size={12} className="mr-1" />{ad.location}</Badge>}
              </div>
              <h1 className="text-4xl font-bold mb-2">{ad.title}</h1>
              <p className="text-lg text-muted-foreground mb-2">{car.brand} {car.make} {car.model}</p>
              <p className="text-5xl font-bold text-primary mb-6">€{ad.price.toLocaleString()}</p>
            </div>

            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Specifikacije</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Gauge, label: "Kilometraža", value: `${car.mileage?.toLocaleString()} km` },
                    { icon: Fuel, label: "Gorivo", value: car.fuelType },
                    { icon: Calendar, label: "Godište", value: car.year },
                    { icon: Settings, label: "Menjač", value: car.transmission },
                    { icon: Zap, label: "Snaga", value: `${car.enginePower} KS` },
                    { icon: Palette, label: "Boja", value: car.color },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 rounded-lg"><Icon className="text-primary" size={24} /></div>
                      <div><p className="text-sm text-muted-foreground">{label}</p><p className="font-semibold">{value}</p></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Opis</h2>
                <p className="text-muted-foreground leading-relaxed">{ad.description}</p>
              </CardContent>
            </Card>

            {seller && (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Kontakt prodavca</h2>
                  <div className="mb-4">
                    <Link to={`/user/${seller.id}`} className="hover:underline">
                      <p className="text-lg font-medium mb-1">{seller.firstName} {seller.lastName}</p>
                      <p className="text-sm text-muted-foreground">@{seller.username}</p>
                    </Link>
                  </div>
                  <div className="flex flex-col gap-3">
                    {seller.phone && <Button size="lg" className="w-full" asChild><a href={`tel:${seller.phone}`}><Phone className="mr-2" size={20} /> Pozovi: {seller.phone}</a></Button>}
                    <Button size="lg" variant="outline" className="w-full" asChild><a href={`mailto:${seller.email}?subject=Upit za ${ad.title}`}><Mail className="mr-2" size={20} /> Email: {seller.email}</a></Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Komentari ({comments.length})</h2>
                
                {comments.length > 0 && (
                  <div className="space-y-4 mb-6">
                    {comments.map((comment) => (
                      <div key={comment.id} className="border-b border-border pb-4 last:border-0">
                        <div className="flex justify-between items-center mb-2">
                          <p className="font-medium">{comment.username}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground">{comment.datePosted}</p>
                            {isAuthenticated && (comment.userId === user?.userId) && (
                              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleDeleteComment(comment.id)}>
                                <Trash2 size={14} />
                              </Button>
                            )}
                          </div>
                        </div>
                        <p className="text-muted-foreground">{comment.text || comment.content}</p>
                        {comment.rating && (
                          <div className="flex items-center gap-1 mt-1">
                            <Star size={14} className="text-accent fill-accent" />
                            <span className="text-sm text-accent">{comment.rating}/5</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {isAuthenticated ? (
                  <form onSubmit={handleSubmitComment} className="space-y-3 pt-4 border-t border-border">
                    <h3 className="font-medium">Ostavite komentar</h3>
                    <Textarea placeholder="Napišite komentar..." value={commentText} onChange={(e) => setCommentText(e.target.value)} rows={3} />
                    <div>
                      <Label>Ocena (1-5)</Label>
                      <Input type="number" min={1} max={5} value={commentRating} onChange={(e) => setCommentRating(Number(e.target.value))} className="w-24" />
                    </div>
                    <Button type="submit" disabled={submittingComment || !commentText.trim()}>
                      {submittingComment ? "Slanje..." : "Postavi komentar"}
                    </Button>
                  </form>
                ) : (
                  <div className="pt-4 border-t border-border text-center">
                    <p className="text-muted-foreground mb-2">Prijavite se da ostavite komentar</p>
                    <Link to="/login"><Button variant="outline">Prijavi se</Button></Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;
