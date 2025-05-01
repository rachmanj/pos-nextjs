import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "./auth";
import { UserRole } from "../generated/prisma";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

// Check if user is authenticated, if not redirect to sign in
export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return user;
}

// Check if user has the required role, if not redirect to unauthorized page
export async function requireRole(roles: UserRole[]) {
  const user = await requireAuth();

  if (!roles.includes(user.role)) {
    redirect("/unauthorized");
  }

  return user;
}

// Helper functions for specific roles
export async function requireOwner() {
  return await requireRole([UserRole.OWNER]);
}

export async function requireShopkeeper() {
  return await requireRole([UserRole.OWNER, UserRole.SHOPKEEPER]);
}

export async function requireWarehouse() {
  return await requireRole([UserRole.OWNER, UserRole.WAREHOUSE]);
}
