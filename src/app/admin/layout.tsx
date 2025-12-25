"use client";

import { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Navbar } from "@/components/Navbar";
import { AppSidebar } from "@/components/Sidebar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />

      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        {/* Add padding-top on mobile so content starts below navbar */}
        <SidebarInset className="pt-14 md:pt-0">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
