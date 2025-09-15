
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { UserRole } from "@/lib/types";

type UserContextType = {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isTeacher: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>("teacher");

  return (
    <UserContext.Provider value={{ role, setRole, isTeacher: role === 'teacher' }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
