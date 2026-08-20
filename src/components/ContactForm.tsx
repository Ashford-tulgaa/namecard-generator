'use client';

import { ContactInfo } from '@/lib/vcard';
import { User, Building2, Phone, Mail, Globe, MapPin, FileText } from 'lucide-react';
import ProfileImageUpload from './ProfileImageUpload';

interface ContactFormProps {
  contactInfo: ContactInfo;
  onContactChange: (contact: ContactInfo) => void;
}

export default function ContactForm({ contactInfo, onContactChange }: ContactFormProps) {
  const handleInputChange = (field: keyof ContactInfo, value: string) => {
    onContactChange({
      ...contactInfo,
      [field]: value
    });
  };

  const handleAddressChange = (field: keyof ContactInfo['address'], value: string) => {
    onContactChange({
      ...contactInfo,
      address: {
        ...contactInfo.address,
        [field]: value
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
      
      {/* Profile Image Upload */}
      <ProfileImageUpload
        profileImage={contactInfo.profileImage}
        onImageChange={(imageDataUrl) => 
          handleInputChange('profileImage', imageDataUrl || '')
        }
      />
      
      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline w-4 h-4 mr-1" />
            First Name
          </label>
          <input
            type="text"
            value={contactInfo.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200"
            placeholder="John"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline w-4 h-4 mr-1" />
            Last Name
          </label>
          <input
            type="text"
            value={contactInfo.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200"
            placeholder="Doe"
          />
        </div>
      </div>

      {/* Professional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Building2 className="inline w-4 h-4 mr-1" />
            Organization
          </label>
          <input
            type="text"
            value={contactInfo.organization}
            onChange={(e) => handleInputChange('organization', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200"
            placeholder="Company Name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="inline w-4 h-4 mr-1" />
            Job Title
          </label>
          <input
            type="text"
            value={contactInfo.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200"
            placeholder="Software Engineer"
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="inline w-4 h-4 mr-1" />
            Phone Number
          </label>
          <input
            type="tel"
            value={contactInfo.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200"
            placeholder="+1 (555) 123-4567"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="inline w-4 h-4 mr-1" />
            Email Address
          </label>
          <input
            type="email"
            value={contactInfo.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200"
            placeholder="john.doe@example.com"
          />
        </div>
      </div>

      {/* Website */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Globe className="inline w-4 h-4 mr-1" />
          Website
        </label>
        <input
          type="url"
          value={contactInfo.website}
          onChange={(e) => handleInputChange('website', e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200"
          placeholder="https://www.example.com"
        />
      </div>

      {/* Address */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          <MapPin className="inline w-4 h-4 mr-1" />
          Address
        </label>
        
        <div>
          <input
            type="text"
            value={contactInfo.address.street}
            onChange={(e) => handleAddressChange('street', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200"
            placeholder="Street Address"
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <input
            type="text"
            value={contactInfo.address.city}
            onChange={(e) => handleAddressChange('city', e.target.value)}
            className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200"
            placeholder="City"
          />
          <input
            type="text"
            value={contactInfo.address.state}
            onChange={(e) => handleAddressChange('state', e.target.value)}
            className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200"
            placeholder="State"
          />
          <input
            type="text"
            value={contactInfo.address.zip}
            onChange={(e) => handleAddressChange('zip', e.target.value)}
            className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200"
            placeholder="ZIP"
          />
          <input
            type="text"
            value={contactInfo.address.country}
            onChange={(e) => handleAddressChange('country', e.target.value)}
            className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200"
            placeholder="Country"
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          value={contactInfo.note}
          onChange={(e) => handleInputChange('note', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 resize-vertical"
          placeholder="Additional information or notes..."
        />
      </div>
    </div>
  );
}