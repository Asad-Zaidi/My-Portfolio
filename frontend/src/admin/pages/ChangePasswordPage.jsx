import { useState } from "react";
import {
  LuKeyRound as KeyRound,
  LuLock as Lock,
  LuEye as Eye,
  LuEyeOff as EyeOff,
  LuCheck as Check,
  LuX as X,
  LuCircleAlert as AlertCircle,
  LuCircleCheck as CheckCircle2,
  LuLoaderCircle as Loader2,
  LuShieldCheck as ShieldCheck,
} from "react-icons/lu";
import { adminChangePassword } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ToastContext";

const PASSWORD_RULES = [
  {
    id: "length",
    label: "At least 8 characters long",
    test: (pwd) => pwd.length >= 8,
  },
  {
    id: "uppercase",
    label: "At least one uppercase letter (A-Z)",
    test: (pwd) => /[A-Z]/.test(pwd),
  },
  {
    id: "lowercase",
    label: "At least one lowercase letter (a-z)",
    test: (pwd) => /[a-z]/.test(pwd),
  },
  {
    id: "number",
    label: "At least one number (0-9)",
    test: (pwd) => /[0-9]/.test(pwd),
  },
  {
    id: "special",
    label: "At least one special character (!@#$%^&*...)",
    test: (pwd) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(pwd),
  },
];

