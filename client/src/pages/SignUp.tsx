import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { signupSchema } from "../schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useSignup } from "../hooks/useAuth";
import { useToastStore } from "../stores/useToastStore";
import ToastContainer from "../components/ToastContainer";
import { Contours } from "../components/Landing/Contours";
import "../landing.css";

export type signupType = {
  username: string;
  email: string;
  hash_password: string;
};

export default function SignUp() {
  const { mutate, isPending } = useSignup();
  const addToast = useToastStore((state) => state.addToast);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: signupType) => {
    mutate(data, {
      onSuccess: () => {
        addToast({
          type: "success",
          title: "Account created",
        });
      },
      onError: (error: any) => {
        addToast({
          type: "error",
          title: "Signup failed",
          message: error.message,
        });
      },
    });
  };

  return (
    <div className="landing-page relative min-h-screen overflow-hidden bg-(--landing-background) px-6">
      <ToastContainer />

      {/* ambient contour art — echoes the landing page's hero motif */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-20%] top-1/2 hidden h-[90vmin] w-[90vmin] -translate-y-1/2 text-(--landing-accent) opacity-[0.12] md:block animate-drift-slow"
      >
        <Contours variant="b" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center">
        <div className="grid w-full items-center gap-16 md:grid-cols-2">
          {/* LEFT — FORM */}
          <motion.div
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            <Link to="/" className="inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className="inline-block h-2.5 w-2.5 rounded-full bg-(--landing-accent)"
              />
              <span className="font-mono text-sm uppercase tracking-[0.2em] text-(--landing-foreground)">
                Terra
              </span>
            </Link>

            <p className="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-(--landing-accent)">
              Collaborative Landscape Design
            </p>

            <h1 className="mt-3 text-5xl font-semibold leading-[1.02] tracking-tight text-(--landing-foreground)">
              Create your account.
            </h1>

            <p className="mt-4 text-(--landing-muted)">
              Sign up to start designing outdoor spaces with your team.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  {...register("email")}
                  className="w-full rounded-xl border border-(--landing-border) bg-(--landing-card)] p-3 text-(--landing-foreground)] outline-none transition placeholder:text-(--landing-muted)] focus:border-(--landing-accent)] focus:ring-2 focus:ring-(--landing-accent)]/30"
                />
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-500">
                    {errors.email.message as string}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Username"
                  {...register("username")}
                  className="w-full rounded-xl border border-(--landing-border) bg-(--landing-card)] p-3 text-(--landing-foreground)] outline-none transition placeholder:text-(--landing-muted)] focus:border-(--landing-accent)] focus:ring-2 focus:ring-(--landing-accent)]/30"
                />
                {errors.username && (
                  <p className="mt-1.5 text-sm text-red-500">
                    {errors.username.message as string}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password"
                  {...register("hash_password")}
                  className="w-full rounded-xl border border-(--landing-border) bg-(--landing-card)] p-3 text-(--landing-foreground)] outline-none transition placeholder:text-(--landing-muted)] focus:border-(--landing-accent)] focus:ring-2 focus:ring-(--landing-accent)]/30"
                />
                {errors.hash_password && (
                  <p className="mt-1.5 text-sm text-red-500">
                    {errors.hash_password.message as string}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="inline-flex h-11 w-full items-center justify-center rounded-full border border-(--landing-primary) bg-(--landing-primary)] text-sm font-medium text-(--landing-primary-foreground)] shadow-none transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-(--landing-accent)] hover:bg-(--landing-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--landing-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-(--landing-background)] disabled:opacity-60"
              >
                {isPending ? "Creating account…" : "Sign Up"}
              </button>

              <p className="pt-2 text-center text-sm text-(--landing-muted)">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-(--landing-accent) hover:underline"
                >
                  Log in
                </Link>
              </p>
            </form>
          </motion.div>

          {/* RIGHT — BRAND MOMENT (desktop only) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden flex-col justify-center md:flex"
          >
            <p className="text-4xl font-medium leading-tight tracking-tight text-(--landing-muted)">
              One idea.
            </p>
            <p className="mt-2 text-4xl font-medium leading-tight tracking-tight text-(--landing-foreground)">
              Many minds.
            </p>
            <p className="mt-2 text-5xl font-semibold leading-tight tracking-tight text-(--landing-accent)">
              One clear vision.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}