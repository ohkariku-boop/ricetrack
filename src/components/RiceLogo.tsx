import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** pixel size of the mark */
  size?: number;
  title?: string;
};

/** Rice grain mark — RiceTrack brand */
export function RiceLogo({ className, size = 28, title = "RiceTrack" }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      role="img"
      aria-label={title}
    >
      <circle cx="32" cy="32" r="30" fill="#2d5a3d" />
      <defs>
        <linearGradient id="rt-rice" x1="18" y1="8" x2="46" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F7F0E0" />
          <stop offset="0.45" stopColor="#E8D9B8" />
          <stop offset="1" stopColor="#C4A574" />
        </linearGradient>
        <linearGradient id="rt-shade" x1="22" y1="12" x2="40" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse
        cx="32"
        cy="33"
        rx="11"
        ry="20"
        fill="url(#rt-rice)"
        transform="rotate(-18 32 33)"
      />
      <ellipse
        cx="28"
        cy="26"
        rx="4.2"
        ry="9"
        fill="url(#rt-shade)"
        transform="rotate(-18 28 26)"
      />
      <ellipse
        cx="38.5"
        cy="17"
        rx="3.2"
        ry="4.5"
        fill="#F4EBD8"
        transform="rotate(-18 38.5 17)"
      />
    </svg>
  );
}
