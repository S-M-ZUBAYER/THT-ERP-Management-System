import { useEffect, useRef, useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { toast } from "react-hot-toast";
import { MdAdd, MdClose, MdDelete, MdDownload, MdEdit, MdRefresh } from "react-icons/md";

const SERVERS = [
  { name: "Global", url: "https://grozziieget.zjweiting.com:8033" },
  { name: "China", url: "https://jiapuv.com:8033" },
];
const EMPTY_FORM = { fontName: "", onOff: 1, file: null };
const INPUT = "mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#004368] focus:outline-none focus:ring-1 focus:ring-[#004368]";
const BUTTON = "inline-flex items-center justify-center gap-2 rounded bg-[#004368] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50";
const sizeLabel = (bytes) => Number(bytes) < 1024 ? `${bytes} B` : Number(bytes) < 1048576 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1048576).toFixed(2)} MB`;

async function readResponse(response) {
  const data = await response.json().catch(() => null);
  if (!response.ok || data?.status !== "success") {
    throw new Error(data?.message || data?.error || (response.status === 413 ? "The upload exceeds the server size limit." : `Font request failed (${response.status}). Please try again.`));
  }
  return data;
}

function RegionFonts({ server, busy, setBusy }) {
  const [fonts, setFonts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [fileKey, setFileKey] = useState(0);
  const [downloading, setDownloading] = useState(null);
  const formRef = useRef(null);
  const lifecycle = useRef(null);
  const saving = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    lifecycle.current = controller;
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    fetch(`${server.url}/tht/fonts`, { signal: controller.signal })
      .then(readResponse)
      .then(data => {
        if (!Array.isArray(data.result)) throw new Error("Unexpected font list response.");
        if (!controller.signal.aborted) setFonts(data.result);
      })
      .catch(err => { if (!controller.signal.aborted) setError(err.message || "Unable to load fonts."); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [server.url, revision]);

  const resetForm = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFileKey(value => value + 1);
  };
  const mutate = async (suffix, options, afterSuccess) => {
    if (saving.current) return;
    saving.current = true;
    setBusy(true);
    const signal = lifecycle.current.signal;
    try {
      const data = await readResponse(await fetch(`${server.url}/tht/fonts${suffix}`, { ...options, signal }));
      if (signal.aborted) return;
      toast.success(data.message || "Font saved successfully.");
      if (data.cleanupPending) toast(data.warning || "Saved, but the previous file needs server cleanup.", { icon: "⚠️", duration: 8000 });
      afterSuccess?.();
      setRevision(value => value + 1);
    } catch (err) {
      if (!signal.aborted) toast.error(err.message || "Unable to save font.");
    } finally {
      saving.current = false;
      if (!signal.aborted) setBusy(false);
    }
  };

  const submit = event => {
    event.preventDefault();
    const name = form.fontName.trim();
    if (!name || name.length > 255) return toast.error("Font name must contain 1 to 255 characters.");
    if (!editing && !form.file) return toast.error("Choose a font file.");
    if (form.file && (form.file.size === 0 || form.file.size > 100 * 1024 * 1024 || (server.name === "China" && form.file.size >= 100000000))) {
      return toast.error("Choose a nonempty file below this server's upload limit.");
    }
    const changes = {};
    if (!editing || name !== editing.fontName) changes.fontName = name;
    if (!editing || form.onOff !== Number(editing.onOff)) changes.onOff = form.onOff;
    if (editing && !Object.keys(changes).length && !form.file) return toast.error("Change the name, status or file before saving.");
    let body;
    let headers;
    if (form.file) {
      body = new FormData();
      for (const [key, value] of Object.entries(changes)) body.append(key, String(value));
      body.append("file", form.file);
    } else {
      body = JSON.stringify(changes);
      headers = { "Content-Type": "application/json" };
    }
    void mutate(editing ? `/${editing.id}` : "", { method: editing ? "PATCH" : "POST", body, headers }, resetForm);
  };

  const download = async font => {
    const signal = lifecycle.current.signal;
    setDownloading(font.id);
    try {
      const url = new URL(font.fileUrl || `/tht/fonts/${font.id}/file`, server.url);
      if (url.origin !== new URL(server.url).origin) throw new Error("The download URL does not belong to the selected server.");
      const response = await fetch(url, { signal });
      if (!response.ok) await readResponse(response);
      const blob = await response.blob();
      if (signal.aborted) return;
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = font.originalName || font.filename || font.fontName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch (err) {
      if (!signal.aborted) toast.error(err.message || "Unable to download font.");
    } finally {
      if (!signal.aborted) setDownloading(null);
    }
  };

  return (
    <>
      <form ref={formRef} onSubmit={submit} className="rounded-lg border border-gray-200 bg-slate-50 p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-xl font-bold text-[#004368]">{editing ? "Edit Font" : "Add Font"} <span className="text-sm font-normal text-gray-500">— {server.name}</span></h3>
          {editing && <button type="button" disabled={busy} onClick={resetForm} className="inline-flex items-center gap-1 text-sm text-gray-600 disabled:opacity-50"><MdClose /> Cancel edit</button>}
        </div>
        <fieldset disabled={busy} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="text-sm font-semibold text-gray-700">Font name
            <input className={INPUT} required maxLength={255} value={form.fontName} onChange={event => setForm(prev => ({ ...prev, fontName: event.target.value }))} placeholder="Enter font name" />
          </label>
          <label className="text-sm font-semibold text-gray-700">{editing ? "Replacement file (optional)" : "Font file"}
            <input key={fileKey} className={INPUT} type="file" required={!editing} onChange={event => setForm(prev => ({ ...prev, file: event.target.files?.[0] || null }))} />
          </label>
          <label className="text-sm font-semibold text-gray-700">Status
            <select className={INPUT} value={form.onOff} onChange={event => setForm(prev => ({ ...prev, onOff: Number(event.target.value) }))}>
              <option value={1}>Active</option><option value={0}>Inactive</option>
            </select>
          </label>
          <div className="flex items-end"><button type="submit" className={`${BUTTON} w-full`} disabled={busy}>{editing ? <MdEdit /> : <MdAdd />}{busy ? "Saving…" : editing ? "Save Changes" : "Add Font"}</button></div>
        </fieldset>
        <p className="mt-3 text-xs text-gray-500">All font formats accepted. {server.name === "China" ? "Upload below 100 MB, allowing space for request overhead." : "Maximum file size: 100 MiB."}{editing && " Leave the file empty to keep the current file."}</p>
        {editing && <p className="mt-1 break-all text-xs text-gray-500">Current file: {editing.originalName}</p>}
      </form>

      <div className="mb-3 mt-7 flex items-center justify-between gap-3">
        <h3 className="text-xl font-bold text-[#004368]">{server.name} Fonts <span className="text-sm font-normal text-gray-500">({loading ? "…" : fonts.length})</span></h3>
        <button type="button" disabled={busy || loading} onClick={() => setRevision(value => value + 1)} className={BUTTON}><MdRefresh /> Refresh</button>
      </div>
      <div aria-live="polite">
        {loading ? <div className="rounded border p-8 text-center text-gray-500" role="status">Loading {server.name} fonts…</div> : error ? <div className="rounded border border-red-200 bg-red-50 p-4 text-red-700" role="alert">{error} <button type="button" className="ml-2 underline" onClick={() => setRevision(value => value + 1)}>Retry</button></div> : (
          <div className="overflow-x-auto rounded border border-gray-200">
            <table className="w-full min-w-[700px] border-collapse text-left text-sm">
              <thead className="bg-[#004368] text-white"><tr>{["Font name", "File", "Size", "Status", "Download", "Actions"].map(title => <th key={title} scope="col" className="px-4 py-3 font-semibold">{title}</th>)}</tr></thead>
              <tbody>
                {fonts.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-500">No fonts uploaded to {server.name} yet.</td></tr>}
                {fonts.map(font => <tr key={font.id} className="border-t hover:bg-slate-50">
                  <td className="max-w-xs break-words px-4 py-3 font-medium">{font.fontName}</td>
                  <td className="max-w-xs break-all px-4 py-3 text-gray-600">{font.originalName || font.filename}</td>
                  <td className="whitespace-nowrap px-4 py-3">{sizeLabel(font.fileSize)}</td>
                  <td className="px-4 py-3"><button type="button" role="switch" aria-checked={Number(font.onOff) === 1} aria-label={`Active status for ${font.fontName}`} disabled={busy} onClick={() => void mutate(`/${font.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ onOff: Number(font.onOff) === 1 ? 0 : 1 }) }, () => { if (editing?.id === font.id) resetForm(); })} className={`rounded-full px-3 py-1 text-xs font-semibold disabled:opacity-50 ${Number(font.onOff) === 1 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{Number(font.onOff) === 1 ? "Active" : "Inactive"}</button></td>
                  <td className="px-4 py-3"><button type="button" disabled={downloading !== null || busy} onClick={() => void download(font)} className="inline-flex items-center gap-1 text-[#004368] hover:underline disabled:opacity-50"><MdDownload />{downloading === font.id ? "Downloading…" : "Download"}</button></td>
                  <td className="px-4 py-3"><div className="flex gap-3">
                    <button type="button" disabled={busy} onClick={() => { setEditing(font); setForm({ fontName: font.fontName, onOff: Number(font.onOff), file: null }); setFileKey(value => value + 1); formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }} className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 disabled:opacity-50"><MdEdit /> Edit</button>
                    <button type="button" disabled={busy} onClick={() => setDeleting(font)} className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 disabled:opacity-50"><MdDelete /> Delete</button>
                  </div></td>
                </tr>)}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Dialog open={Boolean(deleting)} onClose={() => { if (!busy) setDeleting(null); }} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4"><DialogPanel className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <DialogTitle className="text-xl font-bold text-[#004368]">Delete font from {server.name}?</DialogTitle>
          <p className="mt-3 break-words text-sm text-gray-600">Delete “{deleting?.fontName}” and its uploaded file? This cannot be undone.</p>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" disabled={busy} onClick={() => setDeleting(null)} className="rounded border px-4 py-2 text-sm">Cancel</button>
            <button type="button" disabled={busy} onClick={() => void mutate(`/${deleting.id}`, { method: "DELETE" }, () => { if (editing?.id === deleting.id) resetForm(); setDeleting(null); })} className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">{busy ? "Deleting…" : "Delete Font"}</button>
          </div>
        </DialogPanel></div>
      </Dialog>
    </>
  );
}

export default function FontManagement() {
  const [region, setRegion] = useState("Global");
  const [busy, setBusy] = useState(false);
  const server = SERVERS.find(item => item.name === region);
  return (
    <section className="mt-12 border-t border-gray-200 pt-8 text-left" aria-labelledby="font-management-heading">
      <h2 id="font-management-heading" className="text-3xl font-bold text-[#004368]">Font Management</h2>
      <p className="mt-1 text-sm text-gray-500">Upload and manage fonts for the selected server.</p>
      <fieldset disabled={busy} className="my-6 flex justify-center">
        <legend className="sr-only">Font server</legend>
        <div className="flex rounded-full bg-slate-300 p-1">
          {SERVERS.map(item => <label key={item.name} className="cursor-pointer">
            <input className="peer sr-only" type="radio" name="font-server" value={item.name} checked={region === item.name} onChange={() => setRegion(item.name)} />
            <span className={`block rounded-full px-8 py-1 text-xl sm:px-16 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-disabled:opacity-60 ${region === item.name ? "bg-[#004368] font-bold text-white" : "font-semibold text-gray-500"}`}>{item.name}</span>
          </label>)}
        </div>
      </fieldset>
      <RegionFonts key={region} server={server} busy={busy} setBusy={setBusy} />
    </section>
  );
}
