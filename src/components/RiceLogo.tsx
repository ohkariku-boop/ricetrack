import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  size?: number;
  title?: string;
};

/** Single rice grain mark — RiceTrack brand */
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
      <defs>
        <linearGradient id="rt-rice" x1="20" y1="10" x2="44" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F8F1E4" />
          <stop offset="0.5" stopColor="#E6D5B3" />
          <stop offset="1" stopColor="#C4A574" />
        </linearGradient>
        <linearGradient id="rt-shine" x1="24" y1="16" x2="36" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.5" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="#2d5a3d" />
      <ellipse
        cx="32"
        cy="33"
        rx="10.5"
        ry="19.5"
        fill="url(#rt-rice)"
        transform="rotate(-18 32 33)"
      />
      <ellipse
        cx="28.5"
        cy="27"
        rx="3.2"
        ry="8"
        fill="url(#rt-shine)"
        transform="rotate(-18 28.5 27)"
      />
    </svg>
  );
}
