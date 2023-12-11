"use client";

import React from "react";
import { SidebarRoutes } from "./sidebar-routes";
import { UserButton, useUser } from "@clerk/nextjs";

const Sidebar = () => {
  const { user } = useUser();

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
      <UserButton />
      Sidebarrrr
      {JSON.stringify(user)}
      <SidebarRoutes />
    </div>
  );
};

export default Sidebar;
