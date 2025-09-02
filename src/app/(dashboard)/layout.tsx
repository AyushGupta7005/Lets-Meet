import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardNavbar from "@/features/dashboard/components/DashboardNavbar";
import DashboardSidebar from "@/features/dashboard/components/DashboardSidebar";
import React from "react";

export default function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="bg-muted flex h-screen w-screen flex-col">
        <DashboardNavbar />
        {children}
      </main>
    </SidebarProvider>
  );
}
