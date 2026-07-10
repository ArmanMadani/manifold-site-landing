import "./globals.css";

export const metadata = {
  title: "Manifold Labs",
  description:
    "An AI research lab dedicated to exploring human-AI interaction — making agents accessible, safe, and effective.",
  metadataBase: new URL("https://manifoldlabs.example"),
  openGraph: {
    title: "Manifold Labs",
    description:
      "An AI research lab dedicated to exploring human-AI interaction.",
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
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=gambarino@400&f[]=switzer@300,400,500,600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
