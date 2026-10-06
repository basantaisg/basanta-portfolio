import './globals.css';
import { business } from '../content.mjs';
import { origin, indexable } from '../site-config.mjs';

export const metadata = {
  title: business.title,
  description: business.description,
  ...(origin ? { metadataBase: new URL(origin), alternates: { canonical: '/' } } : {}),
  robots: { index: indexable, follow: indexable },
  icons: { icon: '/assets/favicon.svg' },
  openGraph: {
    type: 'website', title: business.title, description: business.description,
    siteName: business.name,
    ...(origin ? { url: '/', images: [{ url: '/assets/social-card.png', width: 1200, height: 630, alt: business.title }] } : {}),
  },
  twitter: { card: 'summary_large_image', title: business.title, description: business.description,
    ...(origin ? { images: ['/assets/social-card.png'] } : {}) },
};
export const viewport = { themeColor: '#0d0e10' };

export default function RootLayout({ children }) {
  const person = {
    '@context': 'https://schema.org', '@type': 'Person', name: business.name,
    description: business.description,
    email: business.email, sameAs: business.socials.map(([, url]) => url),
    ...(origin ? { url: origin } : {}),
  };
  return <html lang="en"><body>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, '\\u003c') }} />
    {children}
  </body></html>;
}
