"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { ArrowRight, Check, CircleCheck, LoaderCircle, RotateCcw } from "lucide-react";
import { useUi } from "@/i18n/provider";
import { track } from "@/lib/analytics";
import {
  fieldIssue,
  limits,
  suggestEmail,
  validateAll,
  type ContactField,
  type ContactValues,
  type FieldIssue,
} from "@/lib/contact-validation";

type Status = "idle" | "sending" | "success" | "error" | "limited";

const empty: ContactValues = { name: "", email: "", company: "", message: "" };

// Validation is quiet until a field is left (blur) or the form is submitted;
// after that, the field re-checks on every keystroke so errors clear as soon
// as they are fixed.
export function ContactForm({ email }: { email: string }) {
  const t = useUi().contactForm;
  const id = useId();
  const root = useRef<HTMLFormElement>(null);
  const started = useRef(false);
  const [startedAt] = useState(() => Date.now());
  const [status, setStatus] = useState<Status>("idle");
  const [values, setValues] = useState<ContactValues>(empty);
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const [serverIssues, setServerIssues] = useState<ContactField[]>([]);

  const issueFor = (field: ContactField): FieldIssue | null =>
    touched[field] ? fieldIssue(field, values[field]) : serverIssues.includes(field) ? "format" : null;
  const suggestion = touched.email && !fieldIssue("email", values.email) ? suggestEmail(values.email) : null;

  useEffect(() => {
    const form = root.current;
    if (!form) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        track("contact_form_view");
        observer.disconnect();
      },
      { threshold: 0.4 },
    );
    observer.observe(form);
    return () => observer.disconnect();
  }, [status]);

  const onStart = () => {
    if (started.current) return;
    started.current = true;
    track("contact_form_started");
  };

  const update = (field: ContactField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setServerIssues((list) => list.filter((f) => f !== field));
  };

  const leave = (field: ContactField) => {
    // Only start judging a field once something was typed or it was skipped
    // after interaction; tabbing through an empty optional field stays calm.
    if (field === "company" && !values.company) return;
    if (field === "email") update("email", values.email.trim());
    setTouched((current) => ({ ...current, [field]: true }));
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    setTouched({ name: true, email: true, company: true, message: true });
    const issues = validateAll(values);
    const first = (Object.keys(limits) as ContactField[]).find((field) => issues[field]);
    if (first) {
      root.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      track("contact_form_error", { status: 0, reason: "client_validation", fields: Object.keys(issues) });
      return;
    }
    setStatus("sending");
    track("contact_form_submitted", { has_company: Boolean(values.company.trim()) });
    const website = new FormData(event.currentTarget).get("website") ?? "";
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website, startedAt }),
      });
      if (response.ok) {
        setStatus("success");
        track("contact_form_success");
        setValues(empty);
        setTouched({});
        return;
      }
      const body = await response.json().catch(() => ({}));
      if (body.error === "invalid_fields" && Array.isArray(body.fields)) {
        setServerIssues(body.fields);
        setStatus("idle");
      } else setStatus(response.status === 429 ? "limited" : "error");
      track("contact_form_error", { status: response.status, reason: body.error ?? "unknown" });
    } catch {
      setStatus("error");
      track("contact_form_error", { status: 0, reason: "network" });
    }
  }

  // Cmd/Ctrl + Enter sends from the message box.
  const onMessageKey = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      root.current?.requestSubmit();
    }
  };


  const fieldProps = (field: ContactField) => ({
    id: `${id}-${field}`,
    name: field,
    value: values[field],
    "aria-invalid": Boolean(issueFor(field)) || undefined,
    "aria-describedby": `${id}-${field}-msg`,
    "data-valid":
      (touched[field] && values[field].trim() && !fieldIssue(field, values[field])) || undefined,
    onChange: (e: { target: { value: string } }) => update(field, e.target.value),
    onBlur: () => leave(field),
  });

  const errorText = (field: ContactField) => {
    const issue = issueFor(field);
    if (!issue) return null;
    // Server-reported issues may not match a client rule; fall back to the
    // field's first message.
    const messages = t.invalid[field] as Record<string, string>;
    return messages[issue] ?? Object.values(messages)[0];
  };

  // Every field owns one fixed-height line below it. Errors, hints and the
  // email suggestion swap inside that line, so nothing around it moves.
  const slot = (field: ContactField, fallback: ReactNode = null) => {
    const error = errorText(field);
    return (
      <p
        id={`${id}-${field}-msg`}
        className="field-message"
        data-tone={error ? "error" : fallback ? "hint" : undefined}
        aria-live="polite"
      >
        {error ?? fallback}
      </p>
    );
  };

  const messageLength = values.message.trim().length;
  const remaining = limits.message.min - messageLength;

  if (status === "success") {
    return (
      <div id="contact-form" className="contact-form contact-form-done" role="status">
        <span className="contact-form-check" aria-hidden="true">
          <Check size={22} />
        </span>
        <p className="contact-form-title">{t.successTitle}</p>
        <p>{t.successBody}</p>
        <button type="button" className="text-link" onClick={() => setStatus("idle")}>
          <RotateCcw size={14} aria-hidden="true" /> {t.another}
        </button>
      </div>
    );
  }

  return (
    <form
      ref={root}
      id="contact-form"
      className="contact-form"
      noValidate
      onSubmit={onSubmit}
      onFocus={onStart}
      aria-busy={status === "sending"}
    >
      <div className="contact-form-row">
        <div className="field">
          <label htmlFor={`${id}-name`}>{t.name}</label>
          <div className="field-control">
            <input
              {...fieldProps("name")}
              autoComplete="name"
              required
              maxLength={limits.name.max}
            />
            <CircleCheck className="field-ok" size={16} aria-hidden="true" />
          </div>
          {slot("name")}
        </div>
        <div className="field">
          <label htmlFor={`${id}-email`}>{t.email}</label>
          <div className="field-control">
            <input
              {...fieldProps("email")}
              type="email"
              autoComplete="email"
              inputMode="email"
              autoCapitalize="none"
              spellCheck={false}
              required
              maxLength={limits.email.max}
            />
            <CircleCheck className="field-ok" size={16} aria-hidden="true" />
          </div>
          {slot(
            "email",
            suggestion && (
              <span className="field-suggestion">
                {t.didYouMean}{" "}
                <button type="button" onClick={() => update("email", suggestion)}>
                  {suggestion}
                </button>
                ?
              </span>
            ),
          )}
        </div>
      </div>
      <div className="field">
        <label htmlFor={`${id}-company`}>
          {t.company} <span className="field-optional">({t.optional})</span>
        </label>
        <div className="field-control">
          <input
            {...fieldProps("company")}
            autoComplete="organization"
            maxLength={limits.company.max}
          />
          <CircleCheck className="field-ok" size={16} aria-hidden="true" />
        </div>
        {slot("company")}
      </div>
      <div className="field">
        <label htmlFor={`${id}-message`}>{t.message}</label>
        <textarea
          {...fieldProps("message")}
          rows={5}
          required
          maxLength={limits.message.max}
          onKeyDown={onMessageKey}
        />
        <div className="field-meta">
          {slot(
            "message",
            remaining > 0 && messageLength > 0 ? t.moreChars(remaining) : t.messageHint,
          )}
          <span
            className="field-count"
            data-near={values.message.length > limits.message.max * 0.9 || undefined}
            aria-hidden="true"
          >
            {values.message.length}/{limits.message.max}
          </span>
        </div>
      </div>
      {/* Honeypot: invisible to people and screen readers, tempting to bots. */}
      <div className="contact-hp" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="contact-form-footer">
        <button type="submit" className="button primary" disabled={status === "sending"}>
          {status === "sending" ? (
            <>
              <LoaderCircle size={16} className="spin" aria-hidden="true" /> {t.sending}
            </>
          ) : (
            <>
              {t.submit} <ArrowRight size={16} aria-hidden="true" />
            </>
          )}
        </button>
        <span className="contact-form-shortcut" aria-hidden="true">
          {t.shortcut}
        </span>
        <div className="contact-form-status" role="alert" aria-live="assertive">
          {(status === "error" || status === "limited") && (
            <p>
              <strong>{t.errorTitle}</strong>{" "}
              {status === "limited" ? t.rateLimited : t.errorBody}{" "}
              <a href={`mailto:${email}`}>{email}</a>
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
