import Providers from "@/components/Providers";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="m-4 bg-stone-700 h-screen">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
