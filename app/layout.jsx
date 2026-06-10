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
        {/* Fallback web font (Newsreader) while you license + host PP Editorial New.
            Once your woff2 files are in /public/fonts the real font takes over. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,700;1,400;1,700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
