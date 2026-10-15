'use client';

import React, { type ChangeEvent } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import Input from "./Input";
import type { SingleValidationRules } from "../hooks/Types";

export interface PhoneNumberInputFieldProps {
  labelId: string;
  onChange: (
    e: ChangeEvent<HTMLInputElement>,
    validationSchema?: SingleValidationRules | any
  ) => void;
  value: string | number | null;
  label: string;
  required?: boolean;
  children?: React.ReactNode;
  errors?: string[] | string | any;
  placeholder?: string;
  inputClassName?: string;
  className?: string;
  disabled?: boolean;
  max_length?: number;
  countryCode?: string;
  validationSchema?: SingleValidationRules | any;
}

const PhoneNumberInputField = ({
  labelId,
  onChange,
  value,
  label,
  placeholder,
  required = false,
  errors,
  inputClassName,
  className,
  disabled = false,
  max_length = 15,
  countryCode,
  validationSchema,
  children,
}: PhoneNumberInputFieldProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const onlyNumbers = e.target.value.replace(/[^0-9+]/g, "");
    e.target.value = onlyNumbers;

    if (validationSchema !== undefined) {
      onChange(e, validationSchema);
    } else {
      onChange(e);
    }
  };

  return (
    <div className="relative w-full">
      <Input
        type="tel"
        label={label}
        labelId={labelId}
        errors={errors}
        onChange={handleChange}
        value={value}
        required={required}
        placeholder={placeholder || "05xxxxxxxx"}
        inputClassName={inputClassName}
        className={className}
        disabled={disabled}
        max_length={max_length}
        validationSchema={validationSchema}
        icon={
          <div className="flex items-center gap-1.5 text-copy-secondary">
            <FaPhoneAlt className="w-3.5 h-3.5 text-primary" />
            {countryCode && (
              <span className="text-xs font-semibold text-copy-primary">
                {countryCode}
              </span>
            )}
          </div>
        }
      >
        {children}
      </Input>
    </div>
  );
};

export default PhoneNumberInputField;
