import { cn } from "@/lib/utils";

interface LettingLampProps {
  lit: boolean;
  className?: string;
  label?: string;
}

export function LettingLamp({ lit, className, label }: LettingLampProps) {
  return (
    <span
      className={cn(
        "relative inline-flex size-5 items-center justify-center",
        className,
      )}
      role="img"
      aria-label={label ?? (lit ? "Available" : "Let out")}
    >
      {lit && (
        <span
          aria-hidden="true"
          className="absolute inline-flex size-6 rounded-full bg-lamp/40 blur-md animate-lamp-flicker"
        />
      )}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className={cn(
          "relative size-5 transition-colors duration-300",
          lit ? "text-lamp" : "text-lamp-dim",
        )}
      >
        <path
          d="M10 3h4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M9.2 3.5l.8 2.2h4l.8-2.2"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M8 6h8l-1.1 7.6a3.7 3.7 0 0 1-5.8 0L8 6Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M9 14.5h6l-.9 3.2H9.9l-.9-3.2Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        {lit && (
          <path
            d="M12 8.2c1.2.9 1.6 1.7 1.6 2.5a1.6 1.6 0 0 1-3.2 0c0-.8.4-1.6 1.6-2.5Z"
            fill="currentColor"
            stroke="none"
          />
        )}
      </svg>
    </span>
  );
}