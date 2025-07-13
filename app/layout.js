// app/layout.js
import '../styles/globals.css';

export const metadata = {
  title: 'My App',
  description: 'A test app with Tailwind',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
