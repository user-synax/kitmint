import { DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/shared/Providers";
import Footer from "@/components/layout/Footer";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "KitMint",
  description: "Turn an idea into a brand in 60 seconds",
  verification: {
    google: "K-xkYw1Y1PqYEcOS3grjVfobh5EH_UFVzU8jESjBzKg",
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon-32x32.png' },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">
        <Providers>
          {children}
          <Footer />
          <Toaster position="bottom-right" theme="dark" />
        </Providers>
      </body>
    </html>
  );
}
