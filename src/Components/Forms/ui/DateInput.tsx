'use client';

import React, {
  useState,
  useRef,
  useEffect,
  type ChangeEvent,
  useMemo,
} from "react";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ErrorMessage from "./ErrorMessage";
import type { SingleValidationRules } from "../hooks/Types";
import { cn } from "../../utils/helper";

export interface DateInputProps {
  labelId: string;
  label?: string;
  value: string;
  onChange: (
    e: ChangeEvent<HTMLInputElement>,
    validationSchema?: SingleValidationRules | any
  ) => void;
  placeholder?: string;
  dateFormat?: string;
  required?: boolean;
  disabled?: boolean;
  errors?: string[] | string | any;
  yearRange?: { start: number; end: number };
  className?: string;
  inputClassName?: string;
  validationSchema?: SingleValidationRules | any;
}

const padZero = (n: number) => (n < 10 ? `0${n}` : `${n}`);

const formatDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = padZero(date.getMonth() + 1);
  const d = padZero(date.getDate());
  return `${y}-${m}-${d}`;
};

const parseDateString = (str: string): Date | null => {
  if (!str) return null;
  const parts = str.split("-").map((p) => parseInt(p, 10));
  if (parts.length === 3 && !parts.some(isNaN)) {
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    if (!isNaN(d.getTime())) return d;
  }
  return null;
};

const monthNames = [
  "يناير - January",
  "فبراير - February",
  "مارس - March",
  "أبريل - April",
  "مايو - May",
  "يونيو - June",
  "يوليو - July",
  "أغسطس - August",
  "سبتمبر - September",
  "أكتوبر - October",
  "نوفمبر - November",
  "ديسمبر - December",
];

const weekDays = ["أح", "إث", "ثلا", "أر", "خم", "جم", "سب"];

