'use client';

import { ContactInfo } from '@/lib/vcard';
import { Phone, Mail, Globe, MapPin, Building2 } from 'lucide-react';

interface NameCardPreviewProps {
  contactInfo: ContactInfo;
  qrCodeUrl?: string;
}

export default function NameCardPreview({ contactInfo, qrCodeUrl }: NameCardPreviewProps) {
  const hasAddress = contactInfo.address.street || contactInfo.address.city || contactInfo.address.state;
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Name Card Preview</h2>
      
      {/* Business Card Design */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8 shadow-md border max-w-lg mx-auto">
        <div className="flex justify-between items-start">
          {/* Profile Image */}
          {contactInfo.profileImage && (
            <div className="mr-4 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={contactInfo.profileImage}
                alt="Profile"
                className="w-20 h-20 object-cover rounded-full border-3 border-white shadow-md"
              />
            </div>
          )}
          
          {/* Contact Details */}
          <div className="flex-1">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {contactInfo.firstName || 'First'} {contactInfo.lastName || 'Last'}
              </h3>
              {contactInfo.title && (
                <p className="text-lg text-gray-700 mt-1">{contactInfo.title}</p>
              )}
              {contactInfo.organization && (
                <p className="text-md text-gray-600 mt-1 flex items-center">
                  <Building2 className="w-4 h-4 mr-2" />
                  {contactInfo.organization}
                </p>
              )}
            </div>

            <div className="space-y-2 text-sm">
              {contactInfo.phone && (
                <div className="flex items-center text-gray-700">
                  <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{contactInfo.phone}</span>
                </div>
              )}
              
              {contactInfo.email && (
                <div className="flex items-center text-gray-700">
                  <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="break-all">{contactInfo.email}</span>
                </div>
              )}
              
              {contactInfo.website && (
                <div className="flex items-center text-gray-700">
                  <Globe className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="break-all">{contactInfo.website}</span>
                </div>
              )}
              
              {hasAddress && (
                <div className="flex items-start text-gray-700">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    {contactInfo.address.street && (
                      <div>{contactInfo.address.street}</div>
                    )}
                    <div>
                      {[
                        contactInfo.address.city,
                        contactInfo.address.state,
                        contactInfo.address.zip
                      ].filter(Boolean).join(', ')}
                    </div>
                    {contactInfo.address.country && (
                      <div>{contactInfo.address.country}</div>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* QR Code */}
          <div className={`flex-shrink-0 ${contactInfo.profileImage ? 'ml-4' : 'ml-auto'}`}>
            {qrCodeUrl ? (
              <div className="bg-white p-2 rounded-lg shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code for contact info" 
                  className="w-20 h-20 object-contain"
                />
              </div>
            ) : (
              <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-xs text-gray-500 text-center">QR Code</span>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        {contactInfo.note && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-600 italic">{contactInfo.note}</p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">📱 Smartphone Auto-Save</h4>
        <p className="text-sm text-blue-800">
          When someone scans the QR code with their smartphone camera, they can automatically 
          save your contact information to their contacts app. The vCard format ensures 
          compatibility with iPhone and Android devices.
        </p>
        {contactInfo.profileImage && (
          <p className="text-xs text-blue-700 mt-2">
            <strong>Note:</strong> QR code contains contact info without photo due to size limits. 
            Download the vCard file for complete info including your photo.
          </p>
        )}
      </div>
    </div>
  );
}