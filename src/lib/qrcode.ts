// QR Code generation utility with vCard integration

import QRCode from 'qrcode';
import { ContactInfo, generateVCard } from './vcard';

// Generate vCard without image for QR code (smaller size)
export const generateVCardForQR = (contact: ContactInfo): string => {
  const contactWithoutImage = { ...contact };
  delete contactWithoutImage.profileImage; // Remove image to reduce size
  return generateVCard(contactWithoutImage);
};

export const generateQRCode = async (contact: ContactInfo): Promise<string> => {
  try {
    // Use vCard without image for QR code to avoid size limits
    const vCardData = generateVCardForQR(contact);
    
    const qrCodeDataURL = await QRCode.toDataURL(vCardData, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'L' // Use 'L' (Low) for more data capacity
    });
    
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    // If still too large, try with only essential contact info
    try {
      const essentialContact: ContactInfo = {
        firstName: contact.firstName,
        lastName: contact.lastName,
        phone: contact.phone,
        email: contact.email,
        organization: contact.organization,
        title: contact.title,
        website: contact.website,
        address: {
          street: '',
          city: '',
          state: '',
          zip: '',
          country: ''
        },
        note: ''
      };
      
      const essentialVCard = generateVCardForQR(essentialContact);
      const fallbackQR = await QRCode.toDataURL(essentialVCard, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'L'
      });
      
      return fallbackQR;
    } catch (fallbackError) {
      console.error('Error generating fallback QR code:', fallbackError);
      throw new Error('Contact information is too large for QR code');
    }
  }
};

// Generate QR code for full vCard (with image) - may fail if too large
export const generateFullVCardQR = async (contact: ContactInfo): Promise<string> => {
  try {
    const fullVCardData = generateVCard(contact);
    
    const qrCodeDataURL = await QRCode.toDataURL(fullVCardData, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'L'
    });
    
    return qrCodeDataURL;
  } catch {
    throw new Error('Full contact info with image is too large for QR code');
  }
};

export const downloadQRCode = async (contact: ContactInfo) => {
  try {
    const qrCodeDataURL = await generateQRCode(contact);
    const link = document.createElement('a');
    link.href = qrCodeDataURL;
    link.download = `${contact.firstName}_${contact.lastName}_QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading QR code:', error);
    alert('Unable to generate QR code. Contact information may be too large.');
  }
};