'use client';

import React, { type ChangeEvent } from "react";
import ErrorMessage from "./ErrorMessage";
import { cn } from "../../utils/helper";

export interface RadioButtonProps {
  checked?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  label: string;
  labelId: string;
  name: string;
  required?: boolean;
  disabled?: boolean;
  errors?: string | string[] | any;
  className?: string;
  description?: string;
}

const RadioButton = ({
  checked,
  onChange,
  label,
  labelId,
  name,
  required = true,
  disabled = false,
  errors,
  className,
  description,
}: RadioButtonProps) => {
  return (
    <div className="w-full">
      <label
        htmlFor={labelId}
        className={cn(
          "group relative flex items-center justify-between gap-3.5 p-3.5 rounded-xl border transition-all duration-200 cursor-pointer select-none",
          checked
            ? "border-primary/60 bg-primary/5 shadow-xs ring-1 ring-primary/20"
            : "border-border/70 bg-card/60 hover:bg-card hover:border-border",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          className
        )}
      >
        <div className="flex-1 text-start overflow-hidden">
          <strong
            className={cn(
              "block text-sm sm:text-base font-medium transition-colors",
              checked ? "text-copy-primary font-semibold" : "text-copy-primary/90"
            )}
          >
            {label}
          </strong>
          {description && (
            <p className="text-xs text-copy-secondary mt-0.5 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        <div className="relative flex items-center">
          <input
            checked={checked}
            name={name}
            onChange={onChange}
            type="radio"
            className="peer sr-only"
            id={labelId}
            required={required}
            value={labelId}
            disabled={disabled}
          />
          <div
            className={cn(
              "size-5 rounded-full border-2 flex items-center justify-center transition-all duration-200",
              checked
                ? "border-primary bg-primary/10 shadow-xs"
                : "border-border/80 bg-card group-hover:border-primary/40",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40"
            )}
          >
            <span
              className={cn(
                "size-2.5 rounded-full bg-primary transition-transform duration-200 ease-out",
                checked ? "scale-100 animate-form-pop" : "scale-0"
              )}
            />
          </div>
        </div>
      </label>

      <ErrorMessage errors={errors} />
    </div>
  );
};

export default RadioButton;
