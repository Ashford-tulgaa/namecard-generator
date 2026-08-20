# Digital Name Card Generator

A modern, responsive web application built with Next.js that allows users to create professional digital business cards with QR codes. When scanned by smartphones, the QR codes automatically prompt users to save the contact information to their device's contact app.

## ✨ Features

- **📱 Smartphone Auto-Save**: QR codes generate vCard data that can be instantly saved to phone contacts
- **🎨 Professional Design**: Clean, modern business card layout with responsive design
- **⚡ Real-time Preview**: See your card design update as you type
- **📄 Multiple Export Options**: Download vCard (.vcf) files or QR code images
- **📤 Easy Sharing**: Share QR codes via native device sharing (Web Share API)
- **🌱 Eco-Friendly**: Digital cards reduce paper waste and can be easily updated
- **💼 Professional Fields**: Support for all standard business contact fields
- **🔄 Live QR Generation**: QR codes update automatically as you edit information

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed on your system
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone or download this repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **QR Generation**: qrcode library
- **Icons**: Lucide React
- **Deployment Ready**: Optimized for Vercel, Netlify, or any platform

## 📱 How It Works

### For Users Creating Cards:
1. Fill in your contact information in the form
2. Watch the real-time preview update on the right
3. Download the vCard file or QR code image
4. Share your digital business card

### For Recipients:
1. Open your phone's camera app
2. Point it at the QR code
3. Tap the notification that appears
4. Your phone will prompt to save the contact information
5. Add to contacts with one tap!

## 📋 Supported Contact Fields

- **Personal**: First Name, Last Name
- **Professional**: Organization, Job Title
- **Contact**: Phone Number, Email Address
- **Online**: Website URL
- **Location**: Full Address (Street, City, State, ZIP, Country)
- **Additional**: Notes/Description

## 🌐 Browser Compatibility

- **iOS Safari**: Native camera QR scanning + contact saving
- **Android Chrome**: Native camera QR scanning + contact saving
- **Desktop Browsers**: Full functionality for creating and downloading cards
- **Web Share API**: Modern browsers support native sharing

## 📱 Mobile Optimization

The application is fully responsive and optimized for:
- Creating cards on desktop/laptop
- Viewing and scanning QR codes on mobile devices
- Touch-friendly interface for mobile editing

## 🔧 Development

### Project Structure

```
src/
├── app/
│   └── page.tsx           # Main application page
├── components/
│   ├── ContactForm.tsx    # Contact information form
│   ├── NameCardPreview.tsx # Business card preview
│   └── ActionButtons.tsx  # Download/share buttons
└── lib/
    ├── vcard.ts          # vCard generation utilities
    └── qrcode.ts         # QR code generation utilities
```

### Key Functions

- **vCard Generation**: Creates RFC-compliant vCard data for contact information
- **QR Code Generation**: Converts vCard data into scannable QR codes
- **Auto-Save Compatibility**: Ensures QR codes work with iOS and Android contact apps

### Building for Production

```bash
npm run build
npm start
```

## 🚀 Deployment

This app is ready to deploy to:

- **Vercel**: `vercel --prod`
- **Netlify**: Connect repository and deploy
- **Any Static Host**: Use `npm run build` and deploy the `out` folder

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on both desktop and mobile devices
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check that you're using a modern browser
2. Ensure JavaScript is enabled
3. Test QR code scanning with a real mobile device
4. Clear your browser cache if experiencing issues

---

**Built with Next.js** • Generate professional digital business cards with smartphone-compatible QR codes
