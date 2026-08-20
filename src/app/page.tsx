'use client';

import { useState, useEffect } from 'react';
import ContactForm from '@/components/ContactForm';
import NameCardPreview from '@/components/NameCardPreview';
import ActionButtons from '@/components/ActionButtons';
import { ContactInfo } from '@/lib/vcard';
import { generateQRCode } from '@/lib/qrcode';

export default function Home() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
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
    note: '',
    profileImage: ''
  });
  
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  // Generate QR code when contact info changes
  useEffect(() => {
    const generateQR = async () => {
      if (contactInfo.firstName || contactInfo.lastName || contactInfo.phone || contactInfo.email) {
        setIsGeneratingQR(true);
        try {
          const qrUrl = await generateQRCode(contactInfo);
          setQrCodeUrl(qrUrl);
        } catch (error) {
          console.error('Failed to generate QR code:', error);
        } finally {
          setIsGeneratingQR(false);
        }
      } else {
        setQrCodeUrl('');
      }
    };

    const debounceTimer = setTimeout(generateQR, 500);
    return () => clearTimeout(debounceTimer);
  }, [contactInfo]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Ariona - Digital Name Card Generator</h1>
            <p className="mt-2 text-lg text-gray-600">
              Create professional business cards with QR codes for smartphone auto-save
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-8">
            <ContactForm 
              contactInfo={contactInfo}
              onContactChange={setContactInfo}
            />
            
            <ActionButtons 
              contactInfo={contactInfo}
              qrCodeUrl={qrCodeUrl}
            />
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-8">
            <NameCardPreview 
              contactInfo={contactInfo}
              qrCodeUrl={isGeneratingQR ? undefined : qrCodeUrl}
            />
            
            {isGeneratingQR && (
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Generating QR code...</p>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <section className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Why Use QR Code Business Cards?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Contact Save</h3>
              <p className="text-gray-600">
                Recipients can scan your QR code and instantly save your contact information 
                to their phone&apos;s contacts app.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Eco-Friendly</h3>
              <p className="text-gray-600">
                Digital business cards reduce paper waste and can be easily updated 
                without reprinting.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional</h3>
              <p className="text-gray-600">
                Modern QR codes show you&apos;re tech-savvy and make networking more efficient 
                for everyone involved.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>Generate professional digital business cards with QR codes</p>
          </div>
        </div>
      </footer>
    </div>
  );
}