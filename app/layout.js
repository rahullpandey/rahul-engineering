import "./globals.css";
import ParallaxBackground from "./components/ParallaxBackground";

const description =
  "Trusted manpower partner for premium hospitality. We support 5-star hotels with trained teams, project coverage, and on-time staffing.";

export const metadata = {
  title: "Rahul Engineering",
  description,
  metadataBase: new URL("https://www.rahulengineerings.com"),
  openGraph: {
    title: "Rahul Engineering",
    description,
    url: "https://www.rahulengineerings.com",
    siteName: "Rahul Engineering",
    type: "website",
    images: [
      {
        url: "https://www.rahulengineerings.com/og.jpg?v=6",
        width: 1200,
        height: 630,
        alt: "Rahul Engineering"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Rahul Engineering",
    description,
    images: ["https://www.rahulengineerings.com/og.jpg?v=6"]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ParallaxBackground />
        {children}
      </body>
    </html>
  );
}
