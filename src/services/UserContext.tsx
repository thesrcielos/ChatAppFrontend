import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { disconnectWebSocket } from "./MessageService";

interface UserContextType {
  userId: string | null;
  setUserId: Dispatch<SetStateAction<string | null>>;
  isAuthenticated: boolean;
  checkAuth: () => boolean;
  login: () => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem("token")
  );

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "token") {
        localStorage.getItem("token") ? login() : logout();
      }
    };

    const handleTokenChanged = () => {
      console.log("Token changed event triggered");
      localStorage.getItem("token") ? login() : logout();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("token-changed", handleTokenChanged);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("token-changed", handleTokenChanged);
    };
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  const login = () => setIsAuthenticated(true);

  const logout = () => {
    removeToken();
    disconnectWebSocket();
    setIsAuthenticated(false);
  };

  return (
    <UserContext.Provider
      value={{ userId, setUserId, isAuthenticated, checkAuth, login, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

// 5. Hook de acceso
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// 6. Métodos auxiliares
export const setToken = (token: string) => {
  localStorage.setItem("token", token);
  window.dispatchEvent(new Event("token-changed"));
};

export const removeToken = () => {
  localStorage.removeItem("token");
  window.dispatchEvent(new Event("token-changed"));
};
