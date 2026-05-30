import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'resident';

interface AuthContextType {
  userRole: UserRole;
  toggleRole: () => void;
  setRole: (role: UserRole) => void;
  isAdmin: boolean;
  isResident: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>('resident');

  const toggleRole = () => {
    setUserRole((prev) => (prev === 'admin' ? 'resident' : 'admin'));
  };

  const setRole = (role: UserRole) => {
    setUserRole(role);
  };

  const value: AuthContextType = {
    userRole,
    toggleRole,
    setRole,
    isAdmin: userRole === 'admin',
    isResident: userRole === 'resident',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
