import { Nunito } from 'next/font/google';
import '@/styles/globals.css';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-nunito',
  display: 'swap',
});

export const metadata = {
  title: {
    default: 'Draw & Guess — Real-time Multiplayer Drawing Game',
    template: '%s | Draw & Guess',
  },
  description: 'A fun, interactive real-time drawing and guessing game to play with friends. Join a room, draw your word, and let others guess!',
  keywords: ['draw and guess', 'online drawing game', 'multiplayer game', 'pictionary online', 'skribbl io alternative', 'party game'],
  authors: [{ name: 'Draw & Guess Team' }],
  creator: 'Draw & Guess Team',
  publisher: 'Draw & Guess Team',
  metadataBase: new URL('https://draw-and-guess-production-92b7.up.railway.app'), // Replace with your actual domain when deploying
  openGraph: {
    title: 'Draw & Guess — Multiplayer Drawing Fun',
    description: 'Sketch, guess, and laugh with your friends in this real-time drawing game.',
    url: 'https://draw-and-guess.com', // Replace with your domain
    siteName: 'Draw & Guess',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Draw & Guess Game Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Draw & Guess — Multiplayer Drawing Fun',
    description: 'Sketch, guess, and laugh with your friends in this real-time drawing game.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
};

const RootLayout = ({ children }) => (
  <html lang="en" className={nunito.variable}>
    <body className="font-fun">
      {children}
    </body>
  </html>
);

export default RootLayout;
