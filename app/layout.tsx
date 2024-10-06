import "@mantine/core/styles.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";

import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <MantineProvider>{children}</MantineProvider>
        {/* {children} */}
      </body>
    </html>
  );
}
