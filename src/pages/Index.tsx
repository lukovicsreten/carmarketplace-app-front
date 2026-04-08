import { useState, useMemo, useEffect } from "react";
import Hero from "@/components/Hero";
import CarCard from "@/components/CarCard";
import FilterBar from "@/components/FilterBar";
import { AdResponseDto, AdSearchParams } from "@/types/api";
import { getAds, searchAds } from "@/services/api";

const Index = () => {
  const [ads, setAds] = useState<AdResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<AdSearchParams>({});

  const fetchAds = async () => {
    setLoading(true);
    setError(null);
    try {
      const hasFilters = Object.values(filters).some(v => v !== undefined && v !== "" && v !== null);
      const data = hasFilters ? await searchAds(filters) : await getAds();
      setAds(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAds(); }, [filters]);

  const filteredAds = useMemo(() => {
    if (!searchTerm) return ads;
    return ads.filter(ad => {
      const car = ad.car;
      return car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.title.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [ads, searchTerm]);

  return (
    <div className="min-h-screen bg-background">
      <Hero onSearch={setSearchTerm} />

      <FilterBar filters={filters} onFiltersChange={setFilters} />

      <section className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">Učitavanje oglasa...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-xl text-destructive">Greška: {error}</p>
            <p className="text-muted-foreground mt-2">Proverite da li je backend pokrenut.</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">
                {filteredAds.length} {filteredAds.length === 1 ? 'Oglas' : 'Oglasa'}
              </h2>
              {searchTerm && <p className="text-muted-foreground">Rezultati za "{searchTerm}"</p>}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAds.map(ad => (
                <CarCard key={ad.id} ad={ad} />
              ))}
            </div>

            {filteredAds.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">
                  Nema oglasa koji odgovaraju vašim kriterijumima.
                </p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Index;
