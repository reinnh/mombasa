import type { Metadata, Viewport } from "next";
import "./globals.css";

const BASE_URL = "https://mombasa-beta.vercel.app";
const OG_IMAGE = `${BASE_URL}/images/candidate.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "Ground Volunteer Network | TND Youth League Mombasa Chapter",
    template: "%s | TND Youth League Mombasa",
  },

  description:
    "Official ground volunteer mobilization portal for The New Democrats (TND) Youth League — Mombasa County Chapter. Register as a volunteer across all 6 constituencies, 30 wards, and 229 polling stations in Mombasa County for the 2027 General Election.",

  keywords: [
    "TND Youth League",
    "The New Democrats Kenya",
    "Mombasa volunteer registration",
    "Mombasa County 2027 elections",
    "ground volunteer network",
    "Changamwe Constituency",
    "Jomvu Constituency",
    "Kisauni Constituency",
    "Likoni Constituency",
    "Mvita Constituency",
    "Nyali Constituency",
    "Kenya elections 2027",
    "youth league Kenya",
    "political volunteer Kenya",
    "Mombasa grassroots mobilization",
    "TND Mombasa Chapter",
    "volunteer coordination Kenya",
    "2027 general election Kenya",
  ],

  authors: [{ name: "TND Youth League Mombasa Chapter" }],
  creator: "The New Democrats (TND) Youth League",
  publisher: "TND Youth League Mombasa Chapter",
  category: "Politics",

  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_KE",
    url: BASE_URL,
    siteName: "TND Youth League — Mombasa Ground Network",
    title: "Ground Volunteer Network | TND Youth League Mombasa",
    description:
      "Join the ground mobilization force across Mombasa County's 6 constituencies, 30 wards, and 229 polling stations. Official TND Youth League 2027 campaign volunteer portal.",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "The New Democrats Youth League Mombasa Chapter — Ground Volunteer Network",
        type: "image/jpeg",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Ground Volunteer Network | TND Youth League Mombasa",
    description:
      "Official volunteer registration portal — Mombasa County, 6 Constituencies, 30 Wards, 229 Polling Stations. 2027 Kenya Elections.",
    images: [OG_IMAGE],
    creator: "@TNDKenya",
    site: "@TNDMombasa",
  },

  icons: {
    icon: "/images/tnd-logo.jpg",
    apple: "/images/tnd-logo.jpg",
    shortcut: "/images/tnd-logo.jpg",
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TND Mombasa Volunteers",
  },

  applicationName: "TND Mombasa Ground Network",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "The New Democrats (TND) Youth League — Mombasa Chapter",
  url: BASE_URL,
  logo: `${BASE_URL}/images/tnd-logo.jpg`,
  image: `${BASE_URL}/images/candidate.jpg`,
  description:
    "Official ground volunteer mobilization network for Mombasa County — 2027 Kenya General Elections. 6 constituencies, 30 wards, 229 polling stations.",
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Mombasa County, Kenya",
  },
  memberOf: {
    "@type": "PoliticalParty",
    name: "The New Democrats (TND)",
    location: "Kenya",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "volunteer coordination",
    areaServed: "KE",
    availableLanguage: ["English", "Swahili"],
  },
  event: {
    "@type": "Event",
    name: "2027 Kenya General Election",
    startDate: "2027-08-10",
    location: {
      "@type": "Place",
      name: "Mombasa County, Kenya",
    },
    organizer: {
      "@type": "Organization",
      name: "The New Democrats (TND) Youth League Mombasa Chapter",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#f5f6f8] text-[#111827] antialiased selection:bg-[#0071e3]/15">
        {children}
      </body>
    </html>
  );
}
