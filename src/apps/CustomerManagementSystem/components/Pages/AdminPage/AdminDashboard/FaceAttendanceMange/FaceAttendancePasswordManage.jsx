import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

const PASSWORD_URL = `${(import.meta.env.VITE_FACE_ATTENDANCE_PASSWORD_API_BASE_URL
  || "https://grozziieget.zjweiting.com:8033/tht").replace(/\/+$/, "")}/faceAttendance/password`;
const dateLabel = (value) => value ? new Date(value).toLocaleString() : "Not created yet";
const errorMessage = (error, fallback) => error.response?.data?.message || fallback;

export default function FaceAttendancePasswordManage() {
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveNotice, setSaveNotice] = useState(null);
  const [checkPassword, setCheckPassword] = useState("");
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState(null);
  const checkVersion = useRef(0);

  const loadPassword = useCallback(async (signal) => {
    setLoading(true);
    setLoadError("");
    try {
      const { data } = await axios.get(PASSWORD_URL, { signal });
      if (!signal?.aborted) setRecord(data.data);
    } catch (error) {
      if (!signal?.aborted) setLoadError(errorMessage(error, "Unable to load the password. Please retry."));
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadPassword(controller.signal);
    return () => controller.abort();
  }, [loadPassword]);

  const savePassword = async (event) => {
    event.preventDefault();
    if (!newPassword.trim() || newPassword.length > 128) return;
    setSaving(true);
    setSaveNotice(null);
    checkVersion.current += 1;
    setCheckResult(null);
    try {
      const { data } = await axios.put(PASSWORD_URL, { password: newPassword });
      setRecord(data.data);
      setNewPassword("");
      setSaveNotice({ ok: true, message: data.message });
    } catch (error) {
      setSaveNotice({ ok: false, message: errorMessage(error, "Unable to save the password. Please retry.") });
    } finally {
      setSaving(false);
    }
  };

  const verifyPassword = async (event) => {
    event.preventDefault();
    if (!checkPassword.trim() || checkPassword.length > 128) return;
    const version = ++checkVersion.current;
    setChecking(true);
    setCheckResult(null);
    try {
      const { data } = await axios.post(`${PASSWORD_URL}/check`, { password: checkPassword });
      if (version === checkVersion.current) {
        setCheckResult({ ok: data.data.valid, message: data.message });
      }
    } catch (error) {
      if (version === checkVersion.current) {
        setCheckResult({ ok: false, message: errorMessage(error, "Unable to check the password. Please retry.") });
      }
    } finally {
      setChecking(false);
    }
  };

  const unavailable = loading || Boolean(loadError);
  const inputClass = "w-full min-w-0 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#004368] disabled:bg-gray-100";
  const buttonClass = "rounded-lg bg-[#004368] px-5 py-3 font-semibold text-white hover:bg-[#00334f] disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <section aria-labelledby="face-password-heading" className="rounded-xl bg-white p-6 shadow-lg sm:p-8">
      <h2 id="face-password-heading" className="text-center text-2xl font-bold text-[#004368]">
        Face Attendance Reset &amp; Password Checking Management (Warehouse)
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        Manage the shared password used to authorize face attendance resets.
      </p>

      {loading && <p role="status" className="mt-6 text-gray-600">Loading password...</p>}
      {loadError && (
        <div role="alert" className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
          <p>{loadError}</p>
          <button type="button" onClick={() => loadPassword()} className="mt-2 font-semibold underline">Retry</button>
        </div>
      )}

      {!unavailable && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <label htmlFor="face-current-password" className="mb-2 block font-semibold text-gray-700">Current password</label>
          {record ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              <input id="face-current-password" type={showCurrent ? "text" : "password"}
                value={record.password} readOnly autoComplete="off" className={inputClass} />
              <button type="button" aria-pressed={showCurrent} onClick={() => setShowCurrent((value) => !value)}
                className="shrink-0 whitespace-nowrap rounded-lg border border-gray-300 px-5 py-3 font-semibold text-[#004368]">
                {showCurrent ? "Hide password" : "Show password"}
              </button>
            </div>
          ) : <p className="text-gray-600">No password configured. Create one below.</p>}
          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
            <div><dt className="font-semibold text-gray-600">Created time</dt><dd className="mt-1 text-gray-800">{dateLabel(record?.createdAt)}</dd></div>
            <div><dt className="font-semibold text-gray-600">Updated time</dt><dd className="mt-1 text-gray-800">{dateLabel(record?.updatedAt)}</dd></div>
          </dl>
        </div>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <form onSubmit={savePassword} className="space-y-3">
          <label htmlFor="face-new-password" className="block font-semibold text-gray-700">
            {record ? "New password" : "Create password"}
          </label>
          <input id="face-new-password" type="password" value={newPassword} required maxLength={128}
            autoComplete="new-password" placeholder="Enter a password" disabled={unavailable || saving || checking}
            onChange={(event) => { setNewPassword(event.target.value); setSaveNotice(null); }} className={inputClass} />
          <p className="text-xs text-gray-500">1–128 characters. Passwords are case-sensitive; spaces are preserved.</p>
          <button type="submit" disabled={unavailable || saving || checking || !newPassword.trim()} className={buttonClass}>
            {saving ? "Saving..." : record ? "Update password" : "Create password"}
          </button>
          {saveNotice && <p role={saveNotice.ok ? "status" : "alert"} className={saveNotice.ok ? "text-sm text-green-700" : "text-sm text-red-700"}>{saveNotice.message}</p>}
        </form>

        <form onSubmit={verifyPassword} className="space-y-3">
          <label htmlFor="face-check-password" className="block font-semibold text-gray-700">Check password</label>
          <input id="face-check-password" type="password" value={checkPassword} required maxLength={128}
            autoComplete="off" placeholder="Enter the password to check" disabled={unavailable || !record || saving || checking}
            onChange={(event) => { setCheckPassword(event.target.value); setCheckResult(null); }} className={inputClass} />
          <p className="text-xs text-gray-500">Check whether a password matches the current shared password.</p>
          <button type="submit" disabled={unavailable || !record || saving || checking || !checkPassword.trim()} className={buttonClass}>
            {checking ? "Checking..." : "Check password"}
          </button>
          {checkResult && <p role="status" className={checkResult.ok ? "text-sm text-green-700" : "text-sm text-red-700"}>{checkResult.message}</p>}
        </form>
      </div>
    </section>
  );
}
