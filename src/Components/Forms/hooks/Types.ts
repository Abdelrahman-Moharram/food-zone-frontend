import { type ChangeEvent } from "react";

export interface SingleValidationRules {
  required?: { value: boolean; message?: string };
  minLength?: { value: number; message?: string };
  maxLength?: { value: number; message?: string };
  minValue?: { value: number; message?: string };
  maxValue?: { value: number; message?: string };
  regex?: { value: string; message?: string; message_ar?: string };
  file?: {
    allowedExtensions?: string[];
    maxSizeInMB?: number;
    message?: string;
  };
  alter_name?: string;
}

export type ValidationsType = Record<string, SingleValidationRules>;

export interface baseType {
  id?: string;
  name: string;
  slug?: string;
}

export interface baseSlugType {
  id?: string;
  name: string;
  slug: string;
}

export type FormType = Record<string, any>;
export type FormErrorsType = Record<string, any>;
export type onChangeType = (
  event: ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >,
  validationSchema?: SingleValidationRules,
) => void;
export type ValidationSchemaType = Record<string, SingleValidationRules>;
