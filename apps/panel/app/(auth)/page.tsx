"use client";

import { useState, useEffect } from "react";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

type LoginMode = "password" | "otp";

const OTP_EXPIRY_SECONDS = 120; // 2 minutes

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

const toPersianDigits = (n: number): string =>
  n.toString().replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)] ?? d);

const formatOtpCountdown = (secondsLeft: number): string => {
  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;
  return `${toPersianDigits(m)}:${toPersianDigits(s).padStart(2, "۰")}`;
};

const phoneSchema = z
  .string()
  .min(1, "شماره موبایل را وارد کنید")
  .regex(/^09\d{9}$/, "شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)");

const loginSchema = z
  .object({
    mode: z.enum(["password", "otp"]),
    phone: phoneSchema,
    password: z.string().optional(),
    otp: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.mode === "password") {
      if (!data.password || data.password.length < 6) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "رمز عبور حداقل ۶ کاراکتر باشد",
          path: ["password"],
        });
      }
    } else {
      if (!data.otp || !/^\d{6}$/.test(data.otp)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "کد یکبار مصرف ۶ رقمی را وارد کنید",
          path: ["otp"],
        });
      }
    }
  });

type LoginFormValues = z.infer<typeof loginSchema>;

const defaultValues: LoginFormValues = {
  mode: "password",
  phone: "",
  password: "",
  otp: "",
};

const LoginPage = (): React.ReactElement => {
  const [otpSent, setOtpSent] = useState(false);
  const [otpExpiresAt, setOtpExpiresAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues,
  });

  const mode = watch("mode");
  const phone = watch("phone");
  const isPhoneComplete = /^09\d{9}$/.test(phone ?? "");

  const otpSecondsLeft =
    otpExpiresAt === null
      ? 0
      : Math.max(0, Math.ceil((otpExpiresAt - now) / 1000));
  const otpExpired = otpSent && otpExpiresAt !== null && otpSecondsLeft === 0;
  const canRequestOtpAgain =
    !isPhoneComplete || isSubmitting || (otpSent && !otpExpired);

  useEffect(() => {
    if (otpExpiresAt === null || otpSecondsLeft <= 0) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [otpExpiresAt, otpSecondsLeft]);

  const handleSendOtp = async () => {
    const valid = await trigger("phone");
    if (!valid) return;
    // TODO: call send OTP API
    setOtpSent(true);
    setOtpExpiresAt(Date.now() + OTP_EXPIRY_SECONDS * 1000);
    setNow(Date.now());
  };

  const onSubmit = async (data: LoginFormValues) => {
    if (data.mode === "password") {
      // TODO: login with phone + password
      console.log({ phone: data.phone, password: data.password });
    } else {
      // TODO: verify OTP and login
      console.log({ phone: data.phone, otp: data.otp });
    }
  };

  const setMode = (m: LoginMode) => setValue("mode", m);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-slate-100 p-4"
      dir="rtl"
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-slate-800 mb-2">
          ورود به پنل
        </h1>
        <p className="text-slate-500 text-center text-sm mb-6">
          با شماره موبایل و رمز عبور یا کد یکبار مصرف وارد شوید
        </p>

        {/* Toggle: Password / OTP */}
        <div className="flex rounded-xl bg-slate-100 p-1 mb-6">
          <button
            type="button"
            onClick={() => setMode("password")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              mode === "password"
                ? "bg-white text-slate-800 shadow"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            رمز عبور
          </button>
          <button
            type="button"
            onClick={() => setMode("otp")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              mode === "otp"
                ? "bg-white text-slate-800 shadow"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            کد یکبار مصرف
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              شماره موبایل
            </label>
            <input
              id="phone"
              type="tel"
              dir="ltr"
              placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              className={`w-full px-4 py-3 rounded-xl border outline-none transition text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-200 ${
                errors.phone
                  ? "border-red-500 focus:border-red-500"
                  : "border-slate-200 focus:border-slate-400"
              }`}
              {...register("phone")}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">
                {errors.phone.message}
              </p>
            )}
          </div>

          {mode === "password" ? (
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                رمز عبور
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="رمز عبور خود را وارد کنید"
                  className={`w-full px-4 py-3 pe-12 rounded-xl border outline-none transition text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-200 ${
                    errors.password
                      ? "border-red-500 focus:border-red-500"
                      : "border-slate-200 focus:border-slate-400"
                  }`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute inset-e-2 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                  tabIndex={-1}
                  aria-label={
                    showPassword ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"
                  }
                >
                  {showPassword ? (
                    <HiEyeSlash className="w-5 h-5" />
                  ) : (
                    <HiEye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          ) : (
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                کد یکبار مصرف
              </label>
              <div className="flex gap-2">
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  dir="ltr"
                  placeholder="کد ۶ رقمی"
                  className={`flex-1 px-4 py-3 rounded-xl border outline-none transition text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-200 ${
                    errors.otp
                      ? "border-red-500 focus:border-red-500"
                      : "border-slate-200 focus:border-slate-400"
                  }`}
                  {...register("otp", {
                    onChange: (e) => {
                      const v = e.target.value.replace(/\D/g, "");
                      e.target.value = v;
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={canRequestOtpAgain}
                  className="px-4 py-3 rounded-xl bg-primary text-white font-medium text-sm whitespace-nowrap disabled:bg-slate-700/50 disabled:cursor-not-allowed hover:bg-primary-hover transition-colors"
                >
                  {otpExpired
                    ? "دریافت مجدد کد"
                    : otpSent
                      ? `ارسال مجدد (${formatOtpCountdown(otpSecondsLeft)})`
                      : "دریافت کد"}
                </button>
              </div>
              {otpSent && !otpExpired && otpSecondsLeft > 0 && (
                <p className="mt-1 text-sm text-slate-500">
                  اعتبار کد تا {formatOtpCountdown(otpSecondsLeft)}
                </p>
              )}
              {otpExpired && (
                <p className="mt-1 text-sm text-amber-600">
                  کد منقضی شده است. برای دریافت کد جدید دکمه «دریافت مجدد کد» را
                  بزنید.
                </p>
              )}
              {errors.otp && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.otp.message}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-hover disabled:opacity-60 transition-colors"
          >
            {isSubmitting ? "در حال بررسی..." : "ورود"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
