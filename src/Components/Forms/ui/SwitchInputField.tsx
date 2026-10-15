import { cn } from "../../utils/helper";

export interface SwitchInputFieldProps {
  checked: boolean;
  id: string;
  handleCheck: () => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  description?: string;
}

const SwitchInputField = ({
  checked,
  handleCheck,
  id,
  label,
  disabled = false,
  className,
  description,
}: SwitchInputFieldProps) => {
  return (
    <div className={cn("inline-flex items-center gap-3 select-none", className)}>
      <label
        htmlFor={id}
        className={cn(
          "relative inline-flex items-center h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus-within:ring-2 focus-within:ring-primary/40 focus-within:ring-offset-2",
          checked ? "bg-primary" : "bg-container border border-border/80",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none"
        )}
      >
        <input
          type="checkbox"
          id={id}
          name={id}
          checked={checked}
          onChange={handleCheck}
          disabled={disabled}
          className="peer sr-only"
        />
        <span
          className={cn(
            "pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
            "ltr:translate-x-0.5 rtl:-translate-x-0.5",
            checked && "ltr:translate-x-5.5 rtl:-translate-x-5.5"
          )}
        />
      </label>

      {label && (
        <label htmlFor={id} className="cursor-pointer text-start">
          <span className="block text-sm sm:text-base font-medium text-copy-primary">
            {label}
          </span>
          {description && (
            <p className="text-xs text-copy-secondary mt-0.5">{description}</p>
          )}
        </label>
      )}
    </div>
  );
};

export default SwitchInputField;
