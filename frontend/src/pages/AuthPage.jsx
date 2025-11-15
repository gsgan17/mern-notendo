import { useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import toast from "react-hot-toast";

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL; // <-- using ENV API URL

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateSignup = () => {
    if (!form.name.trim()) return "Please enter your name.";
    if (!form.email.trim()) return "Please enter your email.";
    if (form.password.length < 6)
      return "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword)
      return "Passwords do not match.";
    return null;
  };

  const validateLogin = () => {
    if (!form.email.trim()) return "Please enter your email.";
    if (!form.password) return "Please enter your password.";
    return null;
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const err = validateSignup();
        if (err) {
          toast.error(err);
          setLoading(false);
          return;
        }

        const res = await axios.post(`${API_URL}/api/auth/signup`, {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        });

        toast.success(res.data?.message || "Signup successful!");
        if (res.data?.token) localStorage.setItem("token", res.data.token);

        window.location.href = "/";
      } else {
        const err = validateLogin();
        if (err) {
          toast.error(err);
          setLoading(false);
          return;
        }

        const res = await axios.post(`${API_URL}/api/auth/login`, {
          email: form.email.trim(),
          password: form.password,
        });

        toast.success(res.data?.message || "Login successful!");
        if (res.data?.token) localStorage.setItem("token", res.data.token);

        window.location.href = "/";
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar />

      <div className="max-w-3xl mx-auto p-6 mt-8">
        <div className="rounded-2xl shadow-lg bg-white overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* LEFT SIDE INFO */}
            <div className="hidden md:flex flex-col justify-center p-8 bg-gradient-to-br from-primary/10 to-primary/5">
              <h3 className="text-2xl font-semibold text-primary">
                {isSignUp ? "Create an account" : "Welcome back"}
              </h3>
              <p className="text-sm text-gray-700 mt-3">
                {isSignUp
                  ? "Sign up to save and manage your notes."
                  : "Login to access your notes."}
              </p>

              <ul className="mt-6 text-sm text-gray-700 space-y-2">
                <li>• Fast sync across devices</li>
                <li>• Create and manage notes</li>
                <li>• Friendly UI with rate-limit handling</li>
              </ul>
            </div>

            {/* RIGHT SIDE FORM */}
            <div className="p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium">
                  {isSignUp ? "Sign up" : "Log in"}
                </h2>
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm text-primary underline underline-offset-2"
                >
                  {isSignUp ? "Already have an account?" : "Create an account"}
                </button>
              </div>

              <form onSubmit={handleAuth} className="mt-6 space-y-4">
                {isSignUp && (
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Full name
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-primary/30"
                      placeholder="Your name"
                    />
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium mb-1 block">Email</label>
                  <input
                    name="email"
                    value={form.email}
                    type="email"
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-primary/30"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      value={form.password}
                      type={showPassword ? "text" : "password"}
                      onChange={handleChange}
                      className="w-full border rounded-md px-3 py-2 pr-
20 focus:ring-2 focus:ring-primary/30"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {isSignUp && (
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Confirm Password
                    </label>
                    <input
                      name="confirmPassword"
                      value={form.confirmPassword}
                      type={showPassword ? "text" : "password"}
                      onChange={handleChange}
                      className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-primary/30"
                      placeholder="Repeat password"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-gray-700 py-2 rounded-lg font-medium disabled:opacity-60"
                >
                  {loading
                    ? isSignUp
                      ? "Signing up..."
                      : "Logging in..."
                    : isSignUp
                    ? "Create Account"
                    : "Log In"}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-700 mt-6">
          Need help? Contact admin.
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
