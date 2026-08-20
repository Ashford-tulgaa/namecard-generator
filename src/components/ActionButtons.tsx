'use client';

import { ContactInfo, downloadVCard } from '@/lib/vcard';
import { downloadQRCode } from '@/lib/qrcode';
import { Download, QrCode, Share2 } from 'lucide-react';

interface ActionButtonsProps {
  contactInfo: ContactInfo;
  qrCodeUrl?: string;
}

export default function ActionButtons({ contactInfo, qrCodeUrl }: ActionButtonsProps) {
  const handleDownloadVCard = () => {
    downloadVCard(contactInfo);
  };

  const handleDownloadQR = async () => {
    await downloadQRCode(contactInfo);
  };

  const handleShare = async () => {
    if (navigator.share && qrCodeUrl) {
      try {
        // Convert data URL to blob for sharing
        const response = await fetch(qrCodeUrl);
        const blob = await response.blob();
        const file = new File([blob], `${contactInfo.firstName}_${contactInfo.lastName}_QR.png`, {
          type: 'image/png',
        });

        await navigator.share({
          title: `${contactInfo.firstName} ${contactInfo.lastName} - Contact Card`,
          text: `Contact information for ${contactInfo.firstName} ${contactInfo.lastName}`,
          files: [file],
        });
      } catch (error) {
        console.error('Error sharing:', error);
        // Fallback to download if sharing fails
        handleDownloadQR();
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      handleDownloadQR();
    }
  };

  const isContactComplete = contactInfo.firstName && contactInfo.lastName && 
    (contactInfo.phone || contactInfo.email);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Actions</h2>
      
      <div className="space-y-4">
        {/* Download vCard */}
        <button
          onClick={handleDownloadVCard}
          disabled={!isContactComplete}
          className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-semibold transition-colors ${
            isContactComplete
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Download className="w-5 h-5 mr-2" />
          Download vCard (.vcf)
        </button>

        {/* Download QR Code */}
        <button
          onClick={handleDownloadQR}
          disabled={!isContactComplete}
          className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-semibold transition-colors ${
            isContactComplete
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <QrCode className="w-5 h-5 mr-2" />
          Download QR Code
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          disabled={!isContactComplete || !qrCodeUrl}
          className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-semibold transition-colors ${
            isContactComplete && qrCodeUrl
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Share2 className="w-5 h-5 mr-2" />
          Share QR Code
        </button>

        {/* Generate Full QR with Image (experimental) */}
        {contactInfo.profileImage && (
          <button
            onClick={async () => {
              try {
                const { generateFullVCardQR } = await import('@/lib/qrcode');
                const fullQR = await generateFullVCardQR(contactInfo);
                const link = document.createElement('a');
                link.href = fullQR;
                link.download = `${contactInfo.firstName}_${contactInfo.lastName}_Full_QR.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              } catch {
                alert('Image is too large for QR code. Use the regular QR code or reduce image size.');
              }
            }}
            disabled={!isContactComplete}
            className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-semibold transition-colors border-2 ${
              isContactComplete
                ? 'border-orange-300 text-orange-700 hover:bg-orange-50'
                : 'border-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <QrCode className="w-5 h-5 mr-2" />
            Try QR with Photo (Experimental)
          </button>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">💡 How to Use</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• <strong>vCard (.vcf):</strong> Complete contact info with photo for direct import</li>
            <li>• <strong>QR Code:</strong> Essential contact info (no photo) for instant scanning</li>
            <li>• <strong>Share:</strong> Send QR code via messages or social media</li>
          </ul>
        </div>

        <div className="p-4 bg-yellow-50 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">📱 Smartphone Compatibility</h4>
          <p className="text-sm text-yellow-700">
            iOS and Android devices can automatically detect and save contact information 
            when scanning the QR code with their default camera apps.
          </p>
        </div>
      </div>
    </div>
  );
}