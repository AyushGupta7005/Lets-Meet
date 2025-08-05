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
import { ErrorContext } from "better-auth/react";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const handleAuthResult = {
    onSuccess: () => {
      form.reset();
      router.push("/");
    },
    onError: (error: ErrorContext) => {
      setError(error.error.message);
      setIsLoading(false);
    },
  };

  const handleAuthError = (error: unknown, action: string) => {
    console.error(`${action} error:`, error);
    setError(
      `An error occurred during ${action.toLowerCase()}. Please try again.`
    );
    setIsLoading(false);
  };

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true);
    setError(null);

    try {
      await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
          callbackURL: "/",
        },
        handleAuthResult
      );
    } catch (error: unknown) {
      handleAuthError(error, "Sign in");
    }
  }

  async function onSocialSubmit(provider: string) {
    setIsLoading(true);
    setError(null);

    try {
      await authClient.signIn.social(
        { provider, callbackURL: "/" },
        handleAuthResult
      );
    } catch (error: unknown) {
      handleAuthError(error, "Social sign in");
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
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground text-balance">
              Login in to your account.
            </p>
          </div>
          <div className="grid gap-3">
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
              ? "Logging In..."
              : "Login"}
          </Button>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-card text-muted-foreground relative z-10 px-2">
              Or continue with
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => onSocialSubmit("google")}
              variant={"outline"}
              className="w-full cursor-pointer"
              type="button"
              disabled={isLoading || form.formState.isSubmitting}
            >
              <FaGoogle />
              <span className="text-sm">Google</span>
            </Button>
            <Button
              onClick={() => onSocialSubmit("github")}
              variant={"outline"}
              className="w-full cursor-pointer"
              type="button"
              disabled={isLoading || form.formState.isSubmitting}
            >
              <FaGithub />
              <span className="text-sm">GitHub</span>
            </Button>
          </div>
          <div className="text-center text-sm text-muted-foreground ">
            Don&apos;t have an account?{" "}
            <Link
              href={"/signup"}
              className=" underline-offset-4 underline hover:text-primary"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
}
