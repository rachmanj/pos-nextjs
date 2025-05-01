import { redirect } from "next/navigation";

import { requireAuth } from "@/lib/auth-utils";
import AppSidebar from "@/components/dashboard/AppSidebar";
import Navbar from "@/components/dashboard/Navbar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireAuth();

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <>
      <AppSidebar user={user} />
      <main className="w-full">
        <Navbar user={{ name: user.name ?? "User" }} />
        <div className="p-3">{children}</div>
      </main>
    </>
  );
}
