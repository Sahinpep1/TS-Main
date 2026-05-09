/**
 * Badge — renders a small status/priority label with consistent styling.
 * Supports variant colors and optional dot indicator.
 */

import type { ReactNode } from "react";
import "./Badge.css";

type BadgeVariant =
  | "high"
  | "medium"
  | "low"
  | "pending"
  | "assigned"
  | "delivered"
  | "idle"
  | "loading"
  | "en_route"
  | "returning"
  | "info"
  | "success"
  | "warning"
  | "danger";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  dot?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export default function Badge({
  variant = "info",
  children,
  dot = false,
  size = "sm",
  className = "",
}: BadgeProps) {
  return (
    <span className={`badge badge--${variant} badge--${size} ${className}`}>
      {dot && <span className="badge__dot" />}
      {children}
    </span>
  );
}
