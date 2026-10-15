// 'use client';

// import React, { type ChangeEvent, useEffect, useState } from "react";
// import Input from "./Input";
// import { BsCurrencyDollar } from "react-icons/bs";
// import { numberToMoney } from "../../utils/helper";
// import type { SingleValidationRules } from "../hooks/Types";

// export interface AmountInputFieldProps {
//   labelId: string;
//   onChange: (
//     e: ChangeEvent<HTMLInputElement>,
//     validationSchema?: SingleValidationRules | any
//   ) => void;
//   value: string | number | null;
//   label: string;
//   currency?: React.ReactNode;
//   required?: boolean;
//   children?: React.ReactNode;
//   errors?: string[] | string | any;
//   defaultValue?: string | number;
//   placeholder?: string;
//   inputClassName?: string;
//   className?: string;
//   disabled?: boolean;
//   validationSchema?: SingleValidationRules | any;
// }

// const AmountInputField = ({
//   labelId,
//   onChange,
//   value,
//   currency,
//   label,
//   placeholder,
//   required = false,
//   defaultValue,
//   errors,
//   inputClassName,
//   className,
//   disabled = false,
//   validationSchema,
//   children,
// }: AmountInputFieldProps) => {
//   const [amountValue, setAmountValue] = useState<string>("");

//   useEffect(() => {
//     if (value !== null && value !== undefined && value !== "") {
//       try {
//         setAmountValue(numberToMoney(value));
//       } catch {
//         setAmountValue(value.toString());
//       }
//     } else {
//       setAmountValue("");
//     }
//   }, [value]);

//   const handleAmountValue = (e: ChangeEvent<HTMLInputElement>) => {
//     const rawVal = e.target.value.replace(/[^0-9.]/g, "");
//     try {
//       setAmountValue(numberToMoney(rawVal));
//     } catch {
//       setAmountValue(rawVal);
//     }
//     e.target.value = rawVal;

//     if (validationSchema !== undefined) {
//       onChange(e, validationSchema);
//     } else {
//       onChange(e);
//     }
//   };

//   return (
//     <div className="relative w-full">
//       <Input
//         type="text"
//         label={label}
//         labelId={labelId}
//         errors={errors}
//         onChange={handleAmountValue}
//         value={amountValue}
//         defaultValue={defaultValue}
//         required={required}
//         placeholder={placeholder || "0.00"}
//         inputClassName={inputClassName}
//         className={className}
//         disabled={disabled}
//         validationSchema={validationSchema}
//         icon={
//           <div className="flex items-center justify-center size-6 rounded-lg bg-secondary/15 text-secondary font-bold text-xs shadow-xs">
//             {currency || <BsCurrencyDollar className="w-3.5 h-3.5" />}
//           </div>
//         }
//       >
//         {children}
//       </Input>
//     </div>
//   );
// };

// export default AmountInputField;
