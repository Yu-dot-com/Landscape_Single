import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { signupSchema } from "../schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignup } from "../hooks/useAuth";

export type signupType = {
  username: string;
  email: string;
  hash_password: string;
};
export default function SignUp() {
  const { mutate, isPending, isSuccess } = useSignup();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: signupType) => {
    console.log("FORM DATA:", data);
    mutate(data);
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
            Sign Up to continue designing outdoor spaces with your team.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-4">
            {isSuccess && (
              <div className="p-3 bg-green-50 text-green-700 rounded-xl">
                Account created successfully! Welcome aboard.
              </div>
            )}
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
              type="username"
              placeholder="username"
              {...register("username")}
              className="w-full p-3 rounded-xl bg-white/70 border border-border outline-none focus:ring-2 focus:ring-[#6F7C5A]"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
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
              className="w-full bg-[#2F3A2E] text-white py-3 rounded-xl hover:bg-[#3f4a3d] transition"
              disabled={isPending}
            >
              {isPending ? "Creating Account..." : "Sign Up"}
            </button>

            {/* SIGNUP LINK (NO FORM / NO MODAL) */}
            <p className="text-sm text-center text-gray-500">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-[#4E6B50] font-medium hover:underline"
              >
                Login In
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
