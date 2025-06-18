import './global.css';
import Header from '../components/common/Header';

export const metadata = {
  title: 'GoodDay Software Coding Exercise',
  description: 'Thank you for your time!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <div className="container mx-auto">
          <Header />
          <div className="mx-6">{children}</div>
        </div>
      </body>
    </html>
  );
}
