"use client";

import { getUserRole } from "@/lib/supabase/supabaseRequests";
import { useAuth } from "@clerk/nextjs";
import { createContext, useContext, useEffect, useState } from "react";

type RoleContextProvideProps = {
  children: React.ReactNode;
};

type RoleContext = {
  role: string;
  setRole: React.Dispatch<React.SetStateAction<string>>;
};

const RoleContext = createContext<RoleContext | null>(null);

const RoleContextProvider = ({ children }: RoleContextProvideProps) => {
  const [role, setRole] = useState<string>("student");

  const { isLoaded, userId: maybeUserId, sessionId, getToken } = useAuth();
  const userId = maybeUserId || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken({ template: "supabase" });
        const roleName = await getUserRole({ userId, token });
        setRole(roleName.data || "student");
      } catch (error) {
        console.error("Error fetching token or role:", error);
        // Handle error appropriately, e.g., set a default role or show an error message
      }
    };

    fetchData();
  }, []);

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

const useRoleContext = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRoleContext must be used inside RoleContextProvider");
  }
  return context;
};

export { RoleContext, RoleContextProvider, useRoleContext };
