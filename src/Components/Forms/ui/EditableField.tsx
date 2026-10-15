'use client';

import React, {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import { FaPencilAlt, FaCheck, FaTimes } from "react-icons/fa";
import { cn } from "../../utils/helper";

export interface EditableFieldProps {
  value: string;
  onSave: (value: string) => void;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  as?: "input" | "textarea";
  type?: string;
  rows?: number;
  disabled?: boolean;
}

const EditableField = ({
  value: initialValue,
  onSave,
  className,
  inputClassName,
  placeholder = "انقر للتعديل...",
  as = "input",
  type = "text",
  rows = 3,
  disabled = false,
}: EditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleStartEditing = (e: React.MouseEvent) => {
    if (disabled) return;
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    onSave(value);
  };

  const handleCancel = () => {
    setValue(initialValue);
    setIsEditing(false);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && as !== "textarea") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div
        className="relative inline-flex items-center gap-1.5 w-full animate-form-pop"
        onClick={(e) => e.stopPropagation()}
      >
        {as === "textarea" ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={value}
            onChange={handleChange}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            rows={rows}
            placeholder={placeholder}
            className={cn(
              "w-full py-1.5 px-3 rounded-xl border border-primary ring-2 ring-primary/20 bg-card text-copy-primary outline-none shadow-xs text-sm sm:text-base resize-y",
              inputClassName
            )}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type={type}
            value={value}
            onChange={handleChange}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={cn(
              "w-full py-1.5 px-3 rounded-xl border border-primary ring-2 ring-primary/20 bg-card text-copy-primary outline-none shadow-xs text-sm sm:text-base",
              inputClassName
            )}
          />
        )}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"
            title="حفظ"
          >
            <FaCheck className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              handleCancel();
            }}
            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
            title="إلغاء"
          >
            <FaTimes className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <span
      onClick={handleStartEditing}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleStartEditing(e as any);
        }
      }}
      className={cn(
        "group relative inline-flex items-center gap-2 px-2 py-1 rounded-lg border border-transparent hover:border-border/80 hover:bg-container/40 transition-all duration-200 cursor-pointer select-none",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
    >
      <span className={cn(!value && "text-copy-secondary italic")}>
        {value || placeholder}
      </span>
      {!disabled && (
        <FaPencilAlt className="w-3 h-3 text-copy-secondary/40 group-hover:text-primary transition-colors shrink-0" />
      )}
    </span>
  );
};

export default EditableField;
