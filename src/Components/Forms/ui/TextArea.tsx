'use client';

import React, { type ChangeEvent, useState } from "react";
import ErrorMessage from "./ErrorMessage";
import type { SingleValidationRules } from "../hooks/Types";
import { cn } from "../../utils/helper";

export interface TextAreaProps {
  labelId: string;
  onChange: (
    e: ChangeEvent<HTMLTextAreaElement>,
    validationSchema?: SingleValidationRules | any
  ) => void;
  value: string | number | null;
  label?: string;
  required?: boolean;
  errors?: string | string[] | any;
  placeholder?: string;
  rows?: number;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  max_length?: number;
  validationSchema?: SingleValidationRules | any;
}

const TextArea = ({
  labelId,
  onChange,
  value,
  label,
  required = false,
  errors,
  placeholder,
  rows = 4,
  className,
  inputClassName,
  disabled = false,
  max_length,
  validationSchema,
}: TextAreaProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const hasErrors = Array.isArray(errors)
    ? errors.filter(Boolean).length > 0
    : typeof errors === "string"
    ? errors.trim().length > 0
    : Boolean(errors);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    let val = e.target.value;
    if (max_length && val.length > max_length) {
      val = val.slice(0, max_length);
      e.target.value = val;
    }

    if (validationSchema !== undefined) {
      onChange(e, validationSchema);
    } else {
      onChange(e);
    }
  };

  const stringVal = value !== null && value !== undefined ? value.toString() : "";

  return (
    <div className={cn("w-full group text-start", className)}>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor={labelId}
            className={cn(
              "block text-sm font-medium transition-colors duration-150",
              hasErrors
                ? "text-rose-500 dark:text-rose-400"
                : isFocused
                ? "text-primary font-semibold"
                : "text-copy-primary/90"
            )}
          >
            {label}
            {required && <span className="text-rose-500 ms-1 select-none">*</span>}
          </label>

          {max_length && (
            <span className="text-xs text-copy-secondary">
              {stringVal.length} / {max_length}
            </span>
          )}
        </div>
      )}

      <div
        className={cn(
          "relative w-full rounded-xl border bg-card/80 transition-all duration-200 shadow-xs backdrop-blur-xs",
          hasErrors
            ? "border-rose-500/80 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20"
            : isFocused
            ? "border-primary ring-2 ring-primary/20 shadow-sm"
            : "border-border/70 hover:border-border",
          disabled && "opacity-50 cursor-not-allowed bg-container/40"
        )}
      >
        <textarea
          name={labelId}
          id={labelId}
          rows={rows}
          value={stringVal}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          maxLength={max_length}
          className={cn(
            "w-full py-2.5 px-3.5 bg-transparent text-sm sm:text-base text-copy-primary placeholder:text-copy-secondary/50 outline-none rounded-xl resize-y disabled:cursor-not-allowed",
            inputClassName
          )}
        />
      </div>

      <ErrorMessage errors={errors} />
    </div>
  );
};

export default TextArea;
