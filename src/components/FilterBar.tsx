import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AdSearchParams } from "@/types/api";
import { useState } from "react";
import { X } from "lucide-react";

interface FilterBarProps {
  filters: AdSearchParams;
  onFiltersChange: (filters: AdSearchParams) => void;
}

const FilterBar = ({ filters, onFiltersChange }: FilterBarProps) => {
  const [expanded, setExpanded] = useState(false);

  const update = (key: keyof AdSearchParams, value: string | number | undefined) => {
    const next = { ...filters, [key]: value || undefined };
    onFiltersChange(next);
  };

  const clearFilters = () => onFiltersChange({});

  const hasFilters = Object.values(filters).some(v => v !== undefined && v !== "" && v !== null);

  return (
    <div className="bg-card border-b border-border py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-3">
          <Button variant="outline" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? "Sakrij filtere" : "Prikaži filtere"}
          </Button>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X size={14} className="mr-1" /> Očisti filtere
            </Button>
          )}
        </div>

        {expanded && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <div>
              <Label className="text-xs">Brend</Label>
              <Input placeholder="npr. BMW" value={filters.brand || ""} onChange={(e) => update("brand", e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">Model</Label>
              <Input placeholder="npr. 320d" value={filters.model || ""} onChange={(e) => update("model", e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">God. od</Label>
              <Input type="number" placeholder="2015" value={filters.yearFrom || ""} onChange={(e) => update("yearFrom", e.target.value ? Number(e.target.value) : undefined)} />
            </div>
            <div>
              <Label className="text-xs">God. do</Label>
              <Input type="number" placeholder="2024" value={filters.yearTo || ""} onChange={(e) => update("yearTo", e.target.value ? Number(e.target.value) : undefined)} />
            </div>
            <div>
              <Label className="text-xs">Max km</Label>
              <Input type="number" placeholder="200000" value={filters.mileageMax || ""} onChange={(e) => update("mileageMax", e.target.value ? Number(e.target.value) : undefined)} />
            </div>
            <div>
              <Label className="text-xs">Gorivo</Label>
              <Select value={filters.fuelType || "all"} onValueChange={(v) => update("fuelType", v === "all" ? undefined : v)}>
                <SelectTrigger><SelectValue placeholder="Svi" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Svi</SelectItem>
                  <SelectItem value="PETROL">Benzin</SelectItem>
                  <SelectItem value="DIESEL">Dizel</SelectItem>
                  <SelectItem value="ELECTRIC">Električni</SelectItem>
                  <SelectItem value="HYBRID">Hibrid</SelectItem>
                  <SelectItem value="LPG">TNG</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Menjač</Label>
              <Select value={filters.transmission || "all"} onValueChange={(v) => update("transmission", v === "all" ? undefined : v)}>
                <SelectTrigger><SelectValue placeholder="Svi" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Svi</SelectItem>
                  <SelectItem value="MANUAL">Manuelni</SelectItem>
                  <SelectItem value="AUTOMATIC">Automatski</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Cena od</Label>
              <Input type="number" placeholder="0" value={filters.priceMin || ""} onChange={(e) => update("priceMin", e.target.value ? Number(e.target.value) : undefined)} />
            </div>
            <div>
              <Label className="text-xs">Cena do</Label>
              <Input type="number" placeholder="50000" value={filters.priceMax || ""} onChange={(e) => update("priceMax", e.target.value ? Number(e.target.value) : undefined)} />
            </div>
            <div>
              <Label className="text-xs">Snaga od (KS)</Label>
              <Input type="number" placeholder="100" value={filters.enginePowerMin || ""} onChange={(e) => update("enginePowerMin", e.target.value ? Number(e.target.value) : undefined)} />
            </div>
            <div>
              <Label className="text-xs">Snaga do (KS)</Label>
              <Input type="number" placeholder="300" value={filters.enginePowerMax || ""} onChange={(e) => update("enginePowerMax", e.target.value ? Number(e.target.value) : undefined)} />
            </div>
            <div>
              <Label className="text-xs">Boja</Label>
              <Input placeholder="npr. Crna" value={filters.color || ""} onChange={(e) => update("color", e.target.value)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
