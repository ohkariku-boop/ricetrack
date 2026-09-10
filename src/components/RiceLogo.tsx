import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  size?: number;
  title?: string;
  /** rounded for in-app mark; square for icon-like use */
  rounded?: boolean;
};

/** Bowl of rice mark — RiceTrack brand (full-bleed green) */
export function RiceLogo({
  className,
  size = 28,
  title = "RiceTrack",
  rounded = true,
}: Props) {
  const gid = `rt-bowl-${size}`;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={cn("shrink-0", rounded && "rounded-[22%]", className)}
      role="img"
      aria-label={title}
    >
      <rect width="64" height="64" fill="#2d5a3d" />
      <path d="M14 30c0 12 8 20 18 20s18-8 18-20H14z" fill="#1a3d28" />
      <ellipse cx="32" cy="30" rx="20" ry="6" fill="#243f2e" />
      <ellipse cx="32" cy="26" rx="16" ry="10" fill="#F5ECD8" />
      <ellipse cx="32" cy="24" rx="13" ry="7" fill="#FBF6EC" />
      <ellipse
        cx="26"
        cy="22"
        rx="2.2"
        ry="3.2"
        fill="#E8D9B8"
        transform="rotate(-25 26 22)"
      />
      <ellipse
        cx="32"
        cy="20"
        rx="2.2"
        ry="3.2"
        fill="#EDE3C8"
        transform="rotate(8 32 20)"
      />
      <ellipse
        cx="38"
        cy="22"
        rx="2.2"
        ry="3.2"
        fill="#E8D9B8"
        transform="rotate(22 38 22)"
      />
      <ellipse
        cx="28"
        cy="27"
        rx="2"
        ry="2.8"
        fill="#E0D0A8"
        transform="rotate(-10 28 27)"
      />
      <ellipse
        cx="35"
        cy="26"
        rx="2"
        ry="2.8"
        fill="#E8D9B8"
        transform="rotate(15 35 26)"
      />
      <ellipse cx="31" cy="28" rx="1.8" ry="2.5" fill="#F0E6D0" />
      <ellipse cx="32" cy="30" rx="18" ry="3.5" fill="#ffffff" opacity="0.08" />
    </svg>
  );
}
