"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LucideIcon,
  Store,
  Package,
  BarChart,
  Users,
  Settings,
} from "lucide-react";
import { signOut } from "next-auth/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// We're defining our own UserRole enum to match what's in Prisma
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
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-accent text-accent-foreground"
          : "hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      {title}
    </Link>
  );
}

interface DashboardNavProps {
  user: {
    role: UserRole;
    name?: string | null;
    email?: string | null;
  };
}

export function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname();
  const { role } = user;

  // Define navigation items based on user role
  const navItems = [
    // All roles can see this
    {
      href: "/dashboard",
      title: "Dashboard",
      icon: BarChart,
      show: true,
    },
    // Sales related - for owner and shopkeeper
    {
      href: "/dashboard/sales",
      title: "Sales",
      icon: Store,
      show: role === UserRole.OWNER || role === UserRole.SHOPKEEPER,
    },
    // Inventory related - for owner and warehouse
    {
      href: "/dashboard/inventory",
      title: "Inventory",
      icon: Package,
      show: role === UserRole.OWNER || role === UserRole.WAREHOUSE,
    },
    // Admin only features
    {
      href: "/dashboard/users",
      title: "Users",
      icon: Users,
      show: role === UserRole.OWNER,
    },
    // Settings for all users
    {
      href: "/dashboard/settings",
      title: "Settings",
      icon: Settings,
      show: true,
    },
  ].filter((item) => item.show);

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex flex-col gap-1">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            title={item.title}
            icon={item.icon}
            isActive={pathname === item.href}
          />
        ))}
      </div>
      <div className="mt-auto">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}
