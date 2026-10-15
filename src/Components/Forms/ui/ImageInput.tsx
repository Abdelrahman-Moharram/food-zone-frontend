'use client';

import React, { type ChangeEvent, useMemo } from "react";
import { FaFile, FaVideo, FaCamera } from "react-icons/fa";
import { IoIosCloudUpload } from "react-icons/io";
import ErrorMessage from "./ErrorMessage";
import { cn } from "../../utils/helper";

export interface ImageInputProps {
  labelId: string;
  type?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  file?: File | string | null;
  label: string;
  required?: boolean;
  errors?: string[] | string | any;
  id?: string;
  className?: string;
}

const ImageInput = ({
  labelId,
  type = "file",
  onChange,
  file,
  label,
  required = false,
  errors,
  id,
  className,
}: ImageInputProps) => {
  const objectUrl = useMemo(() => {
    if (file && typeof file !== "string") {
      try {
        return URL.createObjectURL(file);
      } catch {
        return undefined;
      }
    }
    return undefined;
  }, [file]);

  const previewSrc = useMemo(() => {
    if (!file) return null;
    if (typeof file === "string") {
      return file.startsWith("http")
        ? file
        : (import.meta.env.VITE_BASE_URL || "") + (file.startsWith("/") ? file : "/" + file);
    }
    return objectUrl;
  }, [file, objectUrl]);

  const isVideo = file && typeof file !== "string" && file.type?.includes("video");

  return (
    <div className={cn("w-full text-start", className)}>
      {label && (
        <label
          htmlFor={id || labelId}
          className="block text-sm font-medium mb-1.5 text-copy-primary/90"
        >
          {label}
          {required && <span className="text-rose-500 ms-1 select-none">*</span>}
        </label>
      )}

      <label
        htmlFor={id || labelId}
        className={cn(
          "relative flex flex-col items-center justify-center w-full min-h-[180px] max-w-[340px] rounded-2xl border-2 border-dashed overflow-hidden cursor-pointer select-none transition-all duration-200 group",
          file
            ? "border-border/80 bg-card p-1 shadow-xs"
            : "border-border/80 bg-card/50 hover:bg-card/90 hover:border-primary/60 p-6",
          errors && "border-rose-500/80 bg-rose-500/5"
        )}
      >
        {file ? (
          <div className="relative w-full h-[180px] rounded-xl overflow-hidden flex items-center justify-center bg-container/40">
            {isVideo ? (
              <div className="flex flex-col items-center gap-2 text-copy-primary p-4">
                <FaVideo className="text-3xl text-secondary" />
                <span className="text-xs truncate max-w-[200px]">
                  {typeof file !== "string" ? file.name : file}
                </span>
              </div>
            ) : previewSrc ? (
              <img
                src={previewSrc}
                alt="uploaded preview"
                className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-copy-primary p-4">
                <FaFile className="text-3xl text-primary" />
                <span className="text-xs truncate max-w-[200px]">
                  {typeof file !== "string" ? file.name : file}
                </span>
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card/90 text-copy-primary text-xs font-semibold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200 border border-border/80">
                <IoIosCloudUpload className="text-base text-primary" />
                <span>تغيير الصورة</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2.5 text-center">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-200 shadow-xs">
              <FaCamera className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-copy-primary group-hover:text-primary transition-colors">
                انقر لاختيار صورة
              </p>
              <p className="text-xs text-copy-secondary">PNG, JPG, WEBP أو SVG</p>
            </div>
          </div>
        )}
      </label>

      <input
        type={type}
        name={labelId}
        id={id || labelId}
        onChange={onChange}
        required={required}
        accept="image/*"
        className="hidden"
      />

      <ErrorMessage errors={errors} />
    </div>
  );
};

export default ImageInput;
