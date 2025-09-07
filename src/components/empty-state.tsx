import Image from "next/image";
import React from "react";
type LoadingStateProps = {
  title: string;
  description?: string;
};
export default function EmptyState({
  title,
  description = "",
}: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-y-6">
      <Image src={"/empty-state.svg"} alt="Empty" width={240} height={240} />
      <div className="mx-auto flex max-w-md flex-col gap-y-3 text-center">
        <h6 className="text-lg font-medium">{title}</h6>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
}
