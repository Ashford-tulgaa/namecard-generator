// vCard utility functions for generating contact data

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

export const generateVCard = (contact: ContactInfo): string => {
  const vCard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${contact.firstName} ${contact.lastName}`,
    `N:${contact.lastName};${contact.firstName};;;`,
    contact.organization && `ORG:${contact.organization}`,
    contact.title && `TITLE:${contact.title}`,
    contact.phone && `TEL;TYPE=CELL:${contact.phone}`,
    contact.email && `EMAIL:${contact.email}`,
    contact.website && `URL:${contact.website}`,
    contact.address && 
      `ADR;TYPE=WORK:;;${contact.address.street};${contact.address.city};${contact.address.state};${contact.address.zip};${contact.address.country}`,
    contact.profileImage && `PHOTO;ENCODING=BASE64;TYPE=JPEG:${contact.profileImage.replace(/^data:image\/[a-z]+;base64,/, '')}`,
    contact.note && `NOTE:${contact.note}`,
    'END:VCARD'
  ];

  return vCard.filter(Boolean).join('\n');
};

export const downloadVCard = (contact: ContactInfo) => {
  const vCardData = generateVCard(contact);
  const blob = new Blob([vCardData], { type: 'text/vcard' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${contact.firstName}_${contact.lastName}.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};