import React, { type ChangeEvent, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import ErrorMessage from "./ErrorMessage";
import type { SingleValidationRules } from "../hooks/Types";
import { cn } from "../../utils/helper";

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectInputProps {
  labelId: string;
  children?: React.ReactNode;
  onChange: (
    e: ChangeEvent<HTMLSelectElement>,
    validationSchema?: SingleValidationRules | any
  ) => void;
  value: string | number;
  label?: string;
  required?: boolean;
  emptyoption?: boolean;
  emptyOptionText?: string;
  errors?: string | string[] | any;
  options?: SelectOption[];
  className?: string;
  selectClassName?: string;
  disabled?: boolean;
  validationSchema?: SingleValidationRules | any;
}

const SelectInput = ({
  labelId,
  children,
  onChange,
  value,
  label,
  required = false,
  emptyoption = true,
  emptyOptionText,
  errors,
  options,
  className,
  selectClassName,
  disabled = false,
  validationSchema,
}: SelectInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const hasErrors = Array.isArray(errors)
    ? errors.filter(Boolean).length > 0
    : typeof errors === "string"
    ? errors.trim().length > 0
    : Boolean(errors);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (validationSchema !== undefined) {
      onChange(e, validationSchema);
    } else {
      onChange(e);
    }
  };

  return (
    <div className={cn("w-full group text-start", className)}>
      {label && label.trim().length > 0 && (
        <label
          htmlFor={labelId}
          className={cn(
            "block text-sm font-medium mb-1.5 transition-colors duration-150",
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
      )}

      <div
        className={cn(
          "relative flex items-center w-full rounded-xl border bg-card/80 transition-all duration-200 shadow-xs backdrop-blur-xs",
          hasErrors
            ? "border-rose-500/80 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20"
            : isFocused
            ? "border-primary ring-2 ring-primary/20 shadow-sm"
            : "border-border/70 hover:border-border",
          disabled && "opacity-50 cursor-not-allowed bg-container/40"
        )}
      >
        <select
          name={labelId}
          id={labelId}
          value={value ?? ""}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          disabled={disabled}
          className={cn(
            "w-full py-2.5 ps-3.5 pe-10 bg-transparent text-sm sm:text-base text-copy-primary outline-none appearance-none cursor-pointer rounded-xl disabled:cursor-not-allowed",
            selectClassName
          )}
        >
          {emptyoption && (
            <option value="" className="bg-card text-copy-secondary">
              {emptyOptionText || "اختر..."}
            </option>
          )}
          {children
            ? children
            : options?.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  className="bg-card text-copy-primary"
                >
                  {opt.label}
                </option>
              ))}
        </select>

        <div className="pointer-events-none absolute inset-e-3.5 flex items-center text-copy-secondary transition-transform duration-200 group-focus-within:text-primary">
          <FaChevronDown
            className={cn("w-3.5 h-3.5 transition-transform duration-200", isFocused && "rotate-180")}
          />
        </div>
      </div>

      <ErrorMessage errors={errors} />
    </div>
  );
};

export default SelectInput;
