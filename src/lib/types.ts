// We're defining our own UserRole enum to match what's in Prisma
export enum UserRole {
  OWNER = "OWNER",
  SHOPKEEPER = "SHOPKEEPER",
  WAREHOUSE = "WAREHOUSE",
}

// Auth types
declare module "next-auth" {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    role: UserRole;
    image?: string | null;
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
  }
}

// Form types
export interface SignInFormValues {
  email: string;
  password: string;
}

export interface SignUpFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type Category = {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdById?: string | null;
  creator?: {
    id: string;
    name?: string | null;
    email?: string | null;
  } | null;
};

export type Inventory = {
  id: string;
  itemCode: string;
  barcode?: string | null;
  itemDesc: string;
  salePrice: number;
  costPrice: number;
  stock: number;
  categoryId?: string | null;
  category?: Category | null;
  supplier?: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdById?: string | null;
  creator?: {
    id: string;
    name?: string | null;
    email?: string | null;
  } | null;
};
