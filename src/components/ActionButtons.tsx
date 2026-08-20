'use client';

import { useEffect, useRef, useState } from 'react';
import { ContactInfo, contactFileBase, downloadVCard, hasMinimumContact } from '@/lib/vcard';
import { canEncodeFullVCard, downloadFullVCardQR, downloadQRCode } from '@/lib/qrcode';
import { Check, Download, Loader2, QrCode, RotateCcw, Share2 } from 'lucide-react';

interface ActionButtonsProps {
  contactInfo: ContactInfo;
  qrCodeUrl?: string;
  onReset: () => void;
}

type Busy = 'vcard' | 'qr' | 'share' | 'full-qr' | null;

const isAbort = (error: unknown): boolean =>
  error instanceof DOMException && error.name === 'AbortError';

export default function ActionButtons({ contactInfo, qrCodeUrl, onReset }: ActionButtonsProps) {
  const [busy, setBusy] = useState<Busy>(null);
  const [toast, setToast] = useState<{ tone: 'ok' | 'error'; message: string } | null>(null);
  const [canShareFiles, setCanShareFiles] = useState(false);
  const [fullQrFits, setFullQrFits] = useState(false);

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isReady = hasMinimumContact(contactInfo);

  const notify = (tone: 'ok' | 'error', message: string) => {
    setToast({ tone, message });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  };

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  // Feature-detect in an effect so the server and client render the same markup.
  useEffect(() => {
    setCanShareFiles(
      typeof navigator !== 'undefined' &&
      typeof navigator.share === 'function' &&
      typeof navigator.canShare === 'function'
    );
  }, []);

  // Only offer the photo QR when the payload genuinely fits — otherwise the
  // button can never succeed.
  useEffect(() => {
    if (!isReady || !contactInfo.profileImage) {
      setFullQrFits(false);
      return;
    }

    let cancelled = false;
    canEncodeFullVCard(contactInfo).then((fits) => {
      if (!cancelled) setFullQrFits(fits);
    });

    return () => {
      cancelled = true;
    };
  }, [contactInfo, isReady]);

  const handleDownloadVCard = () => {
    setBusy('vcard');
    try {
      downloadVCard(contactInfo);
      notify('ok', 'vCard downloaded');
    } catch {
      notify('error', 'Could not create the vCard file.');
    } finally {
      setBusy(null);
    }
  };

  const handleDownloadQR = async () => {
    setBusy('qr');
    try {
      await downloadQRCode(contactInfo);
      notify('ok', 'QR code downloaded');
    } catch {
      notify('error', 'Your details are too long to fit in a QR code.');
    } finally {
      setBusy(null);
    }
  };

  const handleShare = async () => {
    if (!qrCodeUrl) return;

    setBusy('share');
    try {
      const blob = await (await fetch(qrCodeUrl)).blob();
      const file = new File([blob], `${contactFileBase(contactInfo)}-qr.png`, {
        type: 'image/png'
      });

      if (!navigator.canShare({ files: [file] })) {
        await downloadQRCode(contactInfo);
        notify('ok', 'Sharing files isn’t supported here — downloaded instead');
        return;
      }

      await navigator.share({
        title: `${contactFileBase(contactInfo)} — contact card`,
        files: [file]
      });
    } catch (error) {
      // Dismissing the native share sheet raises AbortError. That's a
      // deliberate "no" from the user, so do nothing at all.
      if (!isAbort(error)) {
        notify('error', 'Sharing failed. Try downloading the QR code instead.');
      }
    } finally {
      setBusy(null);
    }
  };

  const handleFullQR = async () => {
    setBusy('full-qr');
    try {
      await downloadFullVCardQR(contactInfo);
      notify('ok', 'QR code with photo downloaded');
    } catch {
      notify('error', 'The photo makes this QR code too large. Use the vCard download.');
      setFullQrFits(false);
    } finally {
      setBusy(null);
    }
  };

  const primary =
    'flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ' +
    'shadow-sm transition-colors disabled:cursor-not-allowed';
  const secondary =
    'flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white ' +
    'px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-colors ' +
    'hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-100 disabled:text-slate-400';

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5">
      <header className="border-b border-slate-100 bg-slate-50/60 px-5 py-4 sm:px-6">
        <h2 className="text-base font-semibold text-slate-900">Download &amp; share</h2>
        <p className="mt-0.5 text-xs text-slate-500">Free, unlimited, no account.</p>
      </header>

      <div className="space-y-3 p-5 sm:p-6">
        {!isReady && (
          <p id="actions-hint" className="rounded-lg bg-slate-50 px-3 py-2.5 text-xs text-slate-600">
            Add your name plus a phone number or email to unlock downloads.
          </p>
        )}

        <button
          type="button"
          onClick={handleDownloadVCard}
          disabled={!isReady || busy !== null}
          aria-describedby={isReady ? undefined : 'actions-hint'}
          className={`${primary} ${
            isReady
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-slate-100 text-slate-400'
          }`}
        >
          {busy === 'vcard' ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Download className="h-4 w-4" aria-hidden="true" />
          )}
          Download vCard (.vcf)
        </button>

        <button
          type="button"
          onClick={handleDownloadQR}
          disabled={!isReady || busy !== null}
          aria-describedby={isReady ? undefined : 'actions-hint'}
          className={secondary}
        >
          {busy === 'qr' ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <QrCode className="h-4 w-4" aria-hidden="true" />
          )}
          Download QR code
        </button>

        {canShareFiles && (
          <button
            type="button"
            onClick={handleShare}
            disabled={!isReady || !qrCodeUrl || busy !== null}
            className={secondary}
          >
            {busy === 'share' ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Share2 className="h-4 w-4" aria-hidden="true" />
            )}
            Share QR code
          </button>
        )}

        {fullQrFits && (
          <button
            type="button"
            onClick={handleFullQR}
            disabled={busy !== null}
            className={secondary}
          >
            {busy === 'full-qr' ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <QrCode className="h-4 w-4" aria-hidden="true" />
            )}
            Download QR code with photo
          </button>
        )}

        <div className="border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-red-600"
          >
            <RotateCcw className="h-3 w-3" aria-hidden="true" />
            Clear all fields
          </button>
        </div>

        <div className="space-y-1.5 rounded-xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-600">
          <p>
            <span className="font-semibold text-slate-900">vCard</span> — every detail, photo
            included. Best for sending directly to someone.
          </p>
          <p>
            <span className="font-semibold text-slate-900">QR code</span> — contact details without
            the photo. Best for print, slides and screens.
          </p>
        </div>
      </div>

      {/* Toast */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4"
      >
        {toast && (
          <p
            className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium shadow-lg ${
              toast.tone === 'ok' ? 'bg-slate-900 text-white' : 'bg-red-600 text-white'
            }`}
          >
            {toast.tone === 'ok' && <Check className="h-4 w-4" aria-hidden="true" />}
            {toast.message}
          </p>
        )}
      </div>
    </div>
  );
}
