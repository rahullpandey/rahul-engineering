import "./globals.css";

export const metadata = {
  title: "Rahul Engineering",
  description: "Labour supply partner for 5-star hotels. Manage teams and projects in one place."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
