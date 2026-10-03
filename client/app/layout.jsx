import "./globals.css";
import { AuthProvider } from "../context/AuthContext";

export const metadata = {
  title: "Inventory Management System",
  description: "Internship-level inventory management app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
