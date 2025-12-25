"use client";

import { Calendar,Guitar,Link as LinkIcon,BookImage, ChartColumnIncreasing , Home, Inbox, Search, Settings, Music } from "lucide-react";
import { ModeToggle } from "./modetoggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
     
     <SidebarHeader>
  <div className="flex items-center justify-between px-3">
    <span className="text-sm font-medium truncate">
      Atharva Acharya
    </span>

    {/* Trigger ALWAYS visible */}
    <SidebarTrigger className="rounded-lg border hover:bg-accent" />
  </div>
</SidebarHeader>
      <SidebarContent>
        {/* ----------------- SECTION 1 ----------------- */}
        <SidebarGroup>
          <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>

            <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/dashboard">
                    <Home/>
                    Home
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/analytics">
                    <ChartColumnIncreasing />
                    Analytics
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/links">
                    <LinkIcon />
                    Links
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/content">
                    <BookImage />
                    About
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/releases">
                    <Music />
                    Releases
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


        
      </SidebarContent>
    </Sidebar>
  );
}
