'use client';

import { ContactInfo, displayName } from '@/lib/vcard';
import { Building2, Globe, Loader2, Mail, MapPin, Phone, QrCode } from 'lucide-react';

interface NameCardPreviewProps {
  contactInfo: ContactInfo;
  qrCodeUrl?: string;
  isRefreshing?: boolean;
  qrError?: string | null;
  qrOmittedExtras?: boolean;
}

const initials = (contact: ContactInfo): string => {
  const letters = [contact.firstName.trim()[0], contact.lastName.trim()[0]].filter(Boolean);
  return letters.join('').toUpperCase() || '·';
};

function DetailRow({ icon: Icon, children }: { icon: typeof Phone; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 text-sm text-slate-300">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" aria-hidden="true" />
      <span className="min-w-0 break-words">{children}</span>
    </div>
  );
}

export default function NameCardPreview({
  contactInfo,
  qrCodeUrl,
  isRefreshing,
  qrError,
  qrOmittedExtras
}: NameCardPreviewProps) {
  const { address } = contactInfo;
  const cityLine = [address.city, address.state, address.zip].filter(Boolean).join(', ');
  const hasAddress = Boolean(address.street || cityLine || address.country);
  const name = displayName(contactInfo);

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5">
      <header className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Live preview</h2>
          <p className="mt-0.5 text-xs text-slate-500">Updates as you type.</p>
        </div>
        {isRefreshing && (
          <span className="flex items-center gap-1.5 text-xs text-slate-400" role="status">
            <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
            Updating
          </span>
        )}
      </header>

      <div className="p-5 sm:p-6">
        {/* The card itself */}
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-5 shadow-lg ring-1 ring-slate-900/10 sm:p-6">
          <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-6">
            <div className="min-w-0">
              <div className="flex items-center gap-3.5">
                {contactInfo.profileImage ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={contactInfo.profileImage}
                    alt=""
                    className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-white/15"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10 text-base font-semibold text-slate-300 ring-2 ring-white/10"
                  >
                    {initials(contactInfo)}
                  </span>
                )}

                <div className="min-w-0">
                  <p className="text-lg font-semibold leading-snug text-white break-words">
                    {name || <span className="text-slate-500">Your name</span>}
                  </p>
                  {contactInfo.title && (
                    <p className="mt-0.5 text-sm text-slate-400 break-words">{contactInfo.title}</p>
                  )}
                </div>
              </div>

              {(contactInfo.organization ||
                contactInfo.phone ||
                contactInfo.email ||
                contactInfo.website ||
                hasAddress) && (
                <div className="mt-5 space-y-2 border-t border-white/10 pt-5">
                  {contactInfo.organization && (
                    <DetailRow icon={Building2}>{contactInfo.organization}</DetailRow>
                  )}
                  {contactInfo.phone && <DetailRow icon={Phone}>{contactInfo.phone}</DetailRow>}
                  {contactInfo.email && <DetailRow icon={Mail}>{contactInfo.email}</DetailRow>}
                  {contactInfo.website && <DetailRow icon={Globe}>{contactInfo.website}</DetailRow>}
                  {hasAddress && (
                    <DetailRow icon={MapPin}>
                      {[address.street, cityLine, address.country].filter(Boolean).join(' · ')}
                    </DetailRow>
                  )}
                </div>
              )}
            </div>

            {/* QR chip — items-start keeps the white chip from stretching to row height. */}
            <div className="flex shrink-0 items-start justify-start sm:justify-end">
              {qrCodeUrl ? (
                <div className="rounded-xl bg-white p-2 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrCodeUrl}
                    alt={
                      name
                        ? `QR code containing the contact details for ${name}`
                        : 'QR code containing your contact details'
                    }
                    className="h-24 w-24 object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-[112px] w-[112px] flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/15 bg-white/5 px-2 text-center">
                  <QrCode className="h-5 w-5 text-slate-500" aria-hidden="true" />
                  <span className="text-[10px] leading-tight text-slate-500">
                    {qrError ? 'Unavailable' : 'Add a name and phone or email'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {contactInfo.note && (
            <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed text-slate-400">
              {contactInfo.note}
            </p>
          )}
        </div>

        {/* Status notes */}
        <div className="mt-4 space-y-2">
          {qrError && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
              {qrError}
            </p>
          )}
          {qrOmittedExtras && !qrError && (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Your address and notes were left out of the QR code to keep it scannable. The vCard
              download still includes everything.
            </p>
          )}
          <p className="text-xs leading-relaxed text-slate-500">
            Scanning this code with an iPhone or Android camera offers to save your details straight
            to the contacts app.
          </p>
        </div>
      </div>
    </div>
  );
}
