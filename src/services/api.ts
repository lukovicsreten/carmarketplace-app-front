import { AdResponseDto, AdRequestDto, CommentResponseDto, CommentRequestDto, UserResponseDto, UserRequestDto, CarResponseDto, CarRequestDto, LoginRequestDto, RegisterRequestDto, AuthResponseDto, AdSearchParams } from "@/types/api";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:9000/api";

function getToken(): string | null {
  return localStorage.getItem("auth_token");
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options?.headers as Record<string, string>) || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `API error: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

async function fetchFormData<T>(url: string, formData: FormData): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${url}`, {
    method: "POST",
    headers,
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `API error: ${res.status}`);
  }
  return res.json();
}

// Auth
export const login = (data: LoginRequestDto) =>
  fetchJson<AuthResponseDto>("/auth/login", { method: "POST", body: JSON.stringify(data) });
export const register = (data: RegisterRequestDto) =>
  fetchJson<AuthResponseDto>("/auth/register", { method: "POST", body: JSON.stringify(data) });
export const deleteOwnAccount = () =>
  fetchJson<void>("/auth/me", { method: "DELETE" });

// Ads
export const getAds = () => fetchJson<AdResponseDto[]>("/ads");
export const getAdById = (id: number) => fetchJson<AdResponseDto>(`/ads/${id}`);
export const getAdsByUser = (userId: number) => fetchJson<AdResponseDto[]>(`/ads/user/${userId}`);
export const createAd = (data: AdRequestDto) =>
  fetchJson<AdResponseDto>("/ads", { method: "POST", body: JSON.stringify(data) });
export const updateAd = (id: number, data: AdRequestDto) =>
  fetchJson<AdResponseDto>(`/ads/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteAd = (id: number) =>
  fetchJson<void>(`/ads/${id}`, { method: "DELETE" });

export const searchAds = (params: AdSearchParams) => {
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== "" && v !== null)
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join("&");
  return fetchJson<AdResponseDto[]>(`/ads/search?${query}`);
};

export const uploadAdImage = (adId: number, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return fetchFormData<AdResponseDto>(`/ads/${adId}/image`, formData);
};

export const getAdImageUrl = (adId: number) => `${API_BASE}/ads/${adId}/image`;

// Cars
export const getCarBrands = () => fetchJson<string[]>("/cars/brands");
export const getCars = () => fetchJson<CarResponseDto[]>("/cars");
export const getCarById = (id: number) => fetchJson<CarResponseDto>(`/cars/${id}`);
export const updateCar = (id: number, data: CarRequestDto) =>
  fetchJson<CarResponseDto>(`/cars/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteCar = (id: number) =>
  fetchJson<void>(`/cars/${id}`, { method: "DELETE" });

// Comments
export const getCommentsByAd = (adId: number) => fetchJson<CommentResponseDto[]>(`/comments/ad/${adId}`);
export const getCommentsByUser = (userId: number) => fetchJson<CommentResponseDto[]>(`/comments/user/${userId}`);
export const getCommentById = (id: number) => fetchJson<CommentResponseDto>(`/comments/${id}`);
export const getAllComments = () => fetchJson<CommentResponseDto[]>("/comments");
export const createComment = (data: CommentRequestDto) =>
  fetchJson<CommentResponseDto>("/comments", { method: "POST", body: JSON.stringify(data) });
export const updateComment = (id: number, data: CommentRequestDto) =>
  fetchJson<CommentResponseDto>(`/comments/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteComment = (id: number) =>
  fetchJson<void>(`/comments/${id}`, { method: "DELETE" });

// Users (ADMIN only)
export const getUsers = () => fetchJson<UserResponseDto[]>("/users");
export const getUserById = (id: number) => fetchJson<UserResponseDto>(`/users/${id}`);
export const createUser = (data: UserRequestDto) =>
  fetchJson<UserResponseDto>("/users", { method: "POST", body: JSON.stringify(data) });
export const updateUser = (id: number, data: UserRequestDto) =>
  fetchJson<UserResponseDto>(`/users/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteUser = (id: number) =>
  fetchJson<void>(`/users/${id}`, { method: "DELETE" });
export const searchUsers = (name: string) =>
  fetchJson<UserResponseDto[]>(`/users/search?name=${encodeURIComponent(name)}`);
export const getUserByEmail = (email: string) =>
  fetchJson<UserResponseDto>(`/users/email/${encodeURIComponent(email)}`);
