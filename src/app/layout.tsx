import SessionWrapper from "@/provider/SessionWrapper";
import GlobalLayout from "../components/GlobalLayout";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper>
          <GlobalLayout>{children}</GlobalLayout>
        </SessionWrapper>
      </body>
    </html>
  );
}
