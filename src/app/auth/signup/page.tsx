import { Metadata } from "next";
import { redirect } from "next/navigation";

import { SignUpForm } from "@/components/auth/signup-form";
import { getSession } from "@/lib/auth-utils";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a new account",
};

export default async function SignUpPage() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Fill in the form below to create your account
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
