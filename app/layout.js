import { Nunito } from 'next/font/google';
import '@/styles/globals.css';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-nunito',
  display: 'swap',
});

export const metadata = {
  title: 'Draw & Guess — Multiplayer Drawing Game',
  description: 'A fun realtime drawing and guessing game for friends!',
};

const RootLayout = ({ children }) => (
  <html lang="en" className={nunito.variable}>
    <body className="font-fun">
      {children}
    </body>
  </html>
);

export default RootLayout;
