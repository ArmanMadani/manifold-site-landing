import localFont from "next/font/local";
import "./globals.css";
import SiteHeader from "./components/SiteHeader";
import LeaveGate from "./components/LeaveGate";

const editorial = localFont({
  src: [
    { path: "../public/fonts/PPEditorialNew-Regular.woff", weight: "400", style: "normal" },
    { path: "../public/fonts/PPEditorialNew-Italic.woff", weight: "400", style: "italic" },
    { path: "../public/fonts/PPEditorialNew-Ultrabold.woff", weight: "800", style: "normal" },
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
        <LeaveGate />
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
