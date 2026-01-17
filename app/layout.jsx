import "./globals.css";

export const metadata = {
  title: "Car Quote Comparison Engine",
  description: "Compare car insurance quotes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
