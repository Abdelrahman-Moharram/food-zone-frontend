import i18n from "i18next";
import type { SingleValidationRules } from "./Types";

interface DefaultInputProps {
  name: string;
  value: string | number | boolean | File | FileList | File[];
  validationSchema: SingleValidationRules;
  alter_name?: string;
}

const defaultRequiredError = (name: string, alter_name?: string) =>
  i18n.t("validations.required", { name: alter_name || name });

const defaultNumberValueError = (name: string, alter_name?: string) =>
  i18n.t("validations.numberValue", { name: alter_name || name });

const defaultMaxValueError = (
  name: string,
  maxValue: number,
  alter_name?: string,
) =>
  i18n.t("validations.maxValue", {
    name: alter_name || name,
    maxValue,
  });

const defaultMinValueError = (
  name: string,
  MinValue: number,
  alter_name?: string,
) =>
  i18n.t("validations.minValue", {
    name: alter_name || name,
    minValue: MinValue,
  });

const defaultMaxLengthError = (
  name: string,
  maxLength: number,
  alter_name?: string,
) =>
  i18n.t("validations.maxLength", {
    name: alter_name || name,
    maxLength,
  });

const defaultMinLengthError = (
  name: string,
  minLength: number,
  alter_name?: string,
) =>
  i18n.t("validations.minLength", {
    name: alter_name || name,
    minLength,
  });

const defaultExtensionError = (exts: string[], alter_name?: string) =>
  i18n.t("validations.fileExtension", {
    extensions: exts.join(", "),
    fieldLabel: alter_name
      ? ` ${i18n.t("validations.fieldLabel", { name: alter_name })}`
      : "",
  });

const defaultFileSizeError = (size: number, alter_name?: string) =>
  i18n.t("validations.fileSize", {
    size,
    fieldLabel: alter_name
      ? ` ${i18n.t("validations.fieldLabel", { name: alter_name })}`
      : "",
  });

// ✅ helper: normalize a single file against file rules
const validateSingleFile = (
  file: File,
  rules: NonNullable<SingleValidationRules["file"]>,
  alter_name?: string,
): string | undefined => {
  if (rules.allowedExtensions?.length) {
    const ext = "." + (file.name.split(".").pop()?.toLowerCase() ?? "");
    const normalizedAllowed = rules.allowedExtensions.map((e) =>
      e.toLowerCase().startsWith(".") ? e.toLowerCase() : `.${e.toLowerCase()}`,
    );
    if (!normalizedAllowed.includes(ext)) {
      return (
        rules.message ||
        defaultExtensionError(rules.allowedExtensions, alter_name)
      );
    }
  }

  if (rules.maxSizeInMB && file.size / (1024 * 1024) > rules.maxSizeInMB) {
    return rules.message || defaultFileSizeError(rules.maxSizeInMB, alter_name);
  }

  return undefined;
};

export const DefaultInputValidate = ({
  name,
  value,
  validationSchema,
}: DefaultInputProps) => {
  const alter_name = validationSchema.alter_name;

  // ✅ Required validation (runs first, covers all value types)
  const isEmpty =
    value === null ||
    value === undefined ||
    value === "" ||
    (value instanceof FileList && value.length === 0) ||
    (Array.isArray(value) && value.length === 0);

  if (validationSchema.required && isEmpty) {
    return [
      validationSchema.required.message ||
        defaultRequiredError(name, alter_name),
    ];
  }

  // if not required and empty, skip remaining rules (nothing to validate)
  if (isEmpty) return undefined;

  // ✅ File validation (single File, FileList, or File[])
  const fileRules = validationSchema.file;
  if (fileRules && (value instanceof File || value instanceof FileList || Array.isArray(value))) {
    const files: File[] =
      value instanceof File
        ? [value]
        : value instanceof FileList
          ? Array.from(value)
          : (value as File[]);

    const errors = files
      .map((f) => validateSingleFile(f, fileRules, alter_name))
      .filter((e): e is string => !!e);

    if (errors.length) {
      // dedupe identical messages (common when same rule fails on multiple files)
      return Array.from(new Set(errors));
    }
  }

  // ✅ Number value validation
  if (validationSchema.minValue || validationSchema.maxValue) {
    if (Number.isNaN(Number(value))) {
      const rule = validationSchema.maxValue || validationSchema.minValue;
      return [rule?.message || defaultNumberValueError(name, alter_name)];
    }

    const numericValue = Number(value);
    if (
      validationSchema.maxValue &&
      numericValue > validationSchema.maxValue.value
    ) {
      return [
        validationSchema.maxValue.message ||
          defaultMaxValueError(name, validationSchema.maxValue.value, alter_name),
      ];
    }
    if (
      validationSchema.minValue &&
      numericValue < validationSchema.minValue.value
    ) {
      return [
        validationSchema.minValue.message ||
          defaultMinValueError(name, validationSchema.minValue.value, alter_name),
      ];
    }
  }

  // ✅ Length validation
  const strVal = value?.toString?.() ?? "";
  if (
    validationSchema.maxLength &&
    strVal.length > validationSchema.maxLength.value
  ) {
    return [
      validationSchema.maxLength.message ||
        defaultMaxLengthError(name, validationSchema.maxLength.value, alter_name),
    ];
  }

  if (
    validationSchema.minLength &&
    strVal.length < validationSchema.minLength.value
  ) {
    return [
      validationSchema.minLength.message ||
        defaultMinLengthError(name, validationSchema.minLength.value, alter_name),
    ];
  }

  // ✅ Regex validation
  if (validationSchema.regex?.value) {
    const re = new RegExp(validationSchema.regex.value);
    if (!re.test(strVal)) {
      const arMessage = validationSchema.regex.message_ar;
      const fallback =
        validationSchema.regex.message || i18n.t("validations.regex", { name });
      return [i18n.language.startsWith("ar") ? arMessage || fallback : fallback];
    }
  }

  return undefined;
};