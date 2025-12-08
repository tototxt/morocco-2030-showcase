import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: "admin" | "client";
  createdAt: string;
}

interface AuthSession {
  isLoggedIn: boolean;
  userRole: "admin" | "client" | null;
  email: string | null;
  fullName: string | null;
}

interface AuthContextType {
  session: AuthSession;
  users: User[];
  login: (email: string, password: string) => { success: boolean; error?: string };
  signUp: (fullName: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  clearAllUsers: () => void;
  getSessionData: () => AuthSession;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = "morocco2030_users";
const SESSION_KEY = "morocco2030_session";

// Default admin account
const DEFAULT_ADMIN: User = {
  id: "admin-001",
  fullName: "Master Admin",
  email: "master@admin2030.com",
  password: "admin123",
  role: "admin",
  createdAt: new Date().toISOString(),
};

const isAdminEmail = (email: string): boolean => {
  return email.toLowerCase().endsWith("@admin2030.com");
};

const getStoredUsers = (): User[] => {
  const stored = localStorage.getItem(USERS_KEY);
  if (!stored) {
    // Initialize with default admin
    localStorage.setItem(USERS_KEY, JSON.stringify([DEFAULT_ADMIN]));
    return [DEFAULT_ADMIN];
  }
  const users = JSON.parse(stored);
  // Ensure default admin exists
  const hasDefaultAdmin = users.some((u: User) => u.email === DEFAULT_ADMIN.email);
  if (!hasDefaultAdmin) {
    users.push(DEFAULT_ADMIN);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
  return users;
};

const getStoredSession = (): AuthSession => {
  const stored = localStorage.getItem(SESSION_KEY);
  if (!stored) {
    return { isLoggedIn: false, userRole: null, email: null, fullName: null };
  }
  return JSON.parse(stored);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [session, setSession] = useState<AuthSession>({
    isLoggedIn: false,
    userRole: null,
    email: null,
    fullName: null,
  });

  useEffect(() => {
    setUsers(getStoredUsers());
    setSession(getStoredSession());
  }, []);

  const saveUsers = (newUsers: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(newUsers));
    setUsers(newUsers);
  };

  const saveSession = (newSession: AuthSession) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
    setSession(newSession);
  };

  const login = (email: string, password: string): { success: boolean; error?: string } => {
    const currentUsers = getStoredUsers();
    const user = currentUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      return { success: false, error: "Invalid credentials" };
    }

    const newSession: AuthSession = {
      isLoggedIn: true,
      userRole: user.role,
      email: user.email,
      fullName: user.fullName,
    };

    saveSession(newSession);
    return { success: true };
  };

  const signUp = (
    fullName: string,
    email: string,
    password: string
  ): { success: boolean; error?: string } => {
    // Check if trying to sign up as admin
    if (isAdminEmail(email)) {
      return { success: false, error: "Admin accounts cannot be created through sign up" };
    }

    const currentUsers = getStoredUsers();

    // Check if email already exists
    if (currentUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: "Email already registered" };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      fullName,
      email,
      password,
      role: "client",
      createdAt: new Date().toISOString(),
    };

    saveUsers([...currentUsers, newUser]);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setSession({ isLoggedIn: false, userRole: null, email: null, fullName: null });
  };

  const clearAllUsers = () => {
    localStorage.setItem(USERS_KEY, JSON.stringify([DEFAULT_ADMIN]));
    setUsers([DEFAULT_ADMIN]);
  };

  const getSessionData = (): AuthSession => {
    return getStoredSession();
  };

  return (
    <AuthContext.Provider
      value={{ session, users, login, signUp, logout, clearAllUsers, getSessionData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
