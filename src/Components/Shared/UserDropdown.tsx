import { useState, useRef, useEffect, useCallback } from "react";
import { 
  FiSettings, 
  FiLogOut, 
  FiChevronDown, 
  FiShield,
  FiUsers
} from "react-icons/fi";
import { IoStorefrontOutline } from "react-icons/io5";
import { LuLogIn } from "react-icons/lu";
import { ButtonLink } from "../Forms/ui";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useLogoutMutation } from "../../redux/features/authApiSlice";
import { setLogout } from "../../redux/features/authSlice";
import { cn } from "../utils/helper";

export default function UserDropdown() {
  const { t, i18n }       = useTranslation();
  const isRtl             = i18n.language !== "en";
  const navigate          = useNavigate();
  const dispatch          = useAppDispatch();
  const [logoutMutation]  = useLogoutMutation();

  const [isOpen, setIsOpen]           = useState(false);
  const [isMounted, setIsMounted]     = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const dropdownRef                   = useRef<HTMLDivElement>(null);

  const { 
    user, 
    isLoading, 
    isAuthenticated 
  } = useAppSelector((state) => state.auth);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isOpen) {
      setIsMounted(true);
      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => {
          setIsAnimating(true);
        });
        return () => cancelAnimationFrame(raf2);
      });
      return () => cancelAnimationFrame(raf1);
    } else {
      setIsAnimating(false);
      timer = setTimeout(() => {
        setIsMounted(false);
      }, 200);
    }
    return () => clearTimeout(timer);
  }, [isOpen]);

  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutMutation(undefined).unwrap();
    } catch {
      // ignore server errors during logout
    } finally {
      dispatch(setLogout());
      closeDropdown();
      navigate("/auth/login");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2.5 p-1 rounded-full animate-pulse">
        <div className="w-8 h-8 rounded-full bg-border/60" />
        <div className="hidden md:flex flex-col gap-1.5">
          <div className="h-2.5 w-16 bg-border/60 rounded-full" />
          <div className="h-2 w-10 bg-border/40 rounded-full" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <ButtonLink
        href="/auth/login"
        icon={<LuLogIn className="w-4 h-4" />}
        title={t("Sign In") || "تسجيل الدخول"}
        variant="primary"
        className="text-xs sm:text-sm py-1.5 px-3 rounded-full shadow-xs"
        iconRight
      />
    );
  }

  const displayName     = user.full_name || user.username || "User";
  const initialLetter   = displayName.trim().charAt(0).toUpperCase();
  const isAdmin         = Boolean(user.is_staff);
  const restaurantName  = user.worker?.restaurant_name;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "group flex items-center gap-2.5 p-1 sm:pe-3 rounded-full border transition-all duration-200 select-none active:scale-[0.97]",
          isOpen
            ? "border-primary/50 bg-primary/10 shadow-sm ring-2 ring-primary/20"
            : "border-border/70 bg-card/60 hover:bg-card hover:border-border shadow-xs hover:shadow-sm"
        )}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={t("User Menu") || "قائمة المستخدم"}
      >
        {/* Avatar with pulse online status */}
        <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-emerald-600 text-white font-bold text-xs shadow-xs ring-1 ring-white/20 shrink-0 select-none">
          {initialLetter}
          {user.is_active && (
            <span className="absolute -bottom-0.5 -end-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border-2 border-background ring-1 ring-emerald-500/40" />
            </span>
          )}
        </div>

        {/* User Identity Snippet (Desktop / Tablet) */}
        <div className="hidden md:flex flex-col text-start leading-tight max-w-[120px]">
          <span className="text-xs font-semibold text-copy-primary truncate group-hover:text-primary transition-colors">
            {displayName}
          </span>
          <span className="text-[10px] text-copy-secondary/80 flex items-center gap-1 font-medium truncate">
            {isAdmin ? (
              <span className="text-primary font-semibold">{t("System Admin") || "مسؤول النظام"}</span>
            ) : restaurantName ? (
              <span className="truncate">{restaurantName}</span>
            ) : (
              <span>{user.role || t("Worker") || "موظف"}</span>
            )}
          </span>
        </div>

        <FiChevronDown
          className={cn(
            "w-3.5 h-3.5 text-copy-secondary transition-transform duration-300 ease-out",
            isOpen && "rotate-180 text-primary"
          )}
        />
      </button>

      {/* Dropdown Menu with Smooth Enter/Exit Transitions */}
      {isMounted && (
        <div
          dir={isRtl ? "rtl" : "ltr"}
          role="menu"
          className={cn(
            "absolute mt-2.5 w-72 rounded-3xl border border-border/80 bg-card/95 backdrop-blur-2xl shadow-2xl z-[60] overflow-hidden origin-top",
            "ltr:right-0 rtl:left-0",
            "transition-all duration-200 ease-out",
            isAnimating
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 -translate-y-2 pointer-events-none duration-150 ease-in"
          )}
        >
          {/* Header Banner */}
          <div className="p-4 border-b border-border/60 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center text-lg w-12 h-12 text-white font-extrabold rounded-2xl shadow-md ring-2 ring-primary/20 bg-gradient-to-tr from-primary to-emerald-600 shrink-0 select-none">
                {initialLetter}
              </div>
              <div className="flex-1 min-w-0 text-start">
                <h4 className="text-sm font-bold text-copy-primary truncate">
                  {displayName}
                </h4>
                <p className="text-xs text-copy-secondary/80 truncate dir-ltr text-start">
                  @{user.username}
                </p>

                {/* Role / Restaurant Badges */}
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  {isAdmin ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-primary/15 text-primary border border-primary/30 shadow-xs">
                      <FiShield className="w-3 h-3 text-primary" />
                      {t("System Admin") || "مسؤول النظام"}
                    </span>
                  ) : (
                    <>
                      {restaurantName && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary border border-primary/25 shadow-xs truncate max-w-[150px]">
                          <IoStorefrontOutline className="w-3 h-3 shrink-0" />
                          <span className="truncate">{restaurantName}</span>
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {t("Worker") || "موظف"}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-2 space-y-1">
            <Link
              to="/settings"
              onClick={closeDropdown}
              className="flex items-center gap-3 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-copy-primary rounded-2xl hover:bg-primary/10 hover:text-primary transition-all duration-150 group"
            >
              <FiSettings className="w-4 h-4 text-copy-secondary group-hover:text-primary group-hover:rotate-45 transition-all duration-200" />
              <span>{t("Settings") || "الإعدادات"}</span>
            </Link>

            {isAdmin && (
              <Link
                to="/users"
                onClick={closeDropdown}
                className="flex items-center gap-3 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-copy-primary rounded-2xl hover:bg-primary/10 hover:text-primary transition-all duration-150 group"
              >
                <FiUsers className="w-4 h-4 text-copy-secondary group-hover:text-primary group-hover:scale-110 transition-all duration-200" />
                <span>{t("Users Management") || "إدارة المستخدمين"}</span>
              </Link>
            )}
          </div>

          {/* Divider & Logout */}
          <div className="p-2 border-t border-border/60">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-rose-600 dark:text-rose-400 rounded-2xl hover:bg-rose-500/10 active:scale-[0.98] transition-all duration-150 group"
            >
              <FiLogOut className="w-4 h-4 text-rose-500 transition-transform duration-200 group-hover:scale-110 ltr:group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
              <span>{t("Logout") || "تسجيل الخروج"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
