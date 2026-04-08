import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast({ title: "Greška", description: "Unesite korisničko ime i lozinku.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await login({ username, password });
      toast({ title: "Uspešno", description: "Uspešno ste se prijavili!" });
      navigate("/");
    } catch (err: any) {
      toast({ title: "Greška", description: err.message || "Pogrešno korisničko ime ili lozinka.", variant: "destructive" });
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
            <CardTitle className="text-2xl">Prijava</CardTitle>
            <CardDescription>Prijavite se na svoj nalog</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username">Korisničko ime</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="password">Lozinka</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Prijavljivanje..." : "Prijavi se"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Nemate nalog?{" "}
                <Link to="/register" className="text-primary hover:underline">Registrujte se</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
