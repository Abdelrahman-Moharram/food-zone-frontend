import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const to_int_or_default = (val: string | null, def = 0) => {
  try {
    if (val) return parseInt(val);
  } catch { }

  return def;
};

export const numberToMoney = (value: number | string | null) => {
  if (!value) return 0;
  let intValue = value.toLocaleString().replace(/[^0-9.]/g, "");
  const parts = intValue.split(".");
  if (parts.length > 2) {
    intValue = parts[0] + "." + parts.slice(1).join("");
  }

  const [integerPart, decimalPart] = intValue.split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return decimalPart !== undefined
    ? `${formattedInteger}.${decimalPart}`
    : formattedInteger;
};

export const beautify_date = (date: string, showTime: boolean = false) => {
  if (!date) return "";

  const newDate = new Date(date);
  if (!(newDate instanceof Date) || isNaN(newDate.getTime())) return date;

  const day = String(newDate.getDate()).padStart(2, "0");
  const month = String(newDate.getMonth() + 1).padStart(2, "0");
  const year = newDate.getFullYear();

  const hours = newDate.getHours();
  const minutes = newDate.getMinutes();
  // const seconds = newDate.getSeconds()

  const datePart = `${year}-${month}-${day}`;

  if (showTime && !(hours === 0 && minutes === 0)) {
    const ampm = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 === 0 ? 12 : hours % 12;
    const h = String(hour12).padStart(2, "0");
    const m = String(minutes).padStart(2, "0");

    const timePart = `\u200E( ${h}:${m} ${ampm} )`;

    return `\u200E${datePart} ${timePart}`;
  }

  return datePart;
};


export const toArabicNumber = (num: string | number) => {
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return num.toString().replace(/\d/g, (digit) => arabicDigits[parseInt(digit, 10)]);
};


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
