// Types matching Spring Boot DTOs

export interface CarResponseDto {
  id: number;
  brand: string;
  make: string;
  model: string;
  vin: string;
  year: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  enginePower: number;
  color: string;
}

export interface AdResponseDto {
  id: number;
  title: string;
  description: string;
  price: number;
  datePosted: string;
  location: string;
  status: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  username: string;
  car: CarResponseDto;
  commentCount: number;
}

export interface UserResponseDto {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  createdAt: string;
}

export interface CommentResponseDto {
  id: number;
  content: string;
  text: string;
  datePosted: string;
  rating: number;
  createdAt: string;
  userId: number;
  username: string;
  adId: number;
}

// Request DTOs
export interface CarRequestDto {
  brand: string;
  make: string;
  model: string;
  vin: string;
  year: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  enginePower: number;
  color: string;
}

export interface AdRequestDto {
  title: string;
  description: string;
  price: number;
  datePosted: string;
  location: string;
  status: string;
  imageUrl: string;
  userId: number;
  car: CarRequestDto;
}

export interface CommentRequestDto {
  content: string;
  text: string;
  datePosted: string;
  rating: number;
  userId: number;
  adId: number;
}

export interface UserRequestDto {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
}

// Auth DTOs
export interface LoginRequestDto {
  username: string;
  password: string;
}

export interface RegisterRequestDto {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface AuthResponseDto {
  token: string;
  userId: number;
  username: string;
  role: string;
}

// Search params
export interface AdSearchParams {
  brand?: string;
  model?: string;
  yearFrom?: number;
  yearTo?: number;
  mileageMax?: number;
  fuelType?: string;
  vehicleType?: string;
  transmission?: string;
  engineDisplacementMin?: number;
  engineDisplacementMax?: number;
  priceMin?: number;
  priceMax?: number;
  make?: string;
  enginePowerMin?: number;
  enginePowerMax?: number;
  color?: string;
}
