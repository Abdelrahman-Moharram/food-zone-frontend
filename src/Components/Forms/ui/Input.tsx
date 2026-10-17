'use client';

import React, { type ChangeEvent, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ErrorMessage from "./ErrorMessage";
import type { SingleValidationRules } from "../hooks/Types";
import { cn } from "../../utils/helper";

export interface InputProps {
  labelId: string;
  type?: string;
  onChange: (
    e: ChangeEvent<HTMLInputElement>,
    validationSchema?: SingleValidationRules | any
  ) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  value: string | number | null;
  label?: string;
  required?: boolean;
  children?: React.ReactNode;
  errors?: string | string[] | any;
  defaultValue?: string | number;
  placeholder?: string;
  inputClassName?: string;
  className?: string;
  disabled?: boolean;
  max_length?: number;
  numbersOnly?: boolean;
  validationSchema?: SingleValidationRules | any;
  icon?: React.ReactNode;
}

const Input = ({
  labelId,
  onChange,
  onKeyDown,
  value,
  label,
  placeholder,
  required = false,
  disabled = false,
  children,
  defaultValue,
  errors,
  inputClassName,
  className,
  max_length,
  numbersOnly = false,
  type = "text",
  validationSchema,
  icon,
}: InputProps) => {
  const [inputType, setType] = useState(type);
  const [isFocused, setIsFocused] = useState(false);

  const hasErrors = Array.isArray(errors)
    ? errors.filter(Boolean).length > 0
    : typeof errors === "string"
      ? errors.trim().length > 0
      : Boolean(errors);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (max_length && val.length > max_length) {
      val = val.slice(0, max_length);
    }
    if (numbersOnly) {
      val = val.replace(/[^0-9]/g, "");
    }
    e.target.value = val;

    if (validationSchema !== undefined) {
      onChange(e, validationSchema);
    } else {
      onChange(e);
    }
  };

  return (
    <div className={cn("w-full group text-start", className)}>
      {label && (
        <label
          htmlFor={labelId}
          className={cn(
            "block text-sm font-medium mb-1.5 transition-colors duration-150",
            hasErrors
              ? "text-rose-500 "
              : isFocused
                ? "text-primary font-semibold"
                : "text-copy-primary/90"
          )}
        >
          {label}
          {required && <span className="text-rose-500 ms-1 select-none">*</span>}
        </label>
      )}

      <div
        className={cn(
          "relative flex items-center w-full rounded-lg border bg-card/80 transition-all duration-200 shadow-xs backdrop-blur-xs",
          hasErrors
            ? "border-rose-500/80 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20"
            : isFocused
              ? "border-primary ring-2 ring-primary/20 shadow-sm"
              : "border-border/70 hover:border-border",
          disabled && "opacity-50 cursor-not-allowed bg-container/40"
        )}
      >
        {icon && (
          <div className="ps-3.5 pe-1 text-copy-secondary transition-colors group-focus-within:text-primary">
            {icon}
          </div>
        )}

        <input
          type={inputType}
          name={labelId}
          id={labelId}
          disabled={disabled}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={value !== null && value !== undefined ? value.toString() : ""}
          defaultValue={defaultValue}
          required={required}
          placeholder={placeholder}
          maxLength={max_length}
          className={cn(
            "w-full py-2.5 px-3.5 bg-transparent text-sm sm:text-base text-copy-primary placeholder:text-copy-secondary/50 outline-none rounded-lg disabled:cursor-not-allowed",
            type === "password" && "pe-11",
            inputClassName
          )}
        />

        {type === "password" && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setType(inputType === "text" ? "password" : "text")}
            className="absolute end-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-copy-secondary hover:text-primary hover:bg-primary/10 active:scale-95 transition-all duration-150"
            title={inputType === "password" ? "إظهار كلمة المرور" : "إخفاء كلمة المرور"}
          >
            {inputType === "password" ? (
              <FaEye className="w-4 h-4" />
            ) : (
              <FaEyeSlash className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {children}

      <ErrorMessage errors={errors} />
    </div>
  );
};

export default Input;
