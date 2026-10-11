import localFont from "next/font/local";
import "./globals.css";
import SiteHeader from "./components/SiteHeader";

const editorial = localFont({
  src: [
    { path: "../public/fonts/PPEditorialNew-Regular.woff", weight: "400", style: "normal" },
    { path: "../public/fonts/PPEditorialNew-Italic.woff", weight: "400", style: "italic" },
  ],
  variable: "--font-editorial",
  display: "swap",
  fallback: ["Times New Roman", "serif"],
});

const description =
  "Applied AI for ambitious financial services companies. We deploy AI and frontier technologies safely across the financial services industry.";

export const metadata = {
  title: "Manifold",
  description,
  metadataBase: new URL("https://manifoldlabs.app"),
  openGraph: {
    title: "Manifold",
    description,
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#d9d9d9",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={editorial.variable}>
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
