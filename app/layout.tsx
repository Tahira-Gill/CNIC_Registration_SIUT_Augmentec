import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CNIC Registration Technology Assessment | SIUT × Augmentec',
  description:
    'Joint SIUT and Augmentec assessment of the CNIC-based patient registration system, using the RE-AIM and Proctor implementation science frameworks.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
