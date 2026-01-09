// アプリケーション定数

// チェーンID
export const BASE_CHAIN_ID = 8453;
export const BASE_SEPOLIA_CHAIN_ID = 84532;

// コントラクトアドレス
// TODO: デプロイ後に更新
export const CONTRACTS = {
  mainnet: {
    trashNFT: '0x0000000000000000000000000000000000000000' as const,
  },
  sepolia: {
    trashNFT: '0x0000000000000000000000000000000000000000' as const,
  },
} as const;

// ゴミのレアリティ確率
export const RARITY_WEIGHTS = {
  common: 50,
  rare: 30,
  legendary: 15,
  mythical: 5,
} as const;

// 臭さレベルの説明
export const STINK_DESCRIPTIONS = [
  'ほぼ無臭',
  'かすかに香る',
  'ちょっと臭う',
  '鼻が曲がる',
  '涙が出る',
  '意識が遠のく',
  '近づけない',
  '危険区域',
  '生命の危機',
  '存在が罪',
  '宇宙の終わり',
] as const;

// メッセージ
export const THROW_MESSAGES = [
  'ゴミ配達完了！💨',
  '臭いプレゼントを送りました！',
  '相手はきっと喜ぶ(?)でしょう！',
  'あなたの愛(ゴミ)が届きました！',
  'ゴミ箱から愛を込めて！',
  'これが友情の証！',
  '忘れられない思い出をお届け！',
  '永遠にオンチェーン！消せません！',
] as const;

// ソーシャルリンク
export const SOCIAL_LINKS = {
  farcaster: 'https://warpcast.com/~/channel/trash-nft',
  github: 'https://github.com/your-repo/trash-nft',
  basescan: 'https://basescan.org/address/',
} as const;







