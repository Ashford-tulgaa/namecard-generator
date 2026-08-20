// vCard utility functions for generating contact data (RFC 2426 / vCard 3.0)

export interface ContactInfo {
  firstName: string;
  lastName: string;
  organization: string;
  title: string;
  phone: string;
  email: string;
  website: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  note: string;
  profileImage?: string; // Base64 encoded image data URL
}

export const emptyContact = (): ContactInfo => ({
  firstName: '',
  lastName: '',
  organization: '',
  title: '',
  phone: '',
  email: '',
  website: '',
  address: {
    street: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  },
  note: ''
});

const asString = (value: unknown): string => (typeof value === 'string' ? value : '');

/**
 * Rebuilds a ContactInfo from untrusted input (e.g. a localStorage draft) so a
 * malformed or hand-edited payload can never crash a render or smuggle a
 * non-image URL into an <img src>.
 */
export const normalizeContact = (value: unknown): ContactInfo => {
  const raw = (value ?? {}) as Record<string, unknown>;
  const address = (raw.address ?? {}) as Record<string, unknown>;
  const image = asString(raw.profileImage);

  return {
    firstName: asString(raw.firstName),
    lastName: asString(raw.lastName),
    organization: asString(raw.organization),
    title: asString(raw.title),
    phone: asString(raw.phone),
    email: asString(raw.email),
    website: asString(raw.website),
    address: {
      street: asString(address.street),
      city: asString(address.city),
      state: asString(address.state),
      zip: asString(address.zip),
      country: asString(address.country)
    },
    note: asString(raw.note),
    profileImage: image.startsWith('data:image/') ? image : undefined
  };
};

/** A card is exportable once it has a name and at least one way to reach the person. */
export const hasMinimumContact = (contact: ContactInfo): boolean =>
  Boolean(
    (contact.firstName.trim() || contact.lastName.trim()) &&
    (contact.phone.trim() || contact.email.trim())
  );

export const displayName = (contact: ContactInfo): string =>
  [contact.firstName.trim(), contact.lastName.trim()].filter(Boolean).join(' ');

export const contactFileBase = (contact: ContactInfo): string => {
  const slug = displayName(contact)
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  return slug || 'contact';
};

// Escape order matters: backslashes first, or we double-escape our own escapes.
const escapeValue = (value: string): string =>
  value
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\r|\n/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,');

/**
 * Folds a long content line to 75 octets with single-space continuations, as
 * required by RFC 2426. Only used for the base64 PHOTO payload — folding text
 * values risks splitting an escape sequence across lines in lenient parsers.
 */
const foldLine = (line: string): string => {
  if (line.length <= 75) return line;
  const parts = [line.slice(0, 75)];
  for (let i = 75; i < line.length; i += 74) {
    parts.push(line.slice(i, i + 74));
  }
  return parts.join('\r\n ');
};

const photoLine = (dataUrl: string): string | null => {
  const match = /^data:image\/([a-z0-9.+-]+);base64,(.+)$/i.exec(dataUrl);
  if (!match) return null;
  const subtype = match[1].toUpperCase();
  const type = subtype === 'JPG' ? 'JPEG' : subtype;
  return foldLine(`PHOTO;ENCODING=b;TYPE=${type}:${match[2]}`);
};

const hasAnyAddressField = (address: ContactInfo['address']): boolean =>
  Object.values(address).some((part) => part.trim().length > 0);

export const generateVCard = (contact: ContactInfo): string => {
  const address = contact.address;

  const lines: Array<string | null | false> = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${escapeValue(displayName(contact))}`,
    `N:${escapeValue(contact.lastName)};${escapeValue(contact.firstName)};;;`,
    contact.organization.trim() && `ORG:${escapeValue(contact.organization)}`,
    contact.title.trim() && `TITLE:${escapeValue(contact.title)}`,
    contact.phone.trim() && `TEL;TYPE=CELL,VOICE:${escapeValue(contact.phone)}`,
    contact.email.trim() && `EMAIL;TYPE=INTERNET:${escapeValue(contact.email)}`,
    contact.website.trim() && `URL:${escapeValue(contact.website)}`,
    hasAnyAddressField(address) &&
      `ADR;TYPE=WORK:;;${escapeValue(address.street)};${escapeValue(address.city)};` +
      `${escapeValue(address.state)};${escapeValue(address.zip)};${escapeValue(address.country)}`,
    contact.profileImage ? photoLine(contact.profileImage) : null,
    contact.note.trim() && `NOTE:${escapeValue(contact.note)}`,
    'END:VCARD'
  ];

  // CRLF line endings — some contact apps (notably older iOS) reject bare LF.
  return lines.filter((line): line is string => Boolean(line)).join('\r\n');
};

export const downloadVCard = (contact: ContactInfo) => {
  const blob = new Blob([generateVCard(contact)], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${contactFileBase(contact)}.vcf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
