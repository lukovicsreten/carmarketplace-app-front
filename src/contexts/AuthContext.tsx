import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthResponseDto, LoginRequestDto, RegisterRequestDto } from "@/types/api";
import { login as apiLogin, register as apiRegister, deleteOwnAccount as apiDeleteAccount } from "@/services/api";

interface AuthUser {
  token: string;
  userId: number;
  username: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (data: LoginRequestDto) => Promise<AuthResponseDto>;
  register: (data: RegisterRequestDto) => Promise<AuthResponseDto>;
  logout: () => void;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("auth_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("auth_user");
        localStorage.removeItem("auth_token");
      }
    }
  }, []);

  const saveUser = (auth: AuthResponseDto) => {
    const u: AuthUser = {
      token: auth.token,
      userId: auth.userId,
      username: auth.username,
      role: auth.role,
    };
    localStorage.setItem("auth_token", auth.token);
    localStorage.setItem("auth_user", JSON.stringify(u));
    setUser(u);
  };

  const handleLogin = async (data: LoginRequestDto) => {
    const res = await apiLogin(data);
    saveUser(res);
    return res;
  };

  const handleRegister = async (data: RegisterRequestDto) => {
    const res = await apiRegister(data);
    saveUser(res);
    return res;
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setUser(null);
  };

  const deleteAccount = async () => {
    await apiDeleteAccount();
    logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "ADMIN",
        login: handleLogin,
        register: handleRegister,
        logout,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
