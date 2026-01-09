# 🚀 本番環境デプロイガイド

## 現在の実装状況

✅ **実装済み:**
- スマートコントラクト（TrashNFT.sol） - 画像付きNFTを生成可能
- フロントエンド統合 - NFT送信機能を実装
- オンチェーンSVG生成 - 完全にオンチェーンで動作

⚠️ **本番環境で必要な作業:**

## 1. スマートコントラクトのデプロイ

### Foundryを使用する場合

```bash
# Foundryのインストール（未インストールの場合）
curl -L https://foundry.paradigm.xyz | bash
foundryup

# プロジェクトのセットアップ
forge init --force
forge install OpenZeppelin/openzeppelin-contracts

# コントラクトのコンパイル
forge build

# Base Sepolia（テストネット）にデプロイ
forge create contracts/TrashNFT.sol:TrashNFT \
  --rpc-url https://sepolia.base.org \
  --private-key $PRIVATE_KEY \
  --constructor-args ""

# Base Mainnetにデプロイ（本番）
forge create contracts/TrashNFT.sol:TrashNFT \
  --rpc-url https://mainnet.base.org \
  --private-key $PRIVATE_KEY \
  --constructor-args ""
```

### Hardhatを使用する場合

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# hardhat.config.jsを作成
npx hardhat init

# デプロイスクリプトを作成後
npx hardhat run scripts/deploy.js --network base
```

## 2. 環境変数の設定

`.env.local` ファイルを作成:

```env
# コントラクトアドレス（デプロイ後に取得）
NEXT_PUBLIC_TRASH_NFT_ADDRESS=0xYourDeployedContractAddress

# Base RPC URL
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org

# アプリケーションURL
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# Neynar API（Farcasterユーザー名解決用）
NEYNAR_API_KEY=your-neynar-api-key
```

## 3. Farcasterユーザー名解決の実装

`app/api/resolve/route.ts` を更新して、Neynar APIを使用:

```typescript
// Neynar APIを使用した実装例
const response = await fetch(
  `https://api.neynar.com/v2/farcaster/user/by_username?username=${username}`,
  {
    headers: {
      'api_key': process.env.NEYNAR_API_KEY!,
    },
  }
);
```

## 4. ウォレット接続の確認

本番環境では、ユーザーがウォレットを接続している必要があります。

- MetaMask
- Coinbase Wallet
- WalletConnect対応ウォレット

## 5. ガス代について

- NFTのミントにはガス代がかかります
- ユーザーがウォレットでトランザクションを承認する必要があります
- BaseはEthereumより安いですが、無料ではありません

## 6. NFTの画像について

✅ **完全オンチェーン:**
- SVG画像はスマートコントラクト内で生成されます
- メタデータもBase64エンコードされてオンチェーンに保存されます
- IPFSや外部サーバーは不要です

## 7. デプロイチェックリスト

- [ ] スマートコントラクトをBaseにデプロイ
- [ ] コントラクトアドレスを環境変数に設定
- [ ] Neynar APIキーを取得・設定
- [ ] ウォレット接続が動作することを確認
- [ ] テスト送信でNFTが正しくミントされることを確認
- [ ] OpenSeaやBasescanでNFTが表示されることを確認

## 8. テスト方法

1. Base Sepoliaテストネットでテスト
2. テストウォレットでNFTを送信
3. Basescanでトランザクションを確認
4. NFTの画像とメタデータが正しく表示されることを確認

## 注意事項

⚠️ **重要な注意点:**
- コントラクトアドレスが `0x0000...` のままでは動作しません
- 必ずデプロイ後にアドレスを設定してください
- テストネットで十分にテストしてからメインネットにデプロイしてください






