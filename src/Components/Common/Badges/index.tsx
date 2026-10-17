import { type HTMLAttributes, forwardRef } from 'react'

type BadgeVariant =
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant
    /** Show a small status dot before the label */
    dot?: boolean
}

const variantStyles: Record<BadgeVariant, string> = {
    default:
        'bg-muted text-muted-foreground dark:bg-muted/50',
    primary:
        'bg-primary/10 text-primary dark:bg-primary/15',
    secondary:
        'bg-secondary/10 text-secondary-foreground dark:bg-secondary/15',
    success:
        'bg-green-500/10 text-green-600 dark:text-green-400',
    warning:
        'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    error:
        'bg-red-500/10 text-red-600 dark:text-red-400',
}

const dotStyles: Record<BadgeVariant, string> = {
    default: 'bg-muted-foreground',
    primary: 'bg-primary',
    secondary: 'bg-secondary-foreground',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
    ({ variant = 'default', dot = false, className = '', children, ...props }, ref) => {
        return (
            <span
                ref={ref}
                className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors duration-200 ${variantStyles[variant]} ${className}`}
                {...props}
            >
                {children}

                {dot && (
                    <span
                        className={`w-1.5 h-1.5 rounded-full ${dotStyles[variant]}`}
                    />
                )}
            </span>
        )
    }
)

Badge.displayName = 'Badge'