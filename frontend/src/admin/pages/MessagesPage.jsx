import { useEffect, useState } from "react";
import { Loader2, Trash2, Mail, MailOpen, AlertTriangle } from "lucide-react";
import { adminGetMessages, adminMarkMessageRead, adminDeleteMessage } from "../../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function MessagesPage() {
  const { token } = useAuth();
  const toast = useToast();
  const [messages, setMessages] = useState(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    adminGetMessages(token)
      .then(setMessages)
      .catch((err) => setError(err.message));
  };

  useEffect(load, [token]);

  const handleMarkRead = async (id) => {
    setBusyId(id);
    try {
      const updated = await adminMarkMessageRead(token, id);
      setMessages((prev) => prev.map((m) => (m._id === id ? updated : m)));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message permanently?")) return;
    setBusyId(id);
    try {
      await adminDeleteMessage(token, id);
      setMessages((prev) => prev.filter((m) => m._id !== id));
      toast.success("Message deleted.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
        <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
      </div>
    );
  }

  if (!messages) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Messages</h1>
        <p className="mt-1 text-sm text-slate-400">Submissions from your site's contact form.</p>
      </div>

      {messages.length === 0 ? (
        <p className="rounded-lg border border-dashed border-navy-600 bg-navy-900/30 px-4 py-10 text-center text-sm text-slate-500">
          No messages yet.
        </p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m._id}
              className={`rounded-xl border p-5 transition-colors ${
                m.read ? "border-navy-700 bg-navy-800/40" : "border-accent/30 bg-accent/5"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 font-semibold text-white">
                    {m.read ? <MailOpen className="h-4 w-4 text-slate-500" /> : <Mail className="h-4 w-4 text-accent-light" />}
                    {m.subject}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-400">
                    {m.name} · <a href={`mailto:${m.email}`} className="hover:text-accent-light">{m.email}</a>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-xs text-slate-500">{new Date(m.createdAt).toLocaleString()}</span>
                  {!m.read && (
                    <button
                      type="button"
                      disabled={busyId === m._id}
                      onClick={() => handleMarkRead(m._id)}
                      className="rounded-lg border border-navy-600 px-2.5 py-1.5 text-xs font-semibold text-slate-300 transition-colors hover:border-accent/50 hover:text-accent-light disabled:opacity-50"
                    >
                      Mark read
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={busyId === m._id}
                    onClick={() => handleDelete(m._id)}
                    className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                    aria-label="Delete message"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-slate-300">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
