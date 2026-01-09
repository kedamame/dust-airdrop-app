# 🚀 Hardhatを使用したテストネットデプロイガイド

## 準備完了 ✅

- Hardhatがインストール済み
- コントラクトのコンパイル成功
- デプロイスクリプト準備完了

## デプロイ手順

### 1. `.env.local`ファイルの作成

プロジェクトルートに`.env.local`ファイルを作成し、以下を記入：

```env
# テストネットモードを有効化
NEXT_PUBLIC_USE_TESTNET=true

# コントラクトアドレス（デプロイ後に設定）
NEXT_PUBLIC_TRASH_NFT_ADDRESS=0x0000000000000000000000000000000000000000
```

### 2. プライベートキーの設定

**⚠️ 重要: プライベートキーは絶対に他人に共有しないでください！**

#### cmd（コマンドプロンプト）の場合：

```cmd
set PRIVATE_KEY=your_private_key_here
```

#### PowerShellの場合：

```powershell
$env:PRIVATE_KEY = "your_private_key_here"
```

### 3. Base Sepoliaにデプロイ

#### 方法1: デプロイスクリプトを使用（推奨）

**cmd（コマンドプロンプト）の場合：**

```cmd
scripts\deploy-testnet-hardhat.bat
```

**PowerShellの場合：**

```powershell
.\scripts\deploy-testnet-hardhat.ps1
```

#### 方法2: 手動でデプロイ

```cmd
npx hardhat run scripts/deploy-hardhat.js --network baseSepolia
```

### 4. コントラクトアドレスの設定

デプロイが成功すると、コントラクトアドレスが表示されます。`.env.local`ファイルを更新：

```env
NEXT_PUBLIC_USE_TESTNET=true
NEXT_PUBLIC_TRASH_NFT_ADDRESS=0xYourDeployedContractAddress
```

### 5. テストネット用ETHの取得

Base Sepoliaでテストするには、テストネット用のETHが必要です：

1. **Base Sepolia Faucet**にアクセス：
   - https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
   - または https://faucet.quicknode.com/base/sepolia

2. ウォレットアドレスを入力してETHを取得

### 6. MetaMaskにBase Sepoliaネットワークを追加

- **ネットワーク名**: Base Sepolia
- **RPC URL**: https://sepolia.base.org
- **チェーンID**: 84532
- **通貨記号**: ETH
- **ブロックエクスプローラー**: https://sepolia.basescan.org

### 7. アプリケーションの起動

```powershell
npm run dev
```

### 8. テスト

1. ブラウザで `http://localhost:3000` にアクセス
2. MetaMaskを接続
3. Base Sepoliaネットワークに切り替え
4. ゴミを選択して送信をテスト！

## トラブルシューティング

### コントラクトが見つからないエラー

- `.env.local`の`NEXT_PUBLIC_TRASH_NFT_ADDRESS`が正しく設定されているか確認
- アプリを再起動

### ネットワークエラー

- ウォレットがBase Sepoliaネットワークに接続されているか確認
- MetaMaskでネットワークを手動で切り替え

### ガス代不足エラー

- テストネット用のETHがウォレットにあるか確認
- Faucetから取得してください

### デプロイエラー

- プライベートキーが正しく設定されているか確認
- テストネット用ETHが十分にあるか確認（デプロイにもガス代が必要）

## メインネットへの切り替え

テストが完了したら、メインネットに切り替えるには：

1. `.env.local`を更新：
```env
NEXT_PUBLIC_USE_TESTNET=false
NEXT_PUBLIC_TRASH_NFT_ADDRESS=0xYourMainnetContractAddress
```

2. メインネットにデプロイ：
```powershell
npx hardhat run scripts/deploy-hardhat.js --network base
```

3. アプリケーションを再起動

