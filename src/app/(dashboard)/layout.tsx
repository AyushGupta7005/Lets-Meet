import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardNavbar from "@/features/dashboard/components/DashboardNavbar";
import DashboardSidebar from "@/features/dashboard/components/DashboardSidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }
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
