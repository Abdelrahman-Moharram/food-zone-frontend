'use client';

import React, { type ChangeEvent, useRef } from "react";
import ErrorMessage from "./ErrorMessage";
import { cn } from "../../utils/helper";

export interface ColorInputProps {
  labelId: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: string;
  label?: string;
  required?: boolean;
  children?: React.ReactNode;
  errors?: string[] | string | any;
  defaultValue?: string | number;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const ColorInput = ({
  labelId,
  onChange,
  value = "#107c41",
  label,
  required = false,
  errors,
  disabled = false,
  className,
}: ColorInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const triggerPicker = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  return (
    <div className={cn("w-full text-start", className)}>
      {label && (
        <label
          htmlFor={labelId}
          className="block text-sm font-medium mb-1.5 text-copy-primary/90"
        >
          {label}
          {required && <span className="text-rose-500 ms-1 select-none">*</span>}
        </label>
      )}

      <div
        onClick={triggerPicker}
        className={cn(
          "relative flex items-center justify-between gap-3 p-2.5 rounded-xl border border-border/70 bg-card/80 hover:bg-card hover:border-border transition-all duration-200 cursor-pointer shadow-xs select-none group",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none"
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className="size-8 rounded-lg border border-border/80 shadow-xs transition-transform duration-200 group-hover:scale-110"
            style={{
              backgroundColor: value || "#107c41",
              boxShadow: `0 2px 8px ${value ? value + "40" : "transparent"}`,
            }}
          />
          <span className="text-sm font-mono font-medium text-copy-primary tracking-wide uppercase">
            {value || "#107C41"}
          </span>
        </div>

        <span className="text-xs text-copy-secondary group-hover:text-primary transition-colors font-medium px-2 py-1 rounded-md bg-container/60">
          تغيير اللون
        </span>

        <input
          ref={inputRef}
          type="color"
          id={labelId}
          name={labelId}
          value={value || "#107c41"}
          required={required}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
        />
      </div>

      <ErrorMessage errors={errors} />
    </div>
  );
};

export default ColorInput;
