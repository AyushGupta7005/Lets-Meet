import { Card, CardContent } from "@/components/ui/card";

import Image from "next/image";
import React from "react";
export default function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          {children}

          <div className="from-sidebar-accent to-sidebar relative hidden flex-col items-center justify-center gap-y-4 bg-radial md:flex">
            <Image src="/logo.svg" alt="Lets Meet" width={92} height={92} className="w-auto h-auto"/>
            <p className="text-2xl font-semibold text-white">Lets Meet</p>
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *[a]:underline-offset-4 *[a]:underline hover:*[a]:text-primary text-center text-xs text-balance">
        By clicking continue, you agree to our{" "}
        <a href="#" className="hover:text-primary underline underline-offset-4">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="hover:text-primary underline underline-offset-4">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}
