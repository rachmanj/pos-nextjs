"use client";

import React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  Home,
  LucideIcon,
  Truck,
  Package,
  Store,
  Users,
  LogOut,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

// we're defining our own UserRole enum to match what's in Prisma
enum UserRole {
  OWNER = "OWNER",
  SHOPKEEPER = "SHOPKEEPER",
  WAREHOUSE = "WAREHOUSE",
}

interface NavItemProps {
  href: string;
  title: string;
  icon: LucideIcon;
  isActive?: boolean;
}

function NavItem({ href, title, icon: Icon, isActive }: NavItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={title} size="sm">
        <Link href={href} className="flex items-center gap-2">
          <Icon className="h-4 w-4 shrink-0" />
          <span>{title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

interface DashboardNavProps {
  user: {
    role: UserRole;
    name?: string | null;
    email?: string | null;
  };
}

const AppSidebar = ({ user }: DashboardNavProps) => {
  const pathname = usePathname();
  const { role } = user;

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
      show: true,
    },
    {
      title: "Persediaan",
      href: "/dashboard/inventory",
      icon: Package,
      show: true,
    },
    {
      title: "Penjualan",
      href: "/dashboard/penjualan",
      icon: Store,
      show: role === UserRole.OWNER || role === UserRole.SHOPKEEPER,
    },
    {
      title: "Pembelian",
      href: "/dashboard/pembelian",
      icon: Truck,
      show: role === UserRole.OWNER || role === UserRole.WAREHOUSE,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      show: role === UserRole.OWNER,
    },
    {
      title: "Users",
      href: "/dashboard/users",
      icon: Users,
      show: role === UserRole.OWNER,
    },
  ].filter((item) => item.show);
  return (
    <Sidebar
      collapsible="icon"
      style={
        {
          "--sidebar-width": "12rem",
          "--sidebar-width-icon": "2.5rem",
        } as React.CSSProperties
      }
      className="border-r"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="VASIA Stationery" size="sm">
              <h1 className="font-bold text-sm">
                <span>VASIA</span>
                <span className="group-data-[collapsible=icon]:hidden">
                  {" "}
                  Stationery
                </span>
              </h1>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs py-1">
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <NavItem
                  key={item.href}
                  {...item}
                  isActive={pathname === item.href}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Sign Out" size="sm">
              <Button
                variant="outline"
                className="w-full cursor-pointer text-xs"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="h-3.5 w-3.5 mr-2" />
                <span>Sign Out</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
