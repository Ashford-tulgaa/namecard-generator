'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CalendarCheck, Check, PhoneCall, Sparkles, X } from 'lucide-react';

const DISMISS_KEY = 'ariona:promo:ai-reception:dismissed-at';
const DISMISS_DAYS = 30;
const SHOW_AFTER_MS = 25_000;
const IDLE_POLL_MS = 1_500;

const FOCUSABLE =
  'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

const wasRecentlyDismissed = (): boolean => {
  try {
    const raw = window.localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const dismissedAt = Number(raw);
    if (!Number.isFinite(dismissedAt)) return false;
    return Date.now() - dismissedAt < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
};

/** Don't interrupt someone mid-sentence in a form field. */
const isTypingInField = (): boolean => {
  const active = document.activeElement;
  return (
    active instanceof HTMLElement &&
    (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)
  );
};

export default function PromoModal() {
  const [armed, setArmed] = useState(false);
  const [open, setOpen] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  // Arm the timer once, unless this visitor already said no.
  useEffect(() => {
    if (wasRecentlyDismissed()) return;
    const timer = setTimeout(() => setArmed(true), SHOW_AFTER_MS);
    return () => clearTimeout(timer);
  }, []);

  // Once armed, open at the first moment the user isn't typing.
  useEffect(() => {
    if (!armed || open) return;

    const attempt = () => {
      if (!isTypingInField()) setOpen(true);
    };

    attempt();
    const poll = setInterval(attempt, IDLE_POLL_MS);
    return () => clearInterval(poll);
  }, [armed, open]);

  const close = useCallback(() => {
    try {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // Private browsing / storage disabled — the modal simply reappears next visit.
    }
    setOpen(false);
    setArmed(false);
    returnFocusRef.current?.focus();
  }, []);

  // Scroll lock, focus management and keyboard handling while open.
  useEffect(() => {
    if (!open) return;

    returnFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - body.clientWidth;

    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    // Focus the dialog itself so assistive tech announces the title, without
    // painting a focus ring on the close button.
    dialogRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== 'Tab') return;

      const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes || nodes.length === 0) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const current = document.activeElement;

      // Shift+Tab from the dialog itself would otherwise escape backwards.
      if (event.shiftKey && (current === first || current === dialogRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <div
        className="promo-backdrop absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="promo-title"
        aria-describedby="promo-description"
        tabIndex={-1}
        className="promo-card relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl outline-none ring-1 ring-slate-900/5"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 rounded-full p-1.5 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 px-6 pb-7 pt-8">
          <div
            className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"
            aria-hidden="true"
          />
          <div className="relative flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-inset ring-white/25">
              <PhoneCall className="h-5 w-5 text-white" aria-hidden="true" />
            </span>
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-inset ring-white/25">
              <CalendarCheck className="h-5 w-5 text-white" aria-hidden="true" />
            </span>
          </div>
          <p className="relative mt-5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/75">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            From the team behind Ariona
          </p>
          <h2 id="promo-title" className="relative mt-1.5 text-xl font-semibold text-white">
            Need help automating your bookings?
          </h2>
        </div>

        {/* Body */}
        <div className="px-6 pb-6 pt-5">
          <p id="promo-description" className="text-[15px] leading-relaxed text-slate-600">
            Try <span className="font-medium text-slate-900">Ariona AI reception</span> — it answers
            your calls, books appointments straight into your calendar, and follows up with clients
            around the clock.
          </p>

          <ul className="mt-4 space-y-2">
            {[
              'Answers every call in seconds, day or night',
              'Books and reschedules into your existing calendar',
              'Set up in minutes — no phone system to replace'
            ].map((benefit) => (
              <li key={benefit} className="flex items-start gap-2.5 text-sm text-slate-700">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
                {benefit}
              </li>
            ))}
          </ul>

          <div className="mt-6 space-y-2.5">
            <a
              href="https://ariona.online"
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              See how it works
              <span aria-hidden="true" className="ml-1.5">&rarr;</span>
            </a>
            <button
              type="button"
              onClick={close}
              className="w-full rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
            >
              Maybe later
            </button>
          </div>

          <p className="mt-3 text-center text-[11px] text-slate-400">
            Shown once — we won&apos;t ask again.
          </p>
        </div>
      </div>
    </div>
  );
}
