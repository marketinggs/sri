import localFont from "next/font/local";
import "./globals.css";

const ibmPlexSans = localFont({
  src: [
    {
      path: "../node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

export const metadata = {
  title: "Hello World App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${ibmPlexSans.variable} min-h-screen`}>{children}</body>
    </html>
  );
}
