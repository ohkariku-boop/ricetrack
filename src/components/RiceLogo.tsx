import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  size?: number;
  title?: string;
  rounded?: boolean;
};

/** RiceTrack mark — plate of rice illustration (plain img, no next/image) */
export function RiceLogo({
  className,
  size = 28,
  title = "RiceTrack",
  rounded = true,
}: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo-plate.png"
      alt={title}
      width={size}
      height={size}
      className={cn(
        "shrink-0 object-contain",
        rounded && "rounded-[22%]",
        className
      )}
      draggable={false}
    />
  );
}
