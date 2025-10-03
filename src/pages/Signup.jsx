import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState(null);

  // Validation checks
  const validations = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    match: password && password === confirm,
  };

  const allValid = Object.values(validations).every(Boolean);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!allValid) {
      setMessage({
        type: "error",
        text: "Password does not meet all requirements.",
      });
      return;
    }

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      // Check if it's a duplicate email
      if (error.message.includes("already registered")) {
        setMessage({ type: "error", text: "Email already taken." });
      } else {
        setMessage({ type: "error", text: error.message });
      }
    } else {
      setMessage({
        type: "success",
        text: "Signup successful! Please check your email to confirm your account.",
      });
    }
  };

  const handleGoogleSignup = async () => {
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
        onSubmit={handleSignup}
        className="bg-white dark:bg-gray-800 p-8 rounded-xl w-96 shadow-lg"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Create Account
        </h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded border bg-gray-100 dark:bg-gray-700 dark:text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password */}
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

        {/* Confirm Password */}
        <div className="relative mb-4">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            className="w-full p-3 rounded border bg-gray-100 dark:bg-gray-700 dark:text-white"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-3 text-gray-500 dark:text-gray-300"
          >
            {showConfirm ? <EyeOff /> : <Eye />}
          </button>
        </div>

        {/* Password Checklist (only show unmet validations) */}
        <div className="mb-4 text-sm">
          <p className="font-medium text-gray-700 dark:text-gray-300">
            Password must include:
          </p>
          <ul className="mt-2 space-y-1">
            {!validations.length && (
              <li className="flex items-center text-red-500">
                <XCircle size={16} />
                <span className="ml-2">At least 8 characters</span>
              </li>
            )}
            {!validations.upper && (
              <li className="flex items-center text-red-500">
                <XCircle size={16} />
                <span className="ml-2">One uppercase letter</span>
              </li>
            )}
            {!validations.lower && (
              <li className="flex items-center text-red-500">
                <XCircle size={16} />
                <span className="ml-2">One lowercase letter</span>
              </li>
            )}
            {!validations.number && (
              <li className="flex items-center text-red-500">
                <XCircle size={16} />
                <span className="ml-2">One number</span>
              </li>
            )}
            {!validations.special && (
              <li className="flex items-center text-red-500">
                <XCircle size={16} />
                <span className="ml-2">One special character</span>
              </li>
            )}
            {!validations.match && (
              <li className="flex items-center text-red-500">
                <XCircle size={16} />
                <span className="ml-2">Passwords must match</span>
              </li>
            )}
          </ul>
        </div>

        {/* Success message if strong */}
        {allValid && (
          <p className="text-green-500 text-sm mb-4">
            ✅ Password is good enough
          </p>
        )}

        {message && (
          <p
            className={`text-sm mb-4 ${
              message.type === "error" ? "text-red-500" : "text-green-500"
            }`}
          >
            {message.text}
          </p>
        )}

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mb-3">
          Sign Up
        </button>

        <button
          type="button"
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 rounded py-2 transition dark:bg-gray-200 dark:hover:bg-gray-300"
        >
          <i className="fab fa-google fa-2x ms-0"></i>
          Continue with Google
        </button>

        <p className="text-sm text-gray-600 dark:text-gray-300 mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}
