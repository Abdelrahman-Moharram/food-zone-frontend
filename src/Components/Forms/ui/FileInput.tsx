import React, { type ChangeEvent, useMemo, useState } from "react";
import { FaFile, FaVideo, FaCloudUploadAlt, FaTimes } from "react-icons/fa";
import ErrorMessage from "./ErrorMessage";
import type { SingleValidationRules } from "../hooks/Types";
import { DefaultInputValidate } from "../hooks/useValidations";
import { cn } from "../../utils/helper";

export interface FileInputProps {
  labelId: string;
  label: string;
  file?: File | FileList | string | null;
  required?: boolean;
  id?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  validationSchema?: SingleValidationRules;
  errors?: string[] | string | any;
  multiple?: boolean;
  className?: string;
}

const FileInput = ({
  labelId,
  label,
  file,
  required = false,
  id,
  onChange,
  validationSchema,
  errors,
  multiple = false,
  className,
}: FileInputProps) => {
  const [localErrors, setLocalErrors] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const previewItems = useMemo(() => {
    if (!file) return [];
    if (file instanceof FileList) return Array.from(file);
    if (file instanceof File) return [file];
    if (typeof file === "string") return [file];
    return [];
  }, [file]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const collectedErrors: string[] = [];

    if (files && validationSchema) {
      for (let i = 0; i < files.length; i++) {
        const error = DefaultInputValidate({
          name: e.target.name,
          value: files[i],
          validationSchema,
        });
        if (error) {
          collectedErrors.push(...(error.filter(Boolean) as string[]));
        }
      }
    }

    setLocalErrors(collectedErrors);

    if (!collectedErrors.length) {
      onChange?.(e);
    } else {
      e.target.value = "";
    }
  };

  const renderPreviewItem = (item: File | string, index: number) => {
    const key = `${labelId}-${index}`;

    if (typeof item === "string") {
      const isImage = /\.(png|jpe?g|webp|svg|gif)$/i.test(item);
      const fullUrl = item.startsWith("http")
        ? item
        : (import.meta.env.VITE_BASE_URL || "") + (item.startsWith("/") ? item : "/" + item);

      return isImage ? (
        <div
          key={key}
          className="relative group/preview size-24 rounded-xl overflow-hidden border border-border/80 shadow-xs"
        >
          <img src={fullUrl} className="w-full h-full object-cover" alt="uploaded" />
        </div>
      ) : (
        <div
          key={key}
          className="flex items-center gap-2 p-2.5 rounded-xl border border-border/70 bg-card/80 text-xs text-copy-primary shadow-xs max-w-[200px]"
        >
          <FaFile className="shrink-0 text-primary text-base" />
          <span className="truncate">{item.split("/").pop()}</span>
        </div>
      );
    }

    if (item.type.startsWith("image/")) {
      return (
        <div
          key={key}
          className="relative group/preview size-24 rounded-xl overflow-hidden border border-border/80 shadow-xs"
        >
          <img
            src={URL.createObjectURL(item)}
            className="w-full h-full object-cover"
            alt="preview"
          />
        </div>
      );
    }

    if (item.type.startsWith("video/")) {
      return (
        <div
          key={key}
          className="flex items-center gap-2 p-2.5 rounded-xl border border-border/70 bg-card/80 text-xs text-copy-primary shadow-xs max-w-[200px]"
        >
          <FaVideo className="shrink-0 text-secondary text-base" />
          <span className="truncate">{item.name}</span>
        </div>
      );
    }

    return (
      <div
        key={key}
        className="flex items-center gap-2 p-2.5 rounded-xl border border-border/70 bg-card/80 text-xs text-copy-primary shadow-xs max-w-[200px]"
      >
        <FaFile className="shrink-0 text-primary text-base" />
        <span className="truncate">{item.name}</span>
      </div>
    );
  };

  const allErrors = [
    ...(typeof errors === "string" ? [errors] : errors || []),
    ...localErrors,
  ];

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
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={() => setIsDragging(false)}
        className={cn(
          "relative flex flex-col items-center justify-center min-h-[160px] p-6 rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer select-none group",
          isDragging
            ? "border-primary bg-primary/10 ring-2 ring-primary/20 scale-[0.99]"
            : "border-border/80 bg-card/50 hover:bg-card/90 hover:border-primary/60",
          allErrors.length > 0 && "border-rose-500/80 bg-rose-500/5"
        )}
      >
        {previewItems.length > 0 ? (
          <div className="flex flex-wrap items-center justify-center gap-3">
            {previewItems.map((f, i) => renderPreviewItem(f, i))}
            <div className="text-xs text-copy-secondary mt-2 w-full text-center group-hover:text-primary transition-colors">
              انقر لتغيير أو إضافة ملفات
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2.5 text-center">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-200 shadow-xs">
              <FaCloudUploadAlt className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-copy-primary group-hover:text-primary transition-colors">
                اسحب الملفات هنا أو تصفح
              </p>
              {validationSchema?.file?.allowedExtensions && (
                <p className="text-xs text-copy-secondary">
                  الامتدادات المسموحة: {validationSchema.file.allowedExtensions.join(", ")}
                </p>
              )}
              {validationSchema?.file?.maxSizeInMB && (
                <p className="text-xs text-copy-secondary">
                  الحد الأقصى: {validationSchema.file.maxSizeInMB} ميغابايت
                </p>
              )}
            </div>
          </div>
        )}
      </label>

      <input
        type="file"
        id={id || labelId}
        name={labelId}
        onChange={handleChange}
        required={required}
        multiple={multiple}
        accept={validationSchema?.file?.allowedExtensions?.join(",")}
        className="hidden"
      />

      <ErrorMessage errors={allErrors} />
    </div>
  );
};

export default FileInput;
