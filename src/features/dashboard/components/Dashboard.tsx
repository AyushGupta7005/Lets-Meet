"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  if (!session) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center gap-8 p-10">
      <h1 className="mx-auto text-center text-2xl font-bold">
        Welcome back, {session.user.name || "User"}!
      </h1>
      <Button
        variant="outline"
        className="mt-4"
        onClick={() =>
          authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                router.push("/login");
              },
              onError: (error) => {
                console.error("Sign out error:", error);
              },
            },
          })
        }
      >
        Sign Out
      </Button>
    </div>
  );
}
