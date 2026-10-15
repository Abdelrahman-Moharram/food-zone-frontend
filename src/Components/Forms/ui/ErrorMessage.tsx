import React from "react";
import { IoAlertCircleOutline } from "react-icons/io5";
import { cn } from "../../utils/helper";

interface ErrorMessageProps {
  errors?: string | string[] | any;
  className?: string;
}

export const ErrorMessage = ({ errors, className }: ErrorMessageProps) => {
  if (!errors) return null;

  const errorList: string[] = Array.isArray(errors)
    ? errors.filter((e): e is string => typeof e === "string" && e.trim().length > 0)
    : typeof errors === "string" && errors.trim().length > 0
    ? [errors]
    : [];

  if (errorList.length === 0) return null;

  return (
    <div className={cn("mt-1.5 space-y-1 animate-form-slide", className)}>
      {errorList.map((err, idx) => (
        <div
          key={`${err}-${idx}`}
          className="flex items-center gap-1.5 text-xs font-medium text-rose-500 dark:text-rose-400"
        >
          <IoAlertCircleOutline className="shrink-0 text-sm animate-form-shake" />
          <span>{err}</span>
        </div>
      ))}
    </div>
  );
};

export default ErrorMessage;
