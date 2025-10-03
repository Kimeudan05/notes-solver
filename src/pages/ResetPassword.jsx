import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  };

  const checks = validatePassword(password);
  const handleReset = async (e) => {
    e.preventDefault();

    // Check confirm password
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    // Check strength
    if (!Object.values(checks).every(Boolean)) {
      setMessage({
        type: "error",
        text: "Password does not meet all requirements.",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Password updated successfully!" });
      setTimeout(() => navigate("/login"), 1500);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleReset}
        className="bg-white dark:bg-gray-800 p-8 rounded-xl w-96 shadow-lg"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Create New Password
        </h2>

        <input
          type="password"
          placeholder="New password"
          className="w-full p-3 mb-2 rounded border bg-gray-100 dark:bg-gray-700 dark:text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <ul className="text-xs mb-3 space-y-1">
          <li className={checks.length ? "text-green-500" : "text-red-500"}>
            {checks.length ? "✔" : "✘"} At least 8 characters
          </li>
          <li className={checks.uppercase ? "text-green-500" : "text-red-500"}>
            {checks.uppercase ? "✔" : "✘"} One uppercase letter
          </li>
          <li className={checks.lowercase ? "text-green-500" : "text-red-500"}>
            {checks.lowercase ? "✔" : "✘"} One lowercase letter
          </li>
          <li className={checks.number ? "text-green-500" : "text-red-500"}>
            {checks.number ? "✔" : "✘"} One number
          </li>
          <li className={checks.special ? "text-green-500" : "text-red-500"}>
            {checks.special ? "✔" : "✘"} One special character
          </li>
        </ul>

        <input
          type="password"
          placeholder="Confirm new password"
          className="w-full p-3 mb-4 rounded border bg-gray-100 dark:bg-gray-700 dark:text-white"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {message && (
          <p
            className={`text-sm mb-4 ${
              message.type === "error" ? "text-red-500" : "text-green-500"
            }`}
          >
            {message.text}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
