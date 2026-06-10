import "./globals.css";

export const metadata = {
  title: "Manifold Labs",
  description:
    "Safe, secure, and personalized consumer financial products that work for everyone. Launching soon.",
  metadataBase: new URL("https://manifoldlabs.example"),
  openGraph: {
    title: "Manifold Labs",
    description:
      "Safe, secure, and personalized consumer financial products that work for everyone.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Single typeface: Clash Grotesk via Fontshare (weights 300/400/500/600). */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-grotesk@300,400,500,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