const DateInput = ({
  labelId,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  errors,
  yearRange = { start: 1950, end: 2050 },
  className,
  inputClassName,
  validationSchema,
}: DateInputProps) => {
  const [showCal, setShowCal] = useState(false);
  const [viewDate, setViewDate] = useState<Date>(() => {
    return parseDateString(value) || new Date();
  });
  const [inputValue, setInputValue] = useState<string>(value || "");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value || "");
    const parsed = parseDateString(value);
    if (parsed) {
      setViewDate(parsed);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowCal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const years = useMemo(() => {
    const list: number[] = [];
    for (let y = yearRange.start; y <= yearRange.end; y++) {
      list.push(y);
    }
    return list;
  }, [yearRange.start, yearRange.end]);

  const fireOnChange = (val: string) => {
    const syntheticEvent = {
      target: {
        name: labelId,
        id: labelId,
        value: val,
      },
    } as ChangeEvent<HTMLInputElement>;

    if (validationSchema !== undefined) {
      onChange(syntheticEvent, validationSchema);
    } else {
      onChange(syntheticEvent);
    }
  };

  const handleDaySelect = (dayNum: number) => {
    const selected = new Date(viewDate.getFullYear(), viewDate.getMonth(), dayNum);
    const formatted = formatDate(selected);
    setInputValue(formatted);
    setShowCal(false);
    fireOnChange(formatted);
  };

  const changeMonth = (offset: number) => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const changeYear = (year: number) => {
    setViewDate((prev) => new Date(year, prev.getMonth(), 1));
  };

  const selectedDateObj = useMemo(() => parseDateString(inputValue), [inputValue]);
  const today = new Date();

  // Calendar calculations
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return (
    <div ref={wrapperRef} className={cn("relative w-full text-start", className)}>
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
        onClick={() => !disabled && setShowCal((prev) => !prev)}
        className={cn(
          "relative flex items-center w-full rounded-xl border bg-card/80 transition-all duration-200 shadow-xs cursor-pointer select-none",
          showCal
            ? "border-primary ring-2 ring-primary/20"
            : "border-border/70 hover:border-border",
          disabled && "opacity-50 cursor-not-allowed bg-container/40",
          errors && "border-rose-500/80"
        )}
      >
        <div className="ps-3.5 pe-1 text-copy-secondary">
          <FaCalendarAlt className="w-4 h-4 text-primary" />
        </div>

        <input
          type="text"
          id={labelId}
          name={labelId}
          value={inputValue}
          readOnly
          placeholder={placeholder || "YYYY-MM-DD"}
          required={required}
          disabled={disabled}
          className={cn(
            "w-full py-2.5 px-3 bg-transparent text-sm sm:text-base text-copy-primary placeholder:text-copy-secondary/50 outline-none rounded-xl cursor-pointer",
            inputClassName
          )}
        />
      </div>

      {showCal && !disabled && (
        <div className="absolute z-50 mt-2 p-4 w-72 sm:w-80 rounded-2xl bg-card border border-border/80 shadow-xl backdrop-blur-md animate-form-slide">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-border/60">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="p-1.5 rounded-lg text-copy-secondary hover:text-copy-primary hover:bg-container transition-colors"
              title="الشهر السابق"
            >
              <FaChevronRight className="w-3.5 h-3.5 rtl:block ltr:hidden" />
              <FaChevronLeft className="w-3.5 h-3.5 ltr:block rtl:hidden" />
            </button>

            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-semibold text-copy-primary">
                {monthNames[month]?.split("-")[0]}
              </span>

              <select
                value={year}
                onChange={(e) => changeYear(parseInt(e.target.value, 10))}
                className="text-xs sm:text-sm font-semibold text-copy-primary bg-container/80 border border-border/70 rounded-lg px-2 py-0.5 outline-none cursor-pointer"
              >
                {years.map((y) => (
                  <option key={y} value={y} className="bg-card text-copy-primary">
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="p-1.5 rounded-lg text-copy-secondary hover:text-copy-primary hover:bg-container transition-colors"
              title="الشهر التالي"
            >
              <FaChevronLeft className="w-3.5 h-3.5 rtl:block ltr:hidden" />
              <FaChevronRight className="w-3.5 h-3.5 ltr:block rtl:hidden" />
            </button>
          </div>

          {/* Week Days */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {weekDays.map((d, i) => (
              <span
                key={i}
                className="text-xs font-semibold text-copy-secondary py-1 select-none"
              >
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="size-8" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const isToday =
                today.getFullYear() === year &&
                today.getMonth() === month &&
                today.getDate() === dayNum;

              const isSelected =
                selectedDateObj &&
                selectedDateObj.getFullYear() === year &&
                selectedDateObj.getMonth() === month &&
                selectedDateObj.getDate() === dayNum;

              return (
                <button
                  key={`day-${dayNum}`}
                  type="button"
                  onClick={() => handleDaySelect(dayNum)}
                  className={cn(
                    "size-8 text-xs sm:text-sm font-medium rounded-lg flex items-center justify-center transition-all duration-150 select-none",
                    isSelected
                      ? "bg-primary text-white shadow-xs font-bold scale-105"
                      : isToday
                      ? "border border-primary text-primary font-semibold hover:bg-primary/10"
                      : "text-copy-primary hover:bg-container"
                  )}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>

          {/* Today quick button */}
          <div className="mt-3 pt-2.5 border-t border-border/60 flex justify-between items-center text-xs">
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                setViewDate(now);
                const formatted = formatDate(now);
                setInputValue(formatted);
                setShowCal(false);
                fireOnChange(formatted);
              }}
              className="text-primary hover:underline font-semibold"
            >
              اليوم ({formatDate(today)})
            </button>
            <button
              type="button"
              onClick={() => {
                setInputValue("");
                setShowCal(false);
                fireOnChange("");
              }}
              className="text-rose-500 hover:underline"
            >
              مسح
            </button>
          </div>
        </div>
      )}

      <ErrorMessage errors={errors} />
    </div>
  );
};

export default DateInput;
