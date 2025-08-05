"use client";
import { Card, CardContent } from "@/components/ui/card";

import Image from "next/image";
import React from "react";
import SignUpForm from "../forms/SignUpForm";
export default function SignUpCard() {
  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <SignUpForm />

          <div className="bg-radial from-[#4f59ca]/80 to-[#464db7] relative hidden md:flex flex-col gap-y-4 items-center justify-center">
            <Image src="/logo.svg" alt="Lets Meet" width={92} height={92} />
            <p className="text-2xl font-semibold text-white">Lets Meet</p>
          </div>
        </CardContent>
      </Card>
      <div className="text-center text-xs text-muted-foreground text-balance *[a]:underline-offset-4 *[a]:underline hover:*[a]:text-primary">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline-offset-4 underline hover:text-primary">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline-offset-4 underline hover:text-primary">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}
