'use client';

import { ContactInfo } from '@/lib/vcard';
import { Building2, FileText, Globe, Mail, MapPin, Phone, User } from 'lucide-react';
import ProfileImageUpload from './ProfileImageUpload';
import { TextAreaField, TextField } from './ui/Fields';

interface ContactFormProps {
  contactInfo: ContactInfo;
  onContactChange: (contact: ContactInfo) => void;
}

interface SectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

function Section({ title, description, children }: SectionProps) {
  return (
    <section className="border-t border-slate-100 px-5 py-6 first:border-t-0 sm:px-6">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export default function ContactForm({ contactInfo, onContactChange }: ContactFormProps) {
  const handleInputChange = (field: keyof Omit<ContactInfo, 'address'>, value: string) => {
    onContactChange({ ...contactInfo, [field]: value });
  };

  const handleAddressChange = (field: keyof ContactInfo['address'], value: string) => {
    onContactChange({
      ...contactInfo,
      address: { ...contactInfo.address, [field]: value }
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5">
      <header className="border-b border-slate-100 bg-slate-50/60 px-5 py-4 sm:px-6">
        <h2 className="text-base font-semibold text-slate-900">Your details</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Everything stays in your browser — nothing is uploaded.
        </p>
      </header>

      <Section title="Photo" description="Optional. Included in the downloadable vCard.">
        <ProfileImageUpload
          profileImage={contactInfo.profileImage}
          onImageChange={(imageDataUrl) =>
            onContactChange({ ...contactInfo, profileImage: imageDataUrl ?? undefined })
          }
        />
      </Section>

      <Section title="Name & role">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            label="First name"
            icon={User}
            value={contactInfo.firstName}
            onChange={(value) => handleInputChange('firstName', value)}
            placeholder="Jane"
            autoComplete="given-name"
          />
          <TextField
            label="Last name"
            icon={User}
            value={contactInfo.lastName}
            onChange={(value) => handleInputChange('lastName', value)}
            placeholder="Okafor"
            autoComplete="family-name"
          />
          <TextField
            label="Job title"
            icon={FileText}
            value={contactInfo.title}
            onChange={(value) => handleInputChange('title', value)}
            placeholder="Product Designer"
            autoComplete="organization-title"
          />
          <TextField
            label="Organization"
            icon={Building2}
            value={contactInfo.organization}
            onChange={(value) => handleInputChange('organization', value)}
            placeholder="Northwind Studio"
            autoComplete="organization"
          />
        </div>
      </Section>

      <Section title="How to reach you" description="Add a phone number or an email to enable downloads.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            label="Phone"
            icon={Phone}
            type="tel"
            inputMode="tel"
            value={contactInfo.phone}
            onChange={(value) => handleInputChange('phone', value)}
            placeholder="+1 555 123 4567"
            autoComplete="tel"
          />
          <TextField
            label="Email"
            icon={Mail}
            type="email"
            inputMode="email"
            value={contactInfo.email}
            onChange={(value) => handleInputChange('email', value)}
            placeholder="jane@example.com"
            autoComplete="email"
          />
        </div>
        <TextField
          label="Website"
          icon={Globe}
          type="url"
          inputMode="url"
          value={contactInfo.website}
          onChange={(value) => handleInputChange('website', value)}
          placeholder="https://example.com"
          autoComplete="url"
        />
      </Section>

      <Section title="Address" description="Optional.">
        <TextField
          label="Street address"
          icon={MapPin}
          labelHidden
          value={contactInfo.address.street}
          onChange={(value) => handleAddressChange('street', value)}
          placeholder="Street address"
          autoComplete="street-address"
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <TextField
            label="City"
            labelHidden
            value={contactInfo.address.city}
            onChange={(value) => handleAddressChange('city', value)}
            placeholder="City"
            autoComplete="address-level2"
          />
          <TextField
            label="State or region"
            labelHidden
            value={contactInfo.address.state}
            onChange={(value) => handleAddressChange('state', value)}
            placeholder="State"
            autoComplete="address-level1"
          />
          <TextField
            label="ZIP or postal code"
            labelHidden
            value={contactInfo.address.zip}
            onChange={(value) => handleAddressChange('zip', value)}
            placeholder="ZIP"
            autoComplete="postal-code"
          />
          <TextField
            label="Country"
            labelHidden
            value={contactInfo.address.country}
            onChange={(value) => handleAddressChange('country', value)}
            placeholder="Country"
            autoComplete="country-name"
          />
        </div>
      </Section>

      <Section title="Notes" description="A short line that appears on your card and in the saved contact.">
        <TextAreaField
          label="Notes"
          labelHidden
          value={contactInfo.note}
          onChange={(value) => handleInputChange('note', value)}
          placeholder="Available for freelance work · Based in Lisbon"
          maxLength={200}
        />
      </Section>
    </div>
  );
}
