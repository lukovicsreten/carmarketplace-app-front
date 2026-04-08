import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { RegisterRequestDto } from "@/types/api";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<RegisterRequestDto>({
    username: "", email: "", password: "", firstName: "", lastName: "", phone: "",
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) {
      toast({ title: "Greška", description: "Korisničko ime, email i lozinka su obavezni.", variant: "destructive" });
      return;
    }
    if (form.password.length < 6) {
      toast({ title: "Greška", description: "Lozinka mora imati najmanje 6 karaktera.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await register(form);
      toast({ title: "Uspešno", description: `Nalog kreiran! Dobrodošli, ${res.username}.` });
      navigate("/");
    } catch (err: any) {
      toast({ title: "Greška", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2" size={20} /> Nazad
          </Button>
        </Link>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Registracija</CardTitle>
            <CardDescription>Kreirajte nalog za postavljanje oglasa</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label htmlFor="firstName">Ime</Label><Input id="firstName" value={form.firstName} onChange={(e) => updateField("firstName", e.target.value)} /></div>
                <div><Label htmlFor="lastName">Prezime</Label><Input id="lastName" value={form.lastName} onChange={(e) => updateField("lastName", e.target.value)} /></div>
              </div>
              <div><Label htmlFor="username">Korisničko ime *</Label><Input id="username" value={form.username} onChange={(e) => updateField("username", e.target.value)} /></div>
              <div><Label htmlFor="email">Email *</Label><Input id="email" type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} /></div>
              <div><Label htmlFor="password">Lozinka *</Label><Input id="password" type="password" value={form.password} onChange={(e) => updateField("password", e.target.value)} /></div>
              <div><Label htmlFor="phone">Telefon</Label><Input id="phone" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} /></div>
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Kreiranje..." : "Registruj se"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Već imate nalog?{" "}
                <Link to="/login" className="text-primary hover:underline">Prijavite se</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
