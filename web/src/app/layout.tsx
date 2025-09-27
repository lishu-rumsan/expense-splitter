import { Providers } from "@/providers/providers";
import { Wagmi } from "@/providers/wagmi-provider";
import "./globals.css";
// import { Geist, Geist_Mono } from "next/font/google";

// const fontSans = Geist({
//   subsets: ["latin"],
//   variable: "--font-sans",
// });

// const fontMono = Geist_Mono({
//   subsets: ["latin"],
//   variable: "--font-mono",
// });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Wagmi>
          <Providers>{children}</Providers>
        </Wagmi>
      </body>
    </html>
  );
}
