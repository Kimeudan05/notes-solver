import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ For UX feedback
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Check if email exists by sending a reset password request
      const { error: emailError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: window.location.origin + "/reset-password",
        }
      );

      if (emailError) {
        // If Supabase says "User not found" → email doesn't exist
        if (emailError.message.includes("User not found")) {
          setMessage({ type: "error", text: "This email is not registered." });
          setLoading(false);
          return;
        }
      }

      // Step 2: Try to log in if email exists
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage({
          type: "error",
          text: "Incorrect password. Please try again.",
        });
      } else {
        setMessage({
          type: "success",
          text: "Login successful! Redirecting...",
        });
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (err) {
      setMessage({ type: "error", text: "Something went wrong. Try again." });
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-800 p-8 rounded-xl w-96 shadow-lg"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Welcome Back
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded border bg-gray-100 dark:bg-gray-700 dark:text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 rounded border bg-gray-100 dark:bg-gray-700 dark:text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500 dark:text-gray-300"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        {message && (
          <p
            className={`text-sm mb-4 ${
              message.type === "error" ? "text-red-500" : "text-green-500"
            }`}
          >
            {message.text}
          </p>
        )}

        <p className="text-sm text-gray-600 dark:text-gray-300 mt-4 text-center mb-2">
          Forgot your password?{" "}
          <Link to="/forgot-password" className="text-blue-500 hover:underline">
            reset here
          </Link>
        </p>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mb-3 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 rounded py-2 transition dark:bg-gray-200 dark:hover:bg-gray-300"
        >
          <b className="text-lg" />
          <i className="fab fa-google fa-2x ms-0"></i>
          Continue with Google
        </button>

        <p className="text-sm text-gray-600 dark:text-gray-300 mt-4 text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up here
          </Link>
        </p>
      </form>
    </div>
  );
}
