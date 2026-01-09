// Farcaster SDKのスタブ（パッケージがインストールされていない場合の代替）
module.exports = {
  default: null,
  context: Promise.resolve(null),
  actions: {
    ready: () => Promise.resolve(),
    openUrl: () => Promise.resolve(),
    close: () => Promise.resolve(),
  },
};

