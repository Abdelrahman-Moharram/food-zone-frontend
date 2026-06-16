import React from 'react'
import Spinner from './Spinner';
import { Link } from 'react-router-dom';

type Variants =
  | 'primary'
  | 'secondary'
  | 'primary-outline'
  | 'secondary-outline'
  | 'red'
  | 'blue'
  | 'blue-outline'
  | 'black';

interface props {
  title      : string
  submit?    : boolean;
  isLoading? : boolean;
  onClick?   : () => void;
  icon?      : React.ReactNode;
  className? : string;
  disabled?  : boolean;
  variant    : Variants;
  iconRight? : boolean;
  fontBold?  : boolean;
}

interface LinkProps {
  title      : string
  submit?    : boolean;
  isLoading? : boolean;
  href?      : string;
  icon?      : React.ReactNode;
  className? : string;
  disabled?  : boolean;
  variant    : Variants;
  iconRight? : boolean;
  fontBold?  : boolean;
}

const getVariant = ({ variant, disabled }: { variant: string; disabled: boolean }) => {
  const variantClassNames: Record<string, string> = {
    'primary':
      `${disabled ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-primary-hover'}
       text-white focus-visible:outline-primary`,

    'primary-outline':
      `${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/10'}
       border border-primary text-primary focus-visible:outline-primary`,

    'secondary':
      `${disabled ? 'bg-secondary/50 cursor-not-allowed' : 'bg-secondary hover:bg-secondary-hover'}
       text-white focus-visible:outline-secondary`,

    'secondary-outline':
      `${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-secondary/10'}
       border border-secondary text-secondary focus-visible:outline-secondary`,

    'blue':
      `${disabled ? 'bg-blue-600/50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
       text-white`,

    'blue-outline':
      `${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50'}
       border border-blue-600 text-blue-600`,

    'red':
      `${disabled ? 'bg-red-500/50 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}
       text-white`,

    'red-outline':
      `${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-50'}
       border border-red-500 text-red-500`,

    'black':
      `${disabled ? 'bg-neutral-700 cursor-not-allowed' : 'bg-neutral-900 hover:bg-neutral-700'}
       text-white`,
  };

  return variantClassNames[variant] ?? '';
};

const BASE =
  'w-full py-1 px-3 rounded-lg shadow-md ' +
  'transition-all duration-150 ease-in-out ' +
  'active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';

const INNER = 'flex justify-center items-center gap-3 text-center leading-6';

const Button = ({
  title,
  submit,
  isLoading,
  onClick,
  icon,
  variant,
  className,
  disabled = false,
  iconRight = false,
  fontBold = true,
}: props) => {
  return (
    <button
      type={submit ? 'submit' : 'button'}
      onClick={onClick}
      className={`${BASE} ${getVariant({ variant, disabled })} ${fontBold ? 'font-bold' : 'font-medium'} ${className ?? ''}`}
      disabled={disabled}
    >
      <div className={INNER}>
        {isLoading ? (
          <Spinner sm />
        ) : iconRight ? (
          <>
            {icon}
            {title}
          </>
        ) : (
          <>
            {title}
            {icon}
          </>
        )}
      </div>
    </button>
  );
};

const LINK_BASE =
  'w-full py-2 rounded-xl border min-w-[150px] ' +
  'transition-all duration-150 ease-in-out ' +
  'active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';

export const ButtonLink = ({
  title,
  submit,
  isLoading,
  icon,
  variant,
  href,
  className,
  disabled = false,
  iconRight = false,
}: LinkProps) => {
  return (
    <Link
      type={submit ? 'submit' : 'button'}
      to={href}
      className={`${LINK_BASE} ${getVariant({ variant, disabled })} ${className ?? ''}`}
    >
      <div className={`${INNER} font-bold`}>
        {isLoading ? (
          <Spinner sm />
        ) : iconRight ? (
          <>
            {icon}
            {title}
          </>
        ) : (
          <>
            {title}
            {icon}
          </>
        )}
      </div>
    </Link>
  );
};

export default Button;