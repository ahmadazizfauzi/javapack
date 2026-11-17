import React from "react";
import {
  baseTypography,
  BaseTypographyScale,
} from "@/tokens/base_typography";

export interface BaseTypographyProps {
  variant?: BaseTypographyScale;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "label" | "div";
  className?: string;
  children: React.ReactNode;
}

export function BaseTypography({
  variant = "sm",
  as: Component = "p",
  className = "",
  children,
}: BaseTypographyProps) {
  return (
    <Component className={`${baseTypography[variant]} ${className}`.trim()}>
      {children}
    </Component>
  );
}
