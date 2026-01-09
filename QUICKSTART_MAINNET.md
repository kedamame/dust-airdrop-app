# ⚡ メインネット クイックスタート

## 最短でメインネットにデプロイする方法

### ⚠️ 重要な注意事項

- **メインネットは本番環境です。実際のETHが必要です**
- **テストネットで十分にテストしてからデプロイしてください**
- **プライベートキーは絶対に他人に共有しないでください**

### 1. 環境変数の設定

**Windows (PowerShell):**
```powershell
$env:PRIVATE_KEY = "your_private_key_here"
```

**Windows (コマンドプロンプト):**
```cmd
set PRIVATE_KEY=your_private_key_here
```

**Mac/Linux:**
```bash
export PRIVATE_KEY=your_private_key_here
```

### 2. メインネット用ETHの準備

メインネットにデプロイするには、Base Mainnet用のETHが必要です（ガス代として）。

### 3. デプロイ方法の選択

#### 方法A: Hardhatを使用（推奨）

**Windows (PowerShell):**
```powershell
.\scripts\deploy-mainnet-hardhat.ps1
```

**Windows (コマンドプロンプト):**
```cmd
scripts\deploy-mainnet-hardhat.bat
```

**Mac/Linux:**
```bash
npx hardhat run scripts/deploy-hardhat.js --network base
```

#### 方法B: Foundryを使用

**Windows (PowerShell):**
```powershell
.\scripts\deploy-mainnet.ps1
```

**Mac/Linux:**
```bash
bash scripts/deploy-mainnet.sh
```

### 4. コントラクトアドレスの設定

デプロイが成功したら、表示されたコントラクトアドレスを `.env.local` に設定：

```env
# テストネット用（既存）
NEXT_PUBLIC_TRASH_NFT_ADDRESS_TESTNET=0xYourTestnetContractAddress

# メインネット用（新しくデプロイしたアドレス）
NEXT_PUBLIC_TRASH_NFT_ADDRESS_MAINNET=0xYourMainnetContractAddress
```

### 5. 動作確認

1. アプリケーションを起動：
```bash
npm run dev
```

2. UI上の「メインネット」ボタンをクリック

3. ウォレットを接続（Base Mainnetに自動的に切り替わります）

4. テスト用のNFTを送信して動作確認

## トラブルシューティング

### エラー: "PRIVATE_KEY環境変数が設定されていません"

- 環境変数が正しく設定されているか確認
- 新しいターミナルウィンドウを開いて再度試す

### エラー: "残高が0です"

- Base Mainnet用のETHがウォレットにあるか確認
- ガス代として十分なETHが必要です

### デプロイが失敗する

- ネットワーク接続を確認
- プライベートキーが正しいか確認
- 十分なETHがあるか確認

## 次のステップ

デプロイが完了したら：
1. コントラクトアドレスを`.env.local`に設定
2. アプリケーションを再起動
3. メインネットモードで動作確認

詳細は`MAINNET_DEPLOY.md`を参照してください。

