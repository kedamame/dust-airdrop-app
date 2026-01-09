# 🗑️ ゴミNFT投げつけマシーン

> あなたの大切な(?)ゴミを誰かに投げつけよう！

Base チェーン上で永遠に刻まれる、シュールでカオスなNFT体験をお届けします。

![Trash NFT Banner](./public/og-image.png)

## ✨ 機能

- 🗑️ **ゴミを選択** - 腐ったバナナから謎の塊まで、様々なゴミから選べます
- 🎯 **相手を指定** - Farcasterユーザー名、ENSドメイン、またはウォレットアドレスで指定
- 💨 **投げつける** - ゴミNFTをミントして即座に送信！
- 🎉 **派手な演出** - 紙吹雪と臭い線エフェクトで盛り上げます

## 🚀 はじめ方

### 前提条件

- Node.js 18以上
- npm または yarn
- Baseチェーン対応ウォレット（MetaMask等）

### インストール

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

### 環境変数

`.env.local` ファイルを作成:

```env
# テストネットモード（true: Base Sepolia, false: Base Mainnet）
NEXT_PUBLIC_USE_TESTNET=true

# コントラクトアドレス（テストネットとメインネットで別々に設定可能）
# テストネット用（優先）
NEXT_PUBLIC_TRASH_NFT_ADDRESS_TESTNET=0x...
# メインネット用（優先）
NEXT_PUBLIC_TRASH_NFT_ADDRESS_MAINNET=0x...
# 共通（後方互換性のため、上記が設定されていない場合に使用）
NEXT_PUBLIC_TRASH_NFT_ADDRESS=0x...

# その他の環境変数
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEYNAR_API_KEY=your-api-key
```

**メインネットで使用する場合:**
```env
NEXT_PUBLIC_USE_TESTNET=false
NEXT_PUBLIC_TRASH_NFT_ADDRESS_MAINNET=0xYourMainnetContractAddress
```

## 🏗️ プロジェクト構成

```
DustAirdropApp/
├── app/                    # Next.js App Router
│   ├── api/               # APIルート
│   │   ├── frame/         # Farcaster Frame API
│   │   ├── resolve/       # ユーザー名解決API
│   │   └── webhook/       # Webhookエンドポイント
│   ├── globals.css        # グローバルスタイル
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # メインページ
│   └── providers.tsx      # Reactプロバイダー
├── components/            # UIコンポーネント
│   ├── RecipientInput.tsx # 送り先入力
│   ├── StinkLines.tsx     # 臭い線エフェクト
│   ├── SuccessModal.tsx   # 成功モーダル
│   ├── ThrowButton.tsx    # 投げるボタン
│   ├── TrashRain.tsx      # 背景アニメーション
│   └── TrashSelector.tsx  # ゴミ選択
├── contracts/             # Solidityコントラクト
│   └── TrashNFT.sol       # ゴミNFTコントラクト
├── hooks/                 # Reactフック
│   ├── useFarcasterSDK.ts # Farcaster SDK
│   └── useTrashNFT.ts     # NFT操作
├── lib/                   # ユーティリティ
│   └── constants.ts       # 定数
├── public/                # 静的ファイル
│   └── .well-known/       # Farcasterマニフェスト
└── package.json
```

## 📜 スマートコントラクト

### TrashNFT.sol

ERC-721準拠のNFTコントラクト。完全オンチェーンでメタデータとSVG画像を生成します。

#### 主な機能

- `throwTrash(address to, string name, string emoji, string description, uint8 stinkLevel)` - ゴミをミント＆送信
- `tokenURI(uint256 tokenId)` - オンチェーンでSVGとJSONメタデータを生成

### デプロイ方法

#### テストネット（Base Sepolia）にデプロイ

```bash
# Foundryを使用する場合
forge create --rpc-url https://sepolia.base.org \
  --private-key $PRIVATE_KEY \
  --chain base-sepolia \
  contracts/TrashNFT.sol:TrashNFT
```

#### メインネット（Base Mainnet）にデプロイ

```bash
# Foundryを使用する場合
forge create --rpc-url https://mainnet.base.org \
  --private-key $PRIVATE_KEY \
  --chain base \
  contracts/TrashNFT.sol:TrashNFT
```

**⚠️ 重要な注意事項:**
- **テストネットとメインネットでは異なるコントラクトアドレスが必要です**
- メインネットにデプロイすると、新しいコントラクトアドレスが生成されます
- デプロイ後、`.env.local`の`NEXT_PUBLIC_TRASH_NFT_ADDRESS_MAINNET`に設定してください

**📝 デプロイ方法:**

**方法1: デプロイスクリプトを使用（推奨）**

**Windows (PowerShell):**
```powershell
# Hardhatを使用
$env:PRIVATE_KEY = "your_private_key_here"
.\scripts\deploy-mainnet-hardhat.ps1

# Foundryを使用
.\scripts\deploy-mainnet.ps1
```

**Mac/Linux:**
```bash
# Hardhatを使用
export PRIVATE_KEY=your_private_key_here
npx hardhat run scripts/deploy-hardhat.js --network base

# Foundryを使用
bash scripts/deploy-mainnet.sh
```

**方法2: 手動でデプロイ**

詳細は`MAINNET_DEPLOY.md`または`QUICKSTART_MAINNET.md`を参照してください。

**⚠️ セキュリティ:** メインネットにデプロイする場合は、十分にテストを行い、本番環境での使用を確認してください。

## 🎨 カスタマイズ

### ゴミの種類を追加

`app/page.tsx` の `TRASH_TYPES` 配列に新しいゴミを追加:

```typescript
{
  id: 'custom',
  name: 'カスタムゴミ',
  emoji: '🗑️',
  description: 'あなただけのゴミ',
  rarity: 'legendary',
  stinkLevel: 7,
}
```

### スタイルのカスタマイズ

`tailwind.config.js` でカスタムカラーやアニメーションを編集できます。

## 🔗 Farcaster Mini App

このアプリはFarcaster Mini App（Frames v2）として動作します。

### マニフェストの設定

`public/.well-known/farcaster.json` を編集してドメインとアカウントを設定してください。

### テスト方法

1. [Warpcast Frame Validator](https://warpcast.com/~/developers/frames) を使用
2. ローカル開発では ngrok などでHTTPSトンネルを作成

## ⚠️ 注意事項

- このアプリは完全にジョークです
- ゴミNFTには実際の価値はありません
- ただし、ブロックチェーン上に永遠に刻まれます
- 責任を持ってゴミを投げてください

## 🛠️ 技術スタック

- **フロントエンド**: Next.js 14, React 18, TypeScript
- **スタイリング**: Tailwind CSS, Framer Motion
- **Web3**: wagmi, viem
- **ブロックチェーン**: Base (Ethereum L2)
- **NFT**: ERC-721, オンチェーンSVG

## 📄 ライセンス

MIT License - 自由にゴミを投げてください！

---

Made with 🗑️ and ❤️