export default function ChangePasswordPage() {
  const { token, admin } = useAuth();
  const toast = useToast();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Real-time evaluation of all rules
  const rulesStatus = PASSWORD_RULES.map((rule) => ({
    ...rule,
    passed: rule.test(newPassword),
  }));

  const allRulesPassed = rulesStatus.every((r) => r.passed);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isFormValid =
    currentPassword.trim().length > 0 &&
    allRulesPassed &&
    passwordsMatch;

  // Calculate password strength score (0 to 5)
  const passedCount = rulesStatus.filter((r) => r.passed).length;
  const getStrengthInfo = () => {
    if (!newPassword) return { label: "None", color: "bg-slate-300 dark:bg-navy-700", text: "text-slate-400", width: "0%" };
    if (passedCount <= 2) return { label: "Weak", color: "bg-red-500", text: "text-red-500", width: "25%" };
    if (passedCount === 3) return { label: "Fair", color: "bg-amber-500", text: "text-amber-500", width: "50%" };
    if (passedCount === 4) return { label: "Good", color: "bg-blue-500", text: "text-blue-500", width: "75%" };
    return { label: "Strong & Secure", color: "bg-emerald-500", text: "text-emerald-500", width: "100%" };
  };

  const strength = getStrengthInfo();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!currentPassword) {
      setError("Please enter your current password.");
      return;
    }

    if (!allRulesPassed) {
      setError("Please satisfy all password security requirements.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password cannot be the same as your current password.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await adminChangePassword(token, {
        currentPassword,
        newPassword,
      });

      const msg = res.message || "Password updated successfully!";
      setSuccessMessage(msg);
      toast.success(msg);

      // Clear the form fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const errMsg = err.message || "Failed to update password. Please try again.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent shadow-sm">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                Change Password
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                Manage and update your administrative credentials securely.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Form */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-navy-700 dark:bg-navy-900 sm:p-7">
            <h2 className="mb-1 text-base font-semibold text-slate-900 dark:text-white">
              Update Security Credentials
            </h2>
            <p className="mb-6 text-xs text-slate-500 dark:text-slate-400">
              Signed in as <span className="font-semibold text-slate-700 dark:text-slate-300">{admin?.email}</span>
            </p>

            {/* Error Banner */}
            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <div className="flex-1 text-xs sm:text-sm">{error}</div>
                <button
                  type="button"
                  onClick={() => setError("")}
                  className="rounded-lg p-0.5 hover:bg-red-500/20"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Success Banner */}
            {successMessage && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-sm text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                <div className="flex-1 text-xs sm:text-sm">{successMessage}</div>
                <button
                  type="button"
                  onClick={() => setSuccessMessage("")}
                  className="rounded-lg p-0.5 hover:bg-emerald-500/20"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Current Password */}
              <div>
                <label
                  htmlFor="currentPassword"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Current Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    id="currentPassword"
                    type={showCurrent ? "text" : "password"}
                    required
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Enter current password"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20 dark:border-navy-600 dark:bg-navy-950/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-accent dark:focus:bg-navy-950"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                    aria-label={showCurrent ? "Hide current password" : "Show current password"}
                  >
                    {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    id="newPassword"
                    type={showNew ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Enter new password (min. 8 characters)"
                    className={`w-full rounded-xl border py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:bg-white focus:ring-2 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-navy-950 ${
                      allRulesPassed
                        ? "border-emerald-500 bg-emerald-50/20 focus:border-emerald-500 focus:ring-emerald-500/20 dark:border-emerald-500/60 dark:bg-emerald-950/10"
                        : "border-slate-300 bg-slate-50/50 focus:border-accent focus:ring-accent/20 dark:border-navy-600 dark:bg-navy-950/60 dark:focus:border-accent"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                    aria-label={showNew ? "Hide new password" : "Show new password"}
                  >
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Real-time Strength Meter */}
                {newPassword && (
                  <div className="mt-2.5 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">Password Strength:</span>
                      <span className={`font-semibold ${strength.text}`}>{strength.label}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-navy-800">
                      <div
                        className={`h-full transition-all duration-300 ${strength.color}`}
                        style={{ width: strength.width }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Re-type your new password"
                    className={`w-full rounded-xl border py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:bg-white focus:ring-2 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-navy-950 ${
                      confirmPassword.length > 0
                        ? passwordsMatch
                          ? "border-emerald-500 bg-emerald-50/20 focus:border-emerald-500 focus:ring-emerald-500/20 dark:border-emerald-500/60 dark:bg-emerald-950/10"
                          : "border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500/60 dark:bg-red-950/10"
                        : "border-slate-300 bg-slate-50/50 focus:border-accent focus:ring-accent/20 dark:border-navy-600 dark:bg-navy-950/60 dark:focus:border-accent"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                    aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Match indicator */}
                {confirmPassword && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                    {passwordsMatch ? (
                      <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                        <Check className="h-3.5 w-3.5" /> Passwords match
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 font-medium text-red-500 dark:text-red-400">
                        <X className="h-3.5 w-3.5" /> Passwords do not match
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting || !isFormValid}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-semibold text-white shadow-md shadow-accent/20 transition-all hover:bg-accent-dark hover:shadow-lg hover:shadow-accent/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      <span>Save New Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Dynamic Real-time Password Requirements Checklist */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-navy-700 dark:bg-navy-900 sm:p-7">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Password Requirements
              </h3>
            </div>

            <p className="mb-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Your new password must satisfy all of the following rules. Items will automatically turn <span className="font-semibold text-emerald-600 dark:text-emerald-400">green</span> as you type:
            </p>

            {/* Instruction List with Real-time Green Feedback */}
            <div className="space-y-2.5">
              {rulesStatus.map((rule) => {
                const isPassed = rule.passed;
                return (
                  <div
                    key={rule.id}
                    className={`flex items-center gap-3 rounded-xl p-2.5 text-xs transition-all duration-200 ${
                      isPassed
                        ? "bg-emerald-500/10 text-emerald-700 font-medium dark:bg-emerald-500/15 dark:text-emerald-300 shadow-sm border border-emerald-500/20"
                        : "bg-slate-50 text-slate-500 dark:bg-navy-950/40 dark:text-slate-400 border border-transparent"
                    }`}
                  >
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
                        isPassed
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200 text-slate-400 dark:bg-navy-800 dark:text-slate-500"
                      }`}
                    >
                      {isPassed ? (
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      ) : (
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                      )}
                    </div>
                    <span className="flex-1">{rule.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Security Tip Card */}
            <div className="mt-6 rounded-xl border border-blue-500/20 bg-blue-50/50 p-4 dark:border-blue-500/20 dark:bg-blue-950/20">
              <div className="flex items-start gap-2.5">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white text-[10px] font-bold">
                  i
                </div>
                <div className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
                  <p className="font-semibold text-blue-950 dark:text-blue-100">Security Recommendation</p>
                  <p className="mt-0.5 text-[11px] text-blue-700 dark:text-blue-300">
                    Use a unique password that you do not use on any other service. Once updated, your new password will take effect immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
