"use client";

import GeneratedAvatar from "@/components/generated-avatar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { authClient } from "@/lib/auth-client";
import { ChevronDownIcon, CreditCardIcon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

// Outsourced trigger logic as a component
function UserButtonTrigger({
  userName,
  userEmail,
  userImage,
}: {
  userName: string;
  userEmail: string;
  userImage?: string | null;
}) {
  return (
    <div className="border-border/10 flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-lg border bg-white/5 p-3 hover:bg-white/10">
      {userImage ? (
        <Avatar className="mr-3">
          <AvatarImage
            src={userImage}
            alt={userName}
            className="h-8 w-8 rounded-full"
          />
        </Avatar>
      ) : (
        <GeneratedAvatar
          seed={userName}
          variant="initials"
          className="mr-3 size-9"
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-0.5 overflow-hidden text-left">
        <p className="w-full truncate text-sm">{userName}</p>
        <p className="w-full truncate text-xs">{userEmail}</p>
      </div>
      <ChevronDownIcon className="size-4 shrink-0" />
    </div>
  );
}

export default function DashboardUserButton() {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();

  const isMobile = useIsMobile();
  function onLogout() {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  }
  if (isPending || !data?.user) {
    return null;
  }
  const userName = data.user.name;
  const userEmail = data.user.email;
  const userImage = data.user.image;

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger>
          <UserButtonTrigger
            userName={userName}
            userEmail={userEmail}
            userImage={userImage}
          />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-left">{userName}</DrawerTitle>
            <DrawerDescription className="text-left">
              {userEmail}
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button variant={"outline"}>
              <CreditCardIcon className="size-4 text-black" />
              Billing
            </Button>
            <Button onClick={onLogout} variant={"outline"}>
              <LogOutIcon className="size-4 text-black" />
              Logout
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserButtonTrigger
          userName={userName}
          userEmail={userEmail}
          userImage={userImage}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right" className="w-72">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <span className="truncate font-medium">{userName}</span>
            <span className="text-muted-foreground truncate text-sm font-normal">
              {userEmail}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex cursor-pointer items-center justify-between">
          Billing
          <CreditCardIcon className="size-4" />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onLogout}
          className="flex cursor-pointer items-center justify-between"
        >
          Logout <LogOutIcon className="size-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
