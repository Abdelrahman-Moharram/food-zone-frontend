import { useTranslation } from "react-i18next";
import {
  IoRestaurantOutline,
  IoShieldCheckmarkOutline,
  IoFlashOutline,
} from "react-icons/io5";
import Form from "./Components/Form";

const Login = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language !== "en";

  return (
    <main
      dir={isRtl ? "rtl" : "ltr"}
      className="min-h-screen w-full flex bg-background text-color relative overflow-hidden selection:bg-primary/20 selection:text-primary"
    >
      {/* Brand Hero Section - Desktop Only */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-[#05453a] text-white">
        {/* Background Image with Rich Emerald/Dark Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src="/login-bg.avif"
            alt={t("Food Zone Ambience")}
            className="w-full h-full object-cover opacity-35 mix-blend-overlay scale-105 transition-transform duration-1000 ease-out"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#021c17] via-[#05453a]/80 to-[#021c17]/90" />
        </div>

        {/* Ambient Glow in Hero */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header / Brand Identity */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg">
              <IoRestaurantOutline className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight block">Food Zone</span>
              <span className="text-xs text-emerald-200/80 block">فود زون</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur-md text-emerald-100 border border-white/15">
            <IoShieldCheckmarkOutline className="w-4 h-4 text-emerald-300" />
            <span>{t("Worker Portal")}</span>
          </div>
        </div>

        {/* Hero Headline & Features */}
        <div className="relative z-10 max-w-lg space-y-8 my-auto">
          <div className="space-y-4">
            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight text-white drop-shadow-sm">
              Food Zone
            </h1>
            <p className="text-lg text-emerald-100/90 leading-relaxed font-light">
              {t("Experience the best food delivery service. Fresh, fast, and delicious.")}
            </p>
          </div>

          {/* Quick Highlights */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                <IoFlashOutline className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-white">سرعة فائقة</p>
                <p className="text-emerald-200/70">تحديثات فورية للطلبات</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                <IoShieldCheckmarkOutline className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-white">نظام محمي</p>
                <p className="text-emerald-200/70">أمان عالي وصلاحيات دقيقة</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="relative z-10 text-xs text-emerald-200/60">
          Food Zone &bull; Kitchen & Order Operations Platform
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        {/* Background Decorative Ambient Circles */}
        <div className="absolute top-1/4 -right-24 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-1/4 -left-24 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />

        <Form />
      </div>
    </main>
  );
};

export default Login;