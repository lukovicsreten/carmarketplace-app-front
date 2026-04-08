import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { getAdById, updateAd } from "@/services/api";
import { AdRequestDto } from "@/types/api";
import { useToast } from "@/hooks/use-toast";

const EditAd = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<AdRequestDto>({
    title: "", description: "", price: 0, datePosted: "", location: "",
    status: "ACTIVE", imageUrl: "", userId: 1,
    car: { brand: "", make: "", model: "", vin: "", year: 2024, mileage: 0, fuelType: "PETROL", transmission: "MANUAL", enginePower: 0, color: "" },
  });

  useEffect(() => {
    if (!id) return;
    getAdById(parseInt(id))
      .then((ad) => {
        setForm({
          title: ad.title, description: ad.description, price: ad.price,
          datePosted: ad.datePosted, location: ad.location, status: ad.status,
          imageUrl: ad.imageUrl, userId: ad.userId,
          car: {
            brand: ad.car.brand, make: ad.car.make, model: ad.car.model,
            vin: ad.car.vin, year: ad.car.year, mileage: ad.car.mileage,
            fuelType: ad.car.fuelType, transmission: ad.car.transmission,
            enginePower: ad.car.enginePower, color: ad.car.color,
          },
        });
      })
      .catch((err) => toast({ title: "Error", description: err.message, variant: "destructive" }))
      .finally(() => setLoading(false));
  }, [id]);

  const updateField = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateCarField = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, car: { ...prev.car, [field]: value } }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    try {
      await updateAd(parseInt(id), form);
      toast({ title: "Success", description: "Ad updated successfully!" });
      navigate(`/ad/${id}`);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-xl text-muted-foreground">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Link to={`/ad/${id}`}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2" size={20} /> Back to Ad
          </Button>
        </Link>
        <h1 className="text-4xl font-bold mb-8">Edit Ad</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader><CardTitle>Ad Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label htmlFor="title">Title *</Label><Input id="title" value={form.title} onChange={(e) => updateField("title", e.target.value)} maxLength={150} /></div>
              <div><Label htmlFor="description">Description</Label><Textarea id="description" value={form.description} onChange={(e) => updateField("description", e.target.value)} rows={4} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label htmlFor="price">Price ($)</Label><Input id="price" type="number" min={1} value={form.price || ""} onChange={(e) => updateField("price", Number(e.target.value))} /></div>
                <div><Label htmlFor="location">Location</Label><Input id="location" value={form.location} onChange={(e) => updateField("location", e.target.value)} /></div>
              </div>
              <div><Label htmlFor="imageUrl">Image URL</Label><Input id="imageUrl" value={form.imageUrl} onChange={(e) => updateField("imageUrl", e.target.value)} maxLength={500} /></div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => updateField("status", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="SOLD">Sold</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Car Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Brand</Label><Input value={form.car.brand} onChange={(e) => updateCarField("brand", e.target.value)} /></div>
                <div><Label>Make</Label><Input value={form.car.make} onChange={(e) => updateCarField("make", e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Model</Label><Input value={form.car.model} onChange={(e) => updateCarField("model", e.target.value)} /></div>
                <div><Label>VIN</Label><Input value={form.car.vin} onChange={(e) => updateCarField("vin", e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><Label>Year</Label><Input type="number" value={form.car.year} onChange={(e) => updateCarField("year", Number(e.target.value))} /></div>
                <div><Label>Mileage (km)</Label><Input type="number" value={form.car.mileage || ""} onChange={(e) => updateCarField("mileage", Number(e.target.value))} /></div>
                <div><Label>Engine Power (HP)</Label><Input type="number" value={form.car.enginePower || ""} onChange={(e) => updateCarField("enginePower", Number(e.target.value))} /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Fuel Type</Label>
                  <Select value={form.car.fuelType} onValueChange={(v) => updateCarField("fuelType", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PETROL">Petrol</SelectItem>
                      <SelectItem value="DIESEL">Diesel</SelectItem>
                      <SelectItem value="ELECTRIC">Electric</SelectItem>
                      <SelectItem value="HYBRID">Hybrid</SelectItem>
                      <SelectItem value="LPG">LPG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Transmission</Label>
                  <Select value={form.car.transmission} onValueChange={(v) => updateCarField("transmission", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MANUAL">Manual</SelectItem>
                      <SelectItem value="AUTOMATIC">Automatic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Color</Label><Input value={form.car.color} onChange={(e) => updateCarField("color", e.target.value)} /></div>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditAd;
