import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RocketIcon } from "../icons";
import { useAuth } from "../../context/AuthContext";
import { loginSchema, type LoginFormValues } from "../../utils/validation";

export const LoginView = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data);
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
            Welcome back
          </h1>
          <p className="font-body text-on-surface-variant text-[15px]">
            Enter your details to access your board.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
            <div className="flex items-center justify-between">
              <label className="font-body font-bold text-[11px] uppercase tracking-wider text-on-surface-variant">
                Password
              </label>
              <a
                href="#"
                className="font-body text-[12px] font-bold text-primary hover:text-primary/80 transition-colors no-underline"
              >
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              {...register("password")}
              className={`w-full bg-surface-container border ${errors.password ? "border-red-500 focus:ring-red-500" : "border-surface-container-high focus:border-primary focus:ring-primary"} rounded-xl px-4 py-3 font-body text-[15px] font-medium text-on-surface focus:outline-none focus:ring-1 transition-colors placeholder:text-outline-variant/60`}
              placeholder="••••••••"
            />
            {errors.password && (
              <span className="text-red-500 text-xs font-bold mt-1">
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="mt-4 w-full bg-[#111] hover:bg-black text-white font-body font-bold text-[15px] py-4 rounded-xl border-0 cursor-pointer shadow-sm shadow-black/20 transition-colors"
          >
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center font-body text-[14px] text-on-surface-variant font-medium">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-primary hover:text-primary/80 transition-colors no-underline font-bold ml-1"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};
