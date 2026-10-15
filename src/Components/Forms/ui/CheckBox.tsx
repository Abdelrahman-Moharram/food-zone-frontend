'use client';

import React, { type ChangeEvent } from "react";
import { FaCheck } from "react-icons/fa";
import ErrorMessage from "./ErrorMessage";
import { cn } from "../../utils/helper";

export interface CheckBoxProps {
  checked: boolean;
  changeCheckBox: (event: ChangeEvent<HTMLInputElement>) => void;
  label: string;
  labelId: string;
  name: string;
  disabled?: boolean;
  errors?: string | string[] | any;
  className?: string;
  description?: string;
}

const CheckBox = ({
  checked,
  changeCheckBox,
  label,
  labelId,
  name,
  disabled = false,
  errors,
  className,
  description,
}: CheckBoxProps) => {
  return (
    <div className="w-full">
      <label
        htmlFor={labelId}
        className={cn(
          "group relative flex items-start gap-3.5 p-3 rounded-xl border transition-all duration-200 cursor-pointer select-none",
          checked
            ? "border-primary/60 bg-primary/5 shadow-xs"
            : "border-border/70 bg-card/60 hover:bg-card hover:border-border",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          className
        )}
      >
        <div className="relative flex items-center pt-0.5">
          <input
            type="checkbox"
            id={labelId}
            name={name}
            checked={checked}
            onChange={changeCheckBox}
            disabled={disabled}
            className="peer sr-only"
          />
          <div
            className={cn(
              "size-5 rounded-md border flex items-center justify-center transition-all duration-200",
              checked
                ? "bg-primary border-primary text-white shadow-xs animate-form-pop"
                : "border-border/80 bg-card group-hover:border-primary/50 group-hover:shadow-xs",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40"
            )}
          >
            {checked && <FaCheck className="w-2.5 h-2.5 text-white stroke-1" />}
          </div>
        </div>

        <div className="flex-1 text-start">
          <span
            className={cn(
              "block text-sm sm:text-base font-medium transition-colors",
              checked ? "text-copy-primary font-semibold" : "text-copy-primary/90"
            )}
          >
            {label}
          </span>
          {description && (
            <p className="text-xs text-copy-secondary mt-0.5 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </label>

      <ErrorMessage errors={errors} />
    </div>
  );
};

export default CheckBox;
