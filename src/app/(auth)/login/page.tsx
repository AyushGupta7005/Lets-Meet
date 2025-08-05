import LoginCard from "@/features/auth/ui/LoginCard";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
export default async function LoginPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!!session) {
    redirect("/");
  }
  return <LoginCard />;
}
