"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;
type SignInFormData = z.infer<typeof signInSchema>;

export default function Home() {
  const { data: session } = authClient.useSession();
  const [formType, setFormType] = useState<"signUp" | "signIn">("signUp");

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  // Reset form when switching between sign up and sign in
  const handleToggle = () => {
    setFormType(formType === "signUp" ? "signIn" : "signUp");
    signUpForm.reset();
    signInForm.reset();
  };

  async function onSignUpSubmit(data: SignUpFormData) {
    try {
      await authClient.signUp.email(
        {
          name: data.name,
          email: data.email,
          password: data.password,
        },
        {
          onSuccess: () => {
            signUpForm.reset();
            setFormType("signIn"); // Reset to sign in form after successful sign up
          },
        }
      );
    } catch (error) {
      console.error("Sign up error:", error);
    }
  }

  async function onSignInSubmit(data: SignInFormData) {
    try {
      await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
        },
        {
          onSuccess: () => {
            signInForm.reset();
          },
        }
      );
    } catch (error) {
      console.error("Sign in error:", error);
    }
  }
  if (session) {
    return (
      <div className="p-10 flex flex-col items-center gap-8">
        <h1 className="text-2xl font-bold mx-auto text-center">
          Welcome back, {session.user.name || "User"}!
        </h1>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => authClient.signOut()}
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mx-auto text-center">
        Welcome to Let&apos;s Meet
      </h1>

      {/* Toggle between Sign Up and Sign In */}
      <div className="max-w-md mx-auto mt-6 flex justify-center">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={handleToggle}
            className={`px-4 py-2 rounded-md transition-colors ${
              formType === "signUp"
                ? "bg-white shadow-sm text-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={handleToggle}
            className={`px-4 py-2 rounded-md transition-colors ${
              formType === "signIn"
                ? "bg-white shadow-sm text-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Sign In
          </button>
        </div>
      </div>

      {formType === "signUp" ? (
        <form
          onSubmit={signUpForm.handleSubmit(onSignUpSubmit)}
          className="max-w-md mx-auto mt-6"
        >
          <p className="text-gray-600 text-center">
            Create your account to get started
          </p>

          <div className="mt-4">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Name"
              className="mt-2"
              {...signUpForm.register("name")}
            />
            {signUpForm.formState.errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {signUpForm.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="mt-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              className="mt-2"
              {...signUpForm.register("email")}
            />
            {signUpForm.formState.errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {signUpForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="mt-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              className="mt-2"
              {...signUpForm.register("password")}
            />
            {signUpForm.formState.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {signUpForm.formState.errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={signUpForm.formState.isSubmitting}
            className="mt-6 w-full"
          >
            {signUpForm.formState.isSubmitting ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>
      ) : (
        <form
          onSubmit={signInForm.handleSubmit(onSignInSubmit)}
          className="max-w-md mx-auto mt-6"
        >
          <p className="text-gray-600 text-center">
            Please sign in to continue
          </p>

          <div className="mt-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              className="mt-2"
              {...signInForm.register("email")}
            />
            {signInForm.formState.errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {signInForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="mt-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              className="mt-2"
              {...signInForm.register("password")}
            />
            {signInForm.formState.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {signInForm.formState.errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={signInForm.formState.isSubmitting}
            className="mt-6 w-full"
          >
            {signInForm.formState.isSubmitting ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      )}
    </div>
  );
}
