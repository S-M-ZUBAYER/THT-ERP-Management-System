import { useState } from "react";

// Toast Component
function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 px-5 py-4 rounded-2xl shadow-2xl border min-w-[320px] max-w-[420px]
            ${
              toast.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          style={{ animation: "slideIn 0.35s cubic-bezier(.22,1,.36,1) both" }}
        >
          <span className="text-xl mt-0.5">
            {toast.type === "success" ? "✅" : "❌"}
          </span>
          <div className="flex-1">
            <p
              className={`font-semibold text-sm ${toast.type === "success" ? "text-emerald-700" : "text-red-700"}`}
            >
              {toast.type === "success"
                ? "Verified Successfully"
                : "Verification Failed"}
            </p>
            <p className="text-xs mt-0.5 opacity-80 leading-relaxed">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="opacity-40 hover:opacity-80 transition-opacity text-xl leading-none mt-0.5 font-bold"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export default function UserEmailVerification() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [verifiedUser, setVerifiedUser] = useState(null);

  const addToast = (type, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => removeToast(id), 6000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      addToast("error", "Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setVerifiedUser(null);
    try {
      const encodedEmail = email.trim();
      const url = `http://192.168.0.168:5001/api/dev/user/emailVerification/update?email=${encodedEmail}`;
      console.log(url, "verify email url");

      const response = await fetch(url, { method: "PUT" });
      const data = await response.json();
      if (response.ok && data.status === "success") {
        setVerifiedUser(data.data);
        addToast(
          "success",
          `Email verified for "${data.data.userEmail}". Please log out and log in again to apply changes.`,
        );
      } else {
        addToast(
          "error",
          data.message || "Verification failed. Please try again.",
        );
      }
    } catch (err) {
      addToast(
        "error",
        err.message ||
          "Unable to reach the server. Check your network connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(40px) scale(0.95); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s cubic-bezier(.22,1,.36,1) both; }
      `}</style>

      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Matches OnlinePrintManagement: p-6 bg-gray-50 min-h-screen */}
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto min-h-[400px] mb-20">
          {/* Header — same style as OnlinePrintManagement */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              User Email Verification
            </h1>
            <p className="text-gray-600">
              Verify user's email address to activate their verified account
            </p>
          </div>

          {/* Center card */}
          <div className="flex justify-center">
            <div className="w-full max-w-md fade-up">
              {/* Card — white with shadow, same feel as platform cards */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
                {/* Icon + title */}
                <div className="flex flex-col items-center mb-7">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4">
                    <svg
                      className="w-7 h-7 text-emerald-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Verify Email
                  </h2>
                  <p className="text-sm text-gray-500 mt-1 text-center">
                    Enter the user's email to mark it as verified
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleVerify} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="user@example.com"
                        disabled={loading}
                        className="w-full bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-400
                          rounded-xl pl-10 pr-4 py-3 text-sm
                          focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100
                          hover:border-gray-400 transition-all duration-200
                          disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm
                      bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white
                      disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
                      transition-all duration-200 shadow-sm"
                  >
                    {loading ? (
                      <>
                        <Spinner />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>Verify Email</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Success result card */}
              {verifiedUser && (
                <div className="mt-4 bg-white rounded-2xl shadow-md border border-emerald-200 p-6 fade-up">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-emerald-700 text-xs font-bold tracking-widest uppercase">
                      Account Verified
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      ["Username", verifiedUser.userName],
                      ["Email", verifiedUser.userEmail],
                      ["Role", verifiedUser.role],
                      ["Status", verifiedUser.status],
                      [
                        "Email Verified",
                        verifiedUser.emailVerified ? "Yes ✓" : "No ✗",
                      ],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0"
                      >
                        <span className="text-xs text-gray-500 font-medium">
                          {label}
                        </span>
                        <span
                          className={`text-xs font-semibold ${label === "Email Verified" ? "text-emerald-600" : "text-gray-700"}`}
                        >
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200">
                    <p className="text-xs text-amber-700 text-center leading-relaxed">
                      ⚠️ Please ask the user to{" "}
                      <span className="font-bold">
                        log out and log in again
                      </span>{" "}
                      to apply verification changes.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
