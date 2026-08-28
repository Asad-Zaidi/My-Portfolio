import { useState } from "react";
import {
  LuMail as Mail,
  LuPhone as Phone,
  LuMapPin as MapPin,
  LuSend as Send,
  LuCircleCheck as CheckCircle2,
  LuCircleAlert as AlertCircle,
  LuDownload as Download,
} from "react-icons/lu";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { submitContactMessage } from "../services/api";

const initialForm = { name: "", email: "", subject: "", message: "" };

export default function Contact({ contact, resume }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error

  if (!contact) return null;

  const validate = (values) => {
    const next = {};
    if (!values.name.trim()) next.name = "Name is required.";
    if (!values.email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = "Enter a valid email address.";
    if (!values.subject.trim()) next.subject = "Subject is required.";
    if (!values.message.trim()) next.message = "Message can't be empty.";
    return next;
  };

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation = validate(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setStatus("submitting");
    try {
      await submitContactMessage(form);
      setStatus("success");
      setForm(initialForm);
    } catch {
      setStatus("error");
    }
  };

  const fieldClass = (field) =>
    `w-full rounded-lg border bg-white dark:bg-navy-900 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/50 ${
      errors[field] ? "border-red-400 dark:border-red-500" : "border-slate-200 dark:border-navy-700"
    }`;

  const hasResume = Boolean(resume?.file);

  return (
    <section id="contact" className="-mx-12 bg-slate-50 dark:bg-navy-900 py-16 md:-mx-32 md:py-24">
      <div className="container px-8 md:px-32">
        <SectionHeading icon={Mail} title={contact.heading} subtitle={contact.description} />

        <div className="grid gap-10 lg:grid-cols-5">
          {/* left: info + decorative map */}
          <Reveal className="lg:col-span-2 flex flex-col gap-6">
            <div className="space-y-4">
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 p-4 hover:border-accent/40"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs text-slate-400">Email</div>
                    <div className="truncate font-medium text-slate-800 dark:text-slate-100">{contact.email}</div>
                  </div>
                </a>
              )}
              {contact.phone && (
                <a
                  href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 p-4 hover:border-accent/40"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-xs text-slate-400">Phone</div>
                    <div className="font-medium text-slate-800 dark:text-slate-100">{contact.phone}</div>
                  </div>
                </a>
              )}
              {contact.location && (
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-xs text-slate-400">Location</div>
                    <div className="font-medium text-slate-800 dark:text-slate-100">{contact.location}</div>
                  </div>
                </div>
              )}
            </div>

            {hasResume && (
              <a
                href={resume.file}
                download
                className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-accent/40 bg-accent/5 p-4 text-sm font-semibold text-accent hover:bg-accent/10"
              >
                Prefer a quick overview? Download my résumé
                <Download className="h-4 w-4 shrink-0" />
              </a>
            )}

            {/* decorative world map */}
            <div className="relative hidden sm:flex flex-1 min-h-[140px] items-center justify-center rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 overflow-hidden">
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "radial-gradient(currentColor 1px, transparent 1px)",
                  backgroundSize: "14px 14px",
                  color: "#94a3b8",
                }}
              />
              <MapPin className="absolute h-5 w-5 text-accent" style={{ top: "38%", left: "42%" }} />
              <MapPin className="absolute h-4 w-4 text-accent/60" style={{ top: "55%", left: "62%" }} />
            </div>
          </Reveal>

          {/* right: form */}
          <Reveal delay={120} className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-2xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 p-6 sm:p-8 shadow-card space-y-5"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={handleChange("name")}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "contact-name-error" : undefined}
                    className={fieldClass("name")}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p id="contact-name-error" className="mt-1 text-xs text-red-500">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Your Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange("email")}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "contact-email-error" : undefined}
                    className={fieldClass("email")}
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p id="contact-email-error" className="mt-1 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={handleChange("subject")}
                  aria-invalid={Boolean(errors.subject)}
                  aria-describedby={errors.subject ? "contact-subject-error" : undefined}
                  className={fieldClass("subject")}
                  placeholder="Let's work together"
                />
                {errors.subject && (
                  <p id="contact-subject-error" className="mt-1 text-xs text-red-500">{errors.subject}</p>
                )}
              </div>

              <div>
                <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Your Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange("message")}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "contact-message-error" : undefined}
                  className={`${fieldClass("message")} resize-none`}
                  placeholder="Tell me about your project..."
                />
                {errors.message && (
                  <p id="contact-message-error" className="mt-1 text-xs text-red-500">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-dark disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "submitting" ? "Sending..." : "Send Message"}
                <Send className="h-4 w-4" />
              </button>

              <div role="status" aria-live="polite">
                {status === "success" && (
                  <p className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" /> Message sent! I'll get back to you soon.
                  </p>
                )}
                {status === "error" && (
                  <p className="flex items-center gap-2 text-sm font-medium text-red-500">
                    <AlertCircle className="h-4 w-4" /> Something went wrong. Please try again.
                  </p>
                )}
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
