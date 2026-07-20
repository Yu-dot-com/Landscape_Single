import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { loginSchema } from "../schemas/authSchema";
import { useLogin } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export type loginType = {
  email: string;
  hash_password: string;
};
export default function Login() {
  const navigate = useNavigate();
  const { mutate, isPending, isSuccess } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: loginType) => {
    mutate(data);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F2EC] px-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl bg-white/40 backdrop-blur-xl">
        {/* LEFT - LOGIN FORM */}
        <div className="p-12 flex flex-col justify-center">
          <p className="text-sm text-[#6F7C5A]">
            Collaborative Landscape Design
          </p>

          <h2 className="text-4xl font-semibold text-[#2F3A2E] mt-3">
            Welcome
          </h2>

          <p className="text-gray-600 mt-3">
            Login In to continue designing outdoor spaces with your team.
          </p>
          {isSuccess && (
            <div className="p-3 bg-green-50 text-green-700 rounded-xl">
              Login Success.
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-4">
            <input
              type="email"
              placeholder="Email address"
              {...register("email")}
              className="w-full p-3 rounded-xl bg-white/70 border border-border outline-none focus:ring-2 focus:ring-[#6F7C5A]"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}

            <input
              type="password"
              placeholder="Password"
              {...register("hash_password")}
              className="w-full p-3 rounded-xl bg-white/70 border border-border outline-none focus:ring-2 focus:ring-[#6F7C5A]"
            />
            {errors.hash_password && (
              <p className="text-red-500 text-sm">
                {errors.hash_password.message}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-[#2F3A2E] text-white py-3 rounded-xl hover:bg-[#3f4a3d] transition"
              disabled={isPending}
            >
              {isPending ? "logging Account..." : "Login"}
            </button>

            {/* SIGNUP LINK (NO FORM / NO MODAL) */}
            <p className="text-sm text-center text-gray-500">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-[#4E6B50] font-medium hover:underline"
              >
                Sign Up
              </a>
            </p>
          </form>
        </div>

        {/* RIGHT - VISUAL */}
        <div className="relative hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-linear-to-t from-[#2F3A2E]/70 to-transparent" />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-10 left-10 text-white"
          >
            <h3 className="text-2xl font-semibold">
              Design landscapes together
            </h3>
            <p className="text-sm opacity-80">
              Real-time collaboration for outdoor spaces.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
