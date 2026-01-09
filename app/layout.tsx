import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: '🗑️ ゴミNFT投げつけマシーン | Trash NFT Thrower',
  description: 'あなたの大切な(?)ゴミNFTを誰かに投げつけよう！シュールでカオスなNFT体験をお届けします。',
  openGraph: {
    title: '🗑️ ゴミNFT投げつけマシーン',
    description: 'ゴミを投げつけろ！',
    images: ['/og-image.png'],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': '/og-image.png',
    'fc:frame:button:1': '🗑️ ゴミを投げる',
    'fc:frame:post_url': '/api/frame',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        {/* 通販番組風フォント */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700;900&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

