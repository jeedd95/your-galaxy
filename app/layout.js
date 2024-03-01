import "../styles/global.css";
import { Providers } from "./providers";
import Navbar from "../components/Navbar/navbar";

export const metadata = {
  title: "Your Galaxy",
  description: "made by Jeedd",

  icons: {
    icon: "/star.png",
  },
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
