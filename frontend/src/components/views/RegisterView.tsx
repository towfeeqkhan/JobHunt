import { useNavigate, Link } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RocketIcon } from "../icons";
import { useAuth } from "../../context/AuthContext";
import {
  registerSchema,
  type RegisterFormValues,
} from "../../utils/validation";

export const RegisterView = () => {
  const navigate = useNavigate();
  const { register: apiRegister } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const passwordValue = useWatch({ control, name: "password" }) || "";
  const passwordCriteria = [
    { label: "At least 8 characters", isValid: passwordValue.length >= 8 },
    { label: "One uppercase letter", isValid: /[A-Z]/.test(passwordValue) },
    { label: "One lowercase letter", isValid: /[a-z]/.test(passwordValue) },
    { label: "One number", isValid: /[0-9]/.test(passwordValue) },
    {
      label: "One special character",
      isValid: /[^A-Za-z0-9]/.test(passwordValue),
    },
  ];

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await apiRegister(data);
      navigate("/");
    } catch {
      //
    }
  };

  return (
    <div className="flex h-screen w-full bg-surface items-center justify-center p-6 relative">
      <div className="w-full max-w-100 bg-surface-container-lowest rounded-2xl shadow-[0_8px_30px_rgba(25,28,30,0.06)] border border-surface-container-high/60 p-8 sm:p-10 flex flex-col animate-in fade-in zoom-in-95 duration-500 z-10">
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="bg-linear-to-br from-primary to-primary-container text-white w-10 h-10 rounded-lg flex items-center justify-center shadow-sm">
            <RocketIcon />
          </div>
          <span className="font-display font-black text-2xl tracking-tight text-on-surface">
            JobHunt
          </span>
        </div>

        <div className="mb-8 text-center">
          <h1 className="font-display font-extrabold text-[26px] text-on-surface mb-2 tracking-tight">
            Create an account
          </h1>
          <p className="font-body text-on-surface-variant text-[15px]">
            Start tracking your job applications today.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2 relative">
            <label className="font-body font-bold text-[11px] uppercase tracking-wider text-on-surface-variant">
              Full Name
            </label>
            <input
              type="text"
              {...register("name")}
              className={`w-full bg-surface-container border ${errors.name ? "border-red-500 focus:ring-red-500" : "border-surface-container-high focus:border-primary focus:ring-primary"} rounded-xl px-4 py-3 font-body text-[15px] font-medium text-on-surface focus:outline-none focus:ring-1 transition-colors placeholder:text-outline-variant/60`}
              placeholder="John Doe"
            />
            {errors.name && (
              <span className="text-red-500 text-xs font-bold mt-1">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 relative">
            <label className="font-body font-bold text-[11px] uppercase tracking-wider text-on-surface-variant">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className={`w-full bg-surface-container border ${errors.email ? "border-red-500 focus:ring-red-500" : "border-surface-container-high focus:border-primary focus:ring-primary"} rounded-xl px-4 py-3 font-body text-[15px] font-medium text-on-surface focus:outline-none focus:ring-1 transition-colors placeholder:text-outline-variant/60`}
              placeholder="john@example.com"
            />
            {errors.email && (
              <span className="text-red-500 text-xs font-bold mt-1">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 relative">
            <label className="font-body font-bold text-[11px] uppercase tracking-wider text-on-surface-variant">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              className={`w-full bg-surface-container border ${errors.password ? "border-red-500 focus:ring-red-500" : "border-surface-container-high focus:border-primary focus:ring-primary"} rounded-xl px-4 py-3 font-body text-[15px] font-medium text-on-surface focus:outline-none focus:ring-1 transition-colors placeholder:text-outline-variant/60`}
              placeholder="••••••••"
            />
            {passwordValue.length > 0 && (
              <div className="flex flex-col gap-1 mt-2 text-xs font-body">
                {passwordCriteria.map((criterion, index) => (
                  <span
                    key={index}
                    className={`flex items-center gap-1.5 transition-colors ${
                      criterion.isValid
                        ? "text-green-500 font-bold"
                        : "text-on-surface-variant/70"
                    }`}
                  >
                    <svg
                      className="w-3 h-3 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      {criterion.isValid ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      )}
                    </svg>
                    {criterion.label}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="mt-4 w-full bg-[#111] hover:bg-black text-white font-body font-bold text-[15px] py-4 rounded-xl border-0 cursor-pointer shadow-sm shadow-black/20 transition-colors"
          >
            Create Account
          </button>
        </form>

        <p className="mt-8 text-center font-body text-[14px] text-on-surface-variant font-medium">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary hover:text-primary/80 transition-colors no-underline font-bold ml-1"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};
