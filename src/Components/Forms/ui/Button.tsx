'use client';

import React from "react";
import { Spinner } from "../../Loaders";
import { cn } from "../../utils/helper";
import { Link } from "react-router-dom";


export type variantType =
  | "primary"
  | "secondary"
  | "primary-outline"
  | "secondary-outline"
  | "red"
  | "red-outline"
  | "white";

export interface ButtonProps {
  title: string;
  submit?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  variant: variantType;
  iconRight?: boolean;
  children?: React.ReactNode;
}

const getVariantClasses = (variant: variantType, disabled?: boolean) => {
  const baseVariants: Record<variantType, string> = {
    primary:
      "bg-primary text-white hover:brightness-110 shadow-xs hover:shadow-md hover:shadow-primary/20 focus-visible:ring-primary border border-primary/20",
    secondary:
      "bg-secondary text-white hover:brightness-110 shadow-xs hover:shadow-md hover:shadow-secondary/20 focus-visible:ring-secondary border border-secondary/20",
    "primary-outline":
      "bg-primary/5 hover:bg-primary text-primary hover:text-white border border-primary/60 hover:border-primary focus-visible:ring-primary",
    "secondary-outline":
      "bg-secondary/5 hover:bg-secondary text-secondary hover:text-white border border-secondary/60 hover:border-secondary focus-visible:ring-secondary",
    red: "bg-rose-600 hover:bg-rose-700 text-white shadow-xs hover:shadow-md hover:shadow-rose-600/20 focus-visible:ring-rose-500 border border-rose-600/20",
    "red-outline":
      "bg-rose-500/5 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-500/60 hover:border-rose-600 focus-visible:ring-rose-500",
    white:
      "bg-card/90 hover:bg-card text-copy-primary border border-border/80 shadow-xs hover:shadow-sm focus-visible:ring-border",
  };

  const selected = baseVariants[variant] || baseVariants.primary;

  if (disabled) {
    return cn(selected, "opacity-50 cursor-not-allowed pointer-events-none active:scale-100 shadow-none");
  }

  return selected;
};

const Button = ({
  title,
  submit,
  isLoading,
  onClick,
  icon,
  variant = "primary",
  className,
  disabled = false,
  iconRight = false,
  children,
}: ButtonProps) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={submit ? "submit" : "button"}
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        "group relative inline-flex items-center justify-center font-medium rounded-xl px-5 py-2.5 min-w-[120px] transition-all duration-200 ease-out select-none active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 overflow-hidden",
        getVariantClasses(variant, isDisabled),
        className
      )}
    >
      <div className="flex items-center justify-center gap-2 text-sm sm:text-base leading-snug">
        {isLoading ? (
          <div className="flex items-center gap-2 animate-pulse">
            <Spinner sm />
            <span className="opacity-80">{title}</span>
          </div>
        ) : iconRight ? (
          <>
            {icon && <span className="shrink-0 transition-transform duration-200 group-hover:scale-105">{icon}</span>}
            <span>{title || children}</span>
          </>
        ) : (
          <>
            <span>{title || children}</span>
            {icon && <span className="shrink-0 transition-transform duration-200 group-hover:scale-105">{icon}</span>}
          </>
        )}
      </div>
    </button>
  );
};

export interface LinkProps {
  title: string;
  submit?: boolean;
  isLoading?: boolean;
  href?: string;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  variant: variantType;
  iconRight?: boolean;
  children?: React.ReactNode;
}

export const ButtonLink = ({
  title,
  isLoading,
  icon,
  variant = "primary",
  href,
  className,
  disabled = false,
  iconRight = false,
  children,
}: LinkProps) => {
  return (
    <Link
      to={href || "#"}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      className={cn(
        "group relative inline-flex items-center justify-center font-medium rounded-xl px-5 py-2.5 min-w-[120px] transition-all duration-200 ease-out select-none active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 text-center",
        getVariantClasses(variant, disabled || isLoading),
        disabled && "pointer-events-none opacity-50",
        className
      )}
    >
      <div className="flex items-center justify-center gap-2 sm:text-base leading-snug">
        {isLoading ? (
          <div className="flex items-center gap-2 animate-pulse">
            <Spinner sm />
            <span className="opacity-80">{title}</span>
          </div>
        ) : iconRight ? (
          <>
            {icon && <span className="shrink-0 transition-transform duration-200 group-hover:scale-105">{icon}</span>}
            <span>{title || children}</span>
          </>
        ) : (
          <>
            <span>{title || children}</span>
            {icon && <span className="shrink-0 transition-transform duration-200 group-hover:scale-105">{icon}</span>}
          </>
        )}
      </div>
    </Link>
  );
};

export default Button;
