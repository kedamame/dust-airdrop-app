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
  webpack: (config, { isServer }) => {
    // @farcaster/frame-sdkが存在しない場合でもエラーを発生させない
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@farcaster/frame-sdk': false,
    };
    
    // オプショナルなパッケージを外部として扱う
    if (!isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        '@farcaster/frame-sdk': 'commonjs @farcaster/frame-sdk',
      });
    }
    
    return config;
  },
};

module.exports = nextConfig;







