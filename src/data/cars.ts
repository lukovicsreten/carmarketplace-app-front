export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  transmission: string;
  description: string;
  images: string[];
  seller: {
    name: string;
    phone: string;
    email: string;
  };
}

export const cars: Car[] = [
  {
    id: "1",
    brand: "Toyota",
    model: "RAV4",
    year: 2021,
    price: 28500,
    mileage: 32000,
    fuel: "Hybrid",
    transmission: "Automatic",
    description: "Excellent condition Toyota RAV4 Hybrid. One owner, full service history. Features include adaptive cruise control, lane departure warning, and premium audio system.",
    images: ["/src/assets/car1.jpg", "/src/assets/car1.jpg", "/src/assets/car1.jpg"],
    seller: {
      name: "John Smith",
      phone: "+1 (555) 123-4567",
      email: "john.smith@email.com"
    }
  },
  {
    id: "2",
    brand: "BMW",
    model: "3 Series",
    year: 2020,
    price: 35900,
    mileage: 28000,
    fuel: "Gasoline",
    transmission: "Automatic",
    description: "Luxury BMW 3 Series in pristine condition. Loaded with premium features including leather seats, navigation system, and sport package.",
    images: ["/src/assets/car2.jpg", "/src/assets/car2.jpg", "/src/assets/car2.jpg"],
    seller: {
      name: "Sarah Johnson",
      phone: "+1 (555) 234-5678",
      email: "sarah.j@email.com"
    }
  },
  {
    id: "3",
    brand: "Porsche",
    model: "911",
    year: 2019,
    price: 89900,
    mileage: 15000,
    fuel: "Gasoline",
    transmission: "Manual",
    description: "Iconic Porsche 911 with low mileage. Perfect condition with full service history. A true driver's car.",
    images: ["/src/assets/car3.jpg", "/src/assets/car3.jpg", "/src/assets/car3.jpg"],
    seller: {
      name: "Michael Brown",
      phone: "+1 (555) 345-6789",
      email: "m.brown@email.com"
    }
  },
  {
    id: "4",
    brand: "Ford",
    model: "F-150",
    year: 2022,
    price: 42000,
    mileage: 18000,
    fuel: "Gasoline",
    transmission: "Automatic",
    description: "Powerful Ford F-150 truck. Perfect for work or adventure. Towing package included.",
    images: ["/src/assets/car4.jpg", "/src/assets/car4.jpg", "/src/assets/car4.jpg"],
    seller: {
      name: "David Wilson",
      phone: "+1 (555) 456-7890",
      email: "d.wilson@email.com"
    }
  },
  {
    id: "5",
    brand: "Honda",
    model: "Civic",
    year: 2021,
    price: 22500,
    mileage: 25000,
    fuel: "Gasoline",
    transmission: "Automatic",
    description: "Reliable Honda Civic in excellent condition. Great fuel economy and modern safety features.",
    images: ["/src/assets/car5.jpg", "/src/assets/car5.jpg", "/src/assets/car5.jpg"],
    seller: {
      name: "Emily Davis",
      phone: "+1 (555) 567-8901",
      email: "emily.d@email.com"
    }
  },
  {
    id: "6",
    brand: "Tesla",
    model: "Model Y",
    year: 2023,
    price: 52000,
    mileage: 8000,
    fuel: "Electric",
    transmission: "Automatic",
    description: "Nearly new Tesla Model Y with full self-driving capability. Premium interior and all the latest tech features.",
    images: ["/src/assets/car6.jpg", "/src/assets/car6.jpg", "/src/assets/car6.jpg"],
    seller: {
      name: "Robert Taylor",
      phone: "+1 (555) 678-9012",
      email: "r.taylor@email.com"
    }
  }
];
