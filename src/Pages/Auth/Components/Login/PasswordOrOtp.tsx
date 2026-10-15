import { FormEvent, useRef, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { IoLockClosedOutline, IoKeyOutline, IoPersonOutline, IoChevronBackOutline } from 'react-icons/io5';
import { Input, Button } from '../../../../Components/Forms/ui';

interface PasswordOrOtpProps {
  identifier: string;
  password: string;
  setPassword: (val: string) => void;
  otp: string;
  setOtp: (val: string) => void;
  authMode: 'password' | 'otp';
  setAuthMode: (mode: 'password' | 'otp') => void;
  canOtp: boolean;
  resendCooldown: number;
  onRequestOtp: () => void;
  onSubmit: () => void;
  onBack: () => void;
  isLoading: boolean;
}

const PasswordOrOtp = ({
  identifier,
  password,
  setPassword,
  otp,
  setOtp,
  authMode,
  setAuthMode,
  canOtp,
  resendCooldown,
  onRequestOtp,
  onSubmit,
  onBack,
  isLoading,
}: PasswordOrOtpProps) => {
  const { t } = useTranslation();
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const otpDigits = useMemo(() => {
    const arr = Array(6).fill('');
    for (let i = 0; i < otp.length && i < 6; i++) {
      arr[i] = otp[i];
    }
    return arr;
  }, [otp]);

  useEffect(() => {
    if (authMode === 'otp') {
      setTimeout(() => otpRefs.current[0]?.focus(), 50);
    }
  }, [authMode]);

  const handleOtpChange = (index: number, val: string) => {
    const cleaned = val.replace(/\D/g, '');
    const char = cleaned.slice(-1);
    const arr = otp.split('');
    while (arr.length < 6) arr.push('');
    arr[index] = char;
    const newOtp = arr.join('').slice(0, 6);
    setOtp(newOtp);

    if (char && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    setOtp(pasted);
    const focusIdx = Math.min(pasted.length, 5);
    otpRefs.current[focusIdx]?.focus();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (authMode === 'password' && password) {
      onSubmit();
    } else if (authMode === 'otp' && otp.length === 6) {
      onSubmit();
    }
  };

  const switchToOtp = () => {
    setAuthMode('otp');
    onRequestOtp();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between p-2.5 rounded-2xl bg-container/60 border border-border/70 text-xs">
        <div className="flex items-center gap-2 truncate">
          <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <IoPersonOutline className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-copy-primary truncate max-w-[200px]">{identifier}</span>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-primary hover:underline font-medium text-xs shrink-0"
        >
          <span>{t('Change') || 'تعديل'}</span>
          <IoChevronBackOutline className="w-3 h-3 rtl:rotate-180" />
        </button>
      </div>

      {authMode === 'password' ? (
        <div className="space-y-4">
          <Input
            labelId="password"
            type="password"
            label={t('Password')}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<IoLockClosedOutline className="w-4 h-4 text-copy-secondary" />}
            required
          />

          {canOtp && (
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={switchToOtp}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:brightness-125 transition-all"
              >
                <IoKeyOutline className="w-3.5 h-3.5" />
                <span>{t('Or continue with OTP')}</span>
              </button>
            </div>
          )}

          <Button
            title={isLoading ? t('Logging in...') : t('Sign In')}
            submit
            variant="primary"
            disabled={!password || isLoading}
            isLoading={isLoading}
            className="w-full py-3 font-semibold shadow-md shadow-primary/20"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-copy-primary">
              {t('Verification Code')}
              <span className="text-rose-500 ms-1">*</span>
            </label>
            <button
              type="button"
              onClick={() => setAuthMode('password')}
              className="text-xs text-primary hover:underline font-medium"
            >
              {t('Login with Password')}
            </button>
          </div>

          <div className="flex items-center justify-between gap-2" dir="ltr">
            {otpDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  otpRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                onPaste={handleOtpPaste}
                onFocus={(e) => e.target.select()}
                className="w-11 h-12 sm:w-12 sm:h-13 text-center text-xl font-bold rounded-xl border border-border/80 bg-card/80 text-copy-primary shadow-xs transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-border"
                placeholder="-"
              />
            ))}
          </div>

          <div className="text-center text-xs text-copy-secondary">
            {resendCooldown > 0 ? (
              <span>
                {t('Resend code in')}{' '}
                <strong className="text-primary font-semibold">
                  00:{resendCooldown.toString().padStart(2, '0')}
                </strong>
              </span>
            ) : (
              <button
                type="button"
                onClick={onRequestOtp}
                className="text-primary font-semibold hover:underline"
              >
                {t('Resend Code')}
              </button>
            )}
          </div>

          <Button
            title={isLoading ? t('Logging in...') : t('Sign In')}
            submit
            variant="primary"
            disabled={otp.length !== 6 || isLoading}
            isLoading={isLoading}
            className="w-full py-3 font-semibold shadow-md shadow-primary/20"
          />
        </div>
      )}
    </form>
  );
};

export default PasswordOrOtp;