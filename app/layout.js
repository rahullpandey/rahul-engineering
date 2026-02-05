import "./globals.css";
import ParallaxBackground from "./components/ParallaxBackground";

export const metadata = {
  title: "Rahul Engineering",
  description: "Labour supply partner for 5-star hotels. Manage teams and projects in one place."
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
