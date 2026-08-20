'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import ContactForm from '@/components/ContactForm';
import NameCardPreview from '@/components/NameCardPreview';
import ActionButtons from '@/components/ActionButtons';
import PromoModal from '@/components/PromoModal';
import { ContactInfo, emptyContact, hasMinimumContact, normalizeContact } from '@/lib/vcard';
import { generateQRCode, QRCodeResult } from '@/lib/qrcode';
import { Leaf, ScanLine, Smartphone, Sparkles } from 'lucide-react';
import Image from 'next/image';

const DRAFT_KEY = 'ariona:name-card:draft';
const QR_DEBOUNCE_MS = 400;

const FEATURES = [
  {
    icon: Smartphone,
    title: 'Saves in one tap',
    body:
      'Point a phone camera at the code and it offers to add you to contacts — no app, no typing.'
  },
  {
    icon: Leaf,
    title: 'Nothing to reprint',
    body: 'Change jobs or numbers and generate a fresh card in seconds. No box of dead cards.'
  },
  {
    icon: ScanLine,
    title: 'Works everywhere',
    body: 'Standard vCard format, so iPhone and Android both read it the same way.'
  }
];

export default function Home() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(emptyContact);
  const [hydrated, setHydrated] = useState(false);

  const [qrCode, setQrCode] = useState<QRCodeResult | null>(null);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [qrError, setQrError] = useState<string | null>(null);

  // Restore the draft so a refresh doesn't wipe the form.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(DRAFT_KEY);
      if (saved) setContactInfo(normalizeContact(JSON.parse(saved)));
    } catch {
      // Corrupt or unreadable draft — start from a blank card.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(contactInfo));
    } catch {
      // Storage full or blocked — the app still works, drafts just won't persist.
    }
  }, [contactInfo, hydrated]);

  // Debounced QR generation. `cancelled` stops a slow, superseded request from
  // overwriting the result of a newer one.
  useEffect(() => {
    if (!hydrated) return;

    if (!hasMinimumContact(contactInfo)) {
      setQrCode(null);
      setQrError(null);
      setIsGeneratingQR(false);
      return;
    }

    let cancelled = false;
    setIsGeneratingQR(true);

    const timer = setTimeout(async () => {
      try {
        const result = await generateQRCode(contactInfo);
        if (cancelled) return;
        setQrCode(result);
        setQrError(null);
      } catch {
        if (cancelled) return;
        // Drop the stale code rather than showing one that no longer matches.
        setQrCode(null);
        setQrError(
          'These details are too long to fit in a QR code. Try shortening the notes or address.'
        );
      } finally {
        if (!cancelled) setIsGeneratingQR(false);
      }
    }, QR_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [contactInfo, hydrated]);

  const handleReset = useCallback(() => {
    setContactInfo(emptyContact());
    setQrCode(null);
    setQrError(null);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/ariona.png" alt="Ariona Logo" width={80} height={80} className="object-contain"/>
            {/* <span className="text-sm font-semibold text-slate-900">Ariona Online</span> */}
          </Link>
          <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 sm:flex">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Free · No sign-up
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="py-10 text-center sm:py-14">
          <h1 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            A digital business card people can save in one tap
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Fill in your details, download a vCard or QR code, and share it anywhere. Everything
            happens in your browser — nothing is uploaded.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 pb-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start">
          <ContactForm contactInfo={contactInfo} onContactChange={setContactInfo} />

          {/* Preview and actions travel with you as you scroll the form. */}
          <div className="space-y-6 lg:sticky lg:top-20">
            <NameCardPreview
              contactInfo={contactInfo}
              qrCodeUrl={qrCode?.dataUrl}
              isRefreshing={isGeneratingQR}
              qrError={qrError}
              qrOmittedExtras={qrCode?.omittedExtras}
            />
            <ActionButtons
              contactInfo={contactInfo}
              qrCodeUrl={qrCode?.dataUrl}
              onReset={handleReset}
            />
          </div>
        </div>

        <section className="border-t border-slate-200 py-14">
          <h2 className="text-center text-xl font-semibold tracking-tight text-slate-900">
            Why a QR business card
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-900/5"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                  <Icon className="h-4 w-4 text-blue-600" aria-hidden="true" />
                </span>
                <h3 className="mt-3.5 text-sm font-semibold text-slate-900">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <p>Free digital business cards with QR codes, forever.</p>
          <p>
            &copy; {new Date().getFullYear()}{' '}
            <a
              href="https://ariona.online"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-700 transition-colors hover:text-blue-600"
            >
              Ariona Online
            </a>
          </p>
        </div>
      </footer>

      <PromoModal />
    </div>
  );
}
