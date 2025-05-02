import { Metadata } from "next";
import UserTable from "@/components/dashboard/users/UserTable";
import UserCreateDialog from "@/components/dashboard/users/UserCreateDialog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "User Management",
  description: "Manage users and roles",
};

export default async function UsersPage() {
  const session = await getServerSession(authOptions);

  // Check if user is authenticated and has OWNER role
  if (!session || session.user.role !== "OWNER") {
    redirect("/unauthorized");
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <UserCreateDialog />
      </div>
      <div className="space-y-4">
        <UserTable />
      </div>
    </div>
  );
}
