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
    config.resolve.alias = {
      ...config.resolve.alias,
      '@farcaster/frame-sdk': false,
    };
    
    // オプショナルなパッケージを外部として扱う
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@farcaster/frame-sdk': false,
    };
    
    // IgnorePluginを使用して@farcaster/frame-sdkを無視
    const webpack = require('webpack');
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^@farcaster\/frame-sdk$/,
        contextRegExp: /./, // すべてのコンテキストで無視
      })
    );
    
    // NormalModuleReplacementPluginを使用して空のモジュールに置き換え
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /^@farcaster\/frame-sdk$/,
        require.resolve('./lib/farcaster-stub.js')
      )
    );
    
    return config;
  },
};

module.exports = nextConfig;







