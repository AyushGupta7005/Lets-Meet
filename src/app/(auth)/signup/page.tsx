import SignUpCard from "@/features/auth/ui/SignUpCard";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Signup() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!!session) {
    redirect("/");
  }
  return <SignUpCard />;
}
