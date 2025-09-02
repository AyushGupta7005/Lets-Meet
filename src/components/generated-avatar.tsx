"use client";
import { createAvatar } from "@dicebear/core";
import { botttsNeutral, initials } from "@dicebear/collection";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";
interface GeneratedAvatarProps {
  seed: string;
  variant: "botttsNeutral" | "initials";
  className?: string;
}
export default function GeneratedAvatar({
  seed,
  variant,
  className,
}: GeneratedAvatarProps) {
  const avatar = createAvatar(
    variant === "botttsNeutral" ? botttsNeutral : initials,
    {
      seed,
      ...(variant !== "botttsNeutral" && {
        fontWeight: 500,
        fontSize: 40,
      }),
    },
  );
  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={avatar.toDataUri()} alt="Avatar" />
      <AvatarFallback>
        <span>{seed.charAt(0).toUpperCase()}</span>
      </AvatarFallback>
    </Avatar>
  );
}
