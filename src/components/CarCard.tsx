import { AdResponseDto } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Fuel, Gauge, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

interface CarCardProps {
  ad: AdResponseDto;
}

const CarCard = ({ ad }: CarCardProps) => {
  const { car } = ad;

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative h-64 overflow-hidden">
        <img
          src={ad.imageUrl || "/placeholder.svg"}
          alt={ad.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
          {car.year}
        </Badge>
      </div>

      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-card-foreground mb-1">
            {car.brand} {car.model}
          </h3>
          <p className="text-3xl font-bold text-primary">
            ${ad.price.toLocaleString()}
          </p>
        </div>

        <div className="flex gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Gauge size={16} />
            <span>{car.mileage?.toLocaleString()} km</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel size={16} />
            <span>{car.fuelType}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>{car.year}</span>
          </div>
        </div>

        <p className="text-muted-foreground line-clamp-2">{ad.description}</p>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Link to={`/ad/${ad.id}`} className="w-full">
          <Button className="w-full" size="lg">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CarCard;
