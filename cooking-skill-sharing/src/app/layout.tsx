import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import { AuthProvider } from "@/components/Auth/AuthContext";
import ClientSplashScreen from "@/components/ClientSplashScreen"; // Import the client wrapper
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CookShare - Share Your Culinary Journey",
  description: "A platform for sharing cooking skills and recipes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${robotoMono.variable} antialiased`}>
        <AuthProvider>
          <ClientSplashScreen /> {/* Use the client wrapper */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
