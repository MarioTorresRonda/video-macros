import Providers from "@/components/Providers";
import "./globals.css";

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

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
