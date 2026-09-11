import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
  className?: string;
  size?: number;
  title?: string;
  rounded?: boolean;
};

/** RiceTrack mark — plate of rice illustration */
export function RiceLogo({
  className,
  size = 28,
  title = "RiceTrack",
  rounded = true,
}: Props) {
  return (
    <Image
      src="/logo-plate.png"
      alt={title}
      width={size}
      height={size}
      className={cn(
        "shrink-0 object-contain",
        rounded && "rounded-[22%]",
        className
      )}
      priority
    />
  );
}
