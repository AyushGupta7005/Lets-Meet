"use client";
import { authClient } from "@/lib/auth-client";

export default function Dashboard() {
  const { data: session } = authClient.useSession();

  if (!session) {
    return <p>Loading...</p>;
  }
  return (
    <div className="flex flex-col items-center gap-8 p-10">
      <h1 className="mx-auto text-center text-2xl font-bold">
        {session.user?.name}
      </h1>
    </div>
  );
}
