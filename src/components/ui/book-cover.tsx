import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface BookCoverProps {
  title: string;
  coverImage?: string;
  className?: string;
}

export function BookCover({ title, coverImage, className }: BookCoverProps) {
  const [failed, setFailed] = useState(false);
  const initials = useMemo(
    () =>
      title
        .split(" ")
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join(""),
    [title],
  );

  if (coverImage && !failed) {
    return (
      <img
        src={coverImage}
        alt={`Cover ${title}`}
        className={cn("h-48 w-full rounded-md object-cover", className)}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex h-48 w-full items-center justify-center rounded-md bg-gradient-to-br from-blue-100 to-slate-200 text-3xl font-bold text-slate-500",
        className,
      )}
      aria-label={`Placeholder cover ${title}`}
    >
      {initials || "BK"}
    </div>
  );
}
