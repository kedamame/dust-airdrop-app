/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 本番環境でのエラーオーバーレイを無効化（開発環境では表示される）
  onDemandEntries: {
    // 開発環境でのみエラーオーバーレイを表示
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;







