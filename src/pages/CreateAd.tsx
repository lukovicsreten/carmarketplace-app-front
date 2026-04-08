import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { createAd, uploadAdImage, getCarBrands } from "@/services/api";
import { AdRequestDto } from "@/types/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const CreateAd = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [brands, setBrands] = useState<string[]>([]);

  useEffect(() => {
    getCarBrands().then(setBrands).catch(() => {});
  }, []);

  const [form, setForm] = useState<Omit<AdRequestDto, "userId">>({
    title: "",
    description: "",
    price: 0,
    datePosted: new Date().toISOString().split("T")[0],
    location: "",
    status: "ACTIVE",
    imageUrl: "",
    car: {
      brand: "", make: "", model: "", vin: "",
      year: new Date().getFullYear(), mileage: 0,
      fuelType: "PETROL", transmission: "MANUAL", enginePower: 0, color: "",
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Potrebna prijava</h2>
            <p className="text-muted-foreground mb-6">Morate biti prijavljeni da biste postavili oglas.</p>
            <Link to="/login"><Button size="lg">Prijavi se</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const updateField = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateCarField = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, car: { ...prev.car, [field]: value } }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.car.brand || !form.car.model) {
      toast({ title: "Greška", description: "Popunite sva obavezna polja.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const adData: AdRequestDto = { ...form, userId: user!.userId };
      const created = await createAd(adData);

      if (imageFile) {
        await uploadAdImage(created.id, imageFile);
      }

      toast({ title: "Uspešno", description: "Oglas je kreiran!" });
      navigate(`/ad/${created.id}`);
    } catch (err: any) {
      toast({ title: "Greška", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2" size={20} /> Nazad
          </Button>
        </Link>

        <h1 className="text-4xl font-bold mb-8">Postavi Novi Oglas</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader><CardTitle>Detalji Oglasa</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Naslov *</Label>
                <Input id="title" value={form.title} onChange={(e) => updateField("title", e.target.value)} placeholder="npr. BMW 320d 2020 u odličnom stanju" maxLength={150} />
              </div>
              <div>
                <Label htmlFor="description">Opis</Label>
                <Textarea id="description" value={form.description} onChange={(e) => updateField("description", e.target.value)} placeholder="Opišite automobil..." rows={4} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Cena (€) *</Label>
                  <Input id="price" type="number" min={1} value={form.price || ""} onChange={(e) => updateField("price", Number(e.target.value))} />
                </div>
                <div>
                  <Label htmlFor="location">Lokacija</Label>
                  <Input id="location" value={form.location} onChange={(e) => updateField("location", e.target.value)} placeholder="npr. Beograd" />
                </div>
              </div>
              <div>
                <Label htmlFor="image">Slika automobila</Label>
                <div className="flex items-center gap-4">
                  <Input id="image" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                  {imageFile && (
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Upload size={14} /> {imageFile.name}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Detalji Automobila</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Brend *</Label>
                  <Select value={form.car.brand} onValueChange={(v) => updateCarField("brand", v)}>
                    <SelectTrigger><SelectValue placeholder="Izaberite marku" /></SelectTrigger>
                    <SelectContent>
                      {brands.map((b) => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label htmlFor="make">Proizvođač</Label><Input id="make" value={form.car.make} onChange={(e) => updateCarField("make", e.target.value)} placeholder="npr. BMW" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label htmlFor="model">Model *</Label><Input id="model" value={form.car.model} onChange={(e) => updateCarField("model", e.target.value)} placeholder="npr. 320d" /></div>
                <div><Label htmlFor="vin">VIN</Label><Input id="vin" value={form.car.vin} onChange={(e) => updateCarField("vin", e.target.value)} placeholder="Broj šasije" /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><Label htmlFor="year">Godište</Label><Input id="year" type="number" min={1900} max={2030} value={form.car.year} onChange={(e) => updateCarField("year", Number(e.target.value))} /></div>
                <div><Label htmlFor="mileage">Kilometraža</Label><Input id="mileage" type="number" min={0} value={form.car.mileage || ""} onChange={(e) => updateCarField("mileage", Number(e.target.value))} /></div>
                <div><Label htmlFor="enginePower">Snaga (KS)</Label><Input id="enginePower" type="number" min={0} value={form.car.enginePower || ""} onChange={(e) => updateCarField("enginePower", Number(e.target.value))} /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Gorivo</Label>
                  <Select value={form.car.fuelType} onValueChange={(v) => updateCarField("fuelType", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PETROL">Benzin</SelectItem>
                      <SelectItem value="DIESEL">Dizel</SelectItem>
                      <SelectItem value="ELECTRIC">Električni</SelectItem>
                      <SelectItem value="HYBRID">Hibrid</SelectItem>
                      <SelectItem value="LPG">TNG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Menjač</Label>
                  <Select value={form.car.transmission} onValueChange={(v) => updateCarField("transmission", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MANUAL">Manuelni</SelectItem>
                      <SelectItem value="AUTOMATIC">Automatski</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label htmlFor="color">Boja</Label><Input id="color" value={form.car.color} onChange={(e) => updateCarField("color", e.target.value)} placeholder="npr. Crna" /></div>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Kreiranje..." : "Postavi Oglas"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateAd;
