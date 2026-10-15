import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IoRestaurantOutline } from 'react-icons/io5';
import BaseForm from './Login/BaseForm';
import PasswordOrOtp from './Login/PasswordOrOtp';
import { useLoginMutation, useOtpLoginMutation, useOtpRequestMutation } from '../../../redux/features/authApiSlice';
import notification from '../../../Components/Notifications';
import { setAuth, setLogout } from '../../../redux/features/authSlice';
import { useAppDispatch } from '../../../redux/hooks';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?\d{8,15}$/;

const Form = () => {
  const { t } = useTranslation();
  const [sp] = useSearchParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [authMode, setAuthMode] = useState<'password' | 'otp'>('password');
  const [resendCooldown, setResendCooldown] = useState(0);

  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [otpLoginMutation, { isLoading: isOtpLoading }] = useOtpLoginMutation();
  const [otpRequestMutation, { isLoading: isRequestLoading }] = useOtpRequestMutation();

  const canOtp = useMemo(() => {
    const val = identifier.trim();
    return EMAIL_RE.test(val) || PHONE_RE.test(val.replace(/[\s\-()]/g, ''));
  }, [identifier]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleRequestOtp = async () => {
    try {
      await otpRequestMutation({ identifier }).unwrap();
      notification.success(t('Verification code sent successfully') || 'تم إرسال رمز التحقق بنجاح');
      setResendCooldown(60);
    } catch (err: any) {
      notification.error(err?.data?.error || err?.data?.detail || t('Failed to send verification code'));
    }
  };

  const handleSubmit = async () => {
    try {
      const res = authMode === 'password'
        ? await loginMutation({ identifier, password }).unwrap()
        : await otpLoginMutation({ identifier, code: otp }).unwrap();

      if (res?.user) {
        if (!res.user.worker && !res.user.is_staff) {
          notification.error(
            t("You can't access the worker dashboard with normal account please contact the admin")
          );
          dispatch(setLogout());
        } else {
          notification.success(t('Welcome Back!'));
          dispatch(setAuth(res.user));
          navigate(sp.get('next') || '/');
        }
      }
    } catch (err: any) {
      const msg = err?.data?.detail || err?.data?.non_field_errors || err?.data?.error || t('Invalid credentials');
      notification.error(msg);
    }
  };

  return (
    <div className="w-full max-w-[440px] bg-card border border-border rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-md relative z-10 transition-all">
      <div className="text-center mb-7">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs">
          <IoRestaurantOutline className="w-7 h-7" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {t('Welcome Back!')}
        </h2>
        <p className="text-sm text-copy-secondary mt-1.5">
          {step === 1 ? t('Please login to continue to your account.') : t('Complete verification to sign in.')}
        </p>
      </div>

      {step === 1 ? (
        <BaseForm
          identifier={identifier}
          setIdentifier={setIdentifier}
          onNext={() => setStep(2)}
        />
      ) : (
        <PasswordOrOtp
          identifier={identifier}
          password={password}
          setPassword={setPassword}
          otp={otp}
          setOtp={setOtp}
          authMode={authMode}
          setAuthMode={setAuthMode}
          canOtp={canOtp}
          resendCooldown={resendCooldown}
          onRequestOtp={handleRequestOtp}
          onSubmit={handleSubmit}
          onBack={() => {
            setStep(1);
            setPassword('');
            setOtp('');
            setAuthMode('password');
          }}
          isLoading={isLoginLoading || isOtpLoading || isRequestLoading}
        />
      )}

      <div className="mt-8 pt-5 border-t border-border/60 text-center">
        <p className="text-xs text-copy-secondary">
          &copy; {new Date().getFullYear()} Food Zone. {t('All rights reserved.')}
        </p>
      </div>
    </div>
  );
};

export default Form;
