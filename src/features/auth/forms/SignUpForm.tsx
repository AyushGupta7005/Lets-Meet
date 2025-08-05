"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import React, { useState } from "react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { OctagonAlertIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaGoogle, FaGithub } from "react-icons/fa";
const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: SignUpFormData) {
    setIsLoading(true);
    setError(null);

    try {
      await authClient.signUp.email(
        {
          name: data.name,
          email: data.email,
          password: data.password,
          callbackURL: "/",
        },
        {
          onSuccess: () => {
            form.reset();
            router.push("/");
            setIsLoading(false);
          },
          onError: (error) => {
            setError(error.error.message);
            setIsLoading(false);
          },
        }
      );
    } catch (error: unknown) {
      console.error("Sign up error:", error);
      setError("An error occurred during sign up. Please try again.");
      setIsLoading(false);
    }
  }
  async function onSocialSubmit(provider: string) {
    setIsLoading(true);
    setError(null);

    try {
      await authClient.signIn.social(
        {
          provider,
          callbackURL: "/",
        },
        {
          onSuccess: () => {
            form.reset();
            router.push("/");
            setIsLoading(false);
          },
          onError: (error) => {
            setError(error.error.message);
            setIsLoading(false);
          },
        }
      );
    } catch (error: unknown) {
      console.error("Sign in error:", error);
      setError("An error occurred during sign in. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 p-6 md:p-8"
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold">Create an Account</h1>
            <p className="text-muted-foreground text-balance">
              Join us to get started.
            </p>
          </div>
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="abc@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {error && (
            <Alert className="bg-destructive/10 border-none">
              <OctagonAlertIcon className="h-4 w-4 !text-destructive" />
              <AlertTitle className="text-destructive">{error}</AlertTitle>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting || isLoading}
          >
            {form.formState.isSubmitting || isLoading
              ? "Signing Up..."
              : "Sign Up"}
          </Button>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-card text-muted-foreground relative z-10 px-2">
              Or continue with
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={"outline"}
              className="w-full cursor-pointer"
              type="button"
              onClick={() => onSocialSubmit("google")}
              disabled={isLoading || form.formState.isSubmitting}
            >
              <FaGoogle />
              <span className="text-sm">Google</span>
            </Button>
            <Button
              variant={"outline"}
              className="w-full cursor-pointer"
              type="button"
              onClick={() => onSocialSubmit("github")}
              disabled={isLoading || form.formState.isSubmitting}
            >
              <FaGithub />
              <span className="text-sm">GitHub</span>
            </Button>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href={"/login"}
              className="underline-offset-4 underline hover:text-primary"
            >
              Login
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
}
