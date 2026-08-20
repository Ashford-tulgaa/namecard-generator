// QR Code generation utility with vCard integration

import QRCode from 'qrcode';
import { ContactInfo, contactFileBase, generateVCard } from './vcard';

export interface QRCodeResult {
  dataUrl: string;
  /** True when address/notes had to be dropped to fit inside the QR code. */
  omittedExtras: boolean;
}

// Generate vCard without image for QR code (smaller size)
export const generateVCardForQR = (contact: ContactInfo): string =>
  generateVCard({ ...contact, profileImage: undefined });

const encode = (data: string, errorCorrectionLevel: 'M' | 'L') =>
  QRCode.toDataURL(data, {
    width: 512,
    margin: 2,
    errorCorrectionLevel,
    // Pure black on white — anything softer hurts scan reliability in print.
    color: { dark: '#000000', light: '#FFFFFF' }
  });

const withoutExtras = (contact: ContactInfo): ContactInfo => ({
  ...contact,
  address: { street: '', city: '', state: '', zip: '', country: '' },
  note: '',
  profileImage: undefined
});

/**
 * Encodes the contact as a QR code, degrading gracefully rather than failing:
 * higher error correction first (best scan reliability), then lower, then the
 * essential fields only.
 */
export const generateQRCode = async (contact: ContactInfo): Promise<QRCodeResult> => {
  const attempts: Array<{ data: string; level: 'M' | 'L'; omittedExtras: boolean }> = [
    { data: generateVCardForQR(contact), level: 'M', omittedExtras: false },
    { data: generateVCardForQR(contact), level: 'L', omittedExtras: false },
    { data: generateVCardForQR(withoutExtras(contact)), level: 'L', omittedExtras: true }
  ];

  for (const attempt of attempts) {
    try {
      const dataUrl = await encode(attempt.data, attempt.level);
      return { dataUrl, omittedExtras: attempt.omittedExtras };
    } catch {
      // Payload too large for this configuration — fall through to the next.
    }
  }

  throw new Error('Contact information is too large for a QR code');
};

/**
 * Whether the full vCard (photo included) fits in a QR code. A 400px JPEG
 * almost never does, so callers use this to hide the option instead of
 * offering a button that always fails.
 */
export const canEncodeFullVCard = async (contact: ContactInfo): Promise<boolean> => {
  if (!contact.profileImage) return false;
  try {
    await encode(generateVCard(contact), 'L');
    return true;
  } catch {
    return false;
  }
};

export const generateFullVCardQR = async (contact: ContactInfo): Promise<string> => {
  try {
    return await encode(generateVCard(contact), 'L');
  } catch {
    throw new Error('Full contact info with photo is too large for a QR code');
  }
};

const triggerDownload = (dataUrl: string, fileName: string) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const downloadQRCode = async (contact: ContactInfo) => {
  const { dataUrl } = await generateQRCode(contact);
  triggerDownload(dataUrl, `${contactFileBase(contact)}-qr.png`);
};

export const downloadFullVCardQR = async (contact: ContactInfo) => {
  const dataUrl = await generateFullVCardQR(contact);
  triggerDownload(dataUrl, `${contactFileBase(contact)}-qr-with-photo.png`);
};
