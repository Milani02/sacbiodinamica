import { cn } from "@/lib/utils";

/**
 * Brand mark for SAC Biodinâmica — a sprouting leaf, nodding to
 * biodynamic agriculture and "living systems".
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("size-5", className)}
      aria-hidden
    >
      <path
        d="M12 21V11"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M12 12C12 8.5 9 5 4 4.5C3.5 9.5 7 13 12 12Z"
        fill="currentColor"
        opacity="0.55"
      />
      <path
        d="M12 10C12 6 15.5 3 20.5 3.5C20 9 16.5 11.5 12 10Z"
        fill="currentColor"
      />
    </svg>
  );
}
