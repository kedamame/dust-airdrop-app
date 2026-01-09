# 🌐 メインネットデプロイガイド

## 重要な注意事項

⚠️ **テストネットとメインネットでは、異なるコントラクトアドレスが必要です。**

### 理由

1. **別々のブロックチェーンネットワーク**
   - Base Sepolia（テストネット）: チェーンID 84532
   - Base Mainnet（メインネット）: チェーンID 8453
   - これらは完全に別々のネットワークです

2. **コントラクトアドレスの生成**
   - コントラクトをデプロイすると、デプロイ先のネットワークに応じて異なるアドレスが生成されます
   - 同じコントラクトコードでも、異なるネットワークにデプロイすると異なるアドレスになります

3. **データの分離**
   - テストネットでミントしたNFTは、メインネットでは存在しません
   - メインネットでミントしたNFTは、テストネットでは存在しません

## メインネットへのデプロイ手順

### 1. 前提条件

- メインネット用のETHが必要です（ガス代として）
- プライベートキーが安全に管理されていることを確認
- テストネットで十分にテスト済みであることを確認

### 2. デプロイ方法の選択

**方法1: デプロイスクリプトを使用（推奨）**

**方法2: 手動でデプロイ**

### 3. Foundryを使用する場合

#### 3.1 環境変数の設定

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

#### 3.2 デプロイスクリプトの実行

**Windows (PowerShell):**
```powershell
.\scripts\deploy-mainnet.ps1
```

**Mac/Linux:**
```bash
bash scripts/deploy-mainnet.sh
```

#### 3.3 手動でデプロイする場合

```bash
forge create contracts/TrashNFT.sol:TrashNFT \
  --rpc-url https://mainnet.base.org \
  --private-key $PRIVATE_KEY \
  --constructor-args "" \
  --chain base \
  --verify
```

#### 3.4 デプロイ結果の確認

デプロイが成功すると、以下のような出力が表示されます：

```
Deployed to: 0xYourMainnetContractAddress
Transaction hash: 0x...
```

### 4. Hardhatを使用する場合

#### 4.1 環境変数の設定

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

#### 4.2 デプロイスクリプトの実行

**Windows (PowerShell):**
```powershell
.\scripts\deploy-mainnet-hardhat.ps1
```

**Windows (コマンドプロンプト):**
```cmd
scripts\deploy-mainnet-hardhat.bat
```

#### 4.3 手動でデプロイする場合

```bash
npx hardhat run scripts/deploy-hardhat.js --network base
```

#### 4.4 デプロイ結果の確認

スクリプトの出力からコントラクトアドレスを確認してください。

### 4. 環境変数の設定

デプロイが成功したら、`.env.local`ファイルを更新：

```env
# テストネット用
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

### エラー: "コントラクトアドレスが無効です"

- `.env.local`の`NEXT_PUBLIC_TRASH_NFT_ADDRESS_MAINNET`が正しく設定されているか確認
- コントラクトアドレスが42文字（0x + 40文字の16進数）であることを確認

### エラー: "ネットワークが正しくありません"

- ウォレットがBase Mainnet（チェーンID: 8453）に接続されているか確認
- ネットワーク切り替えボタンで「メインネット」が選択されているか確認

### トランザクションが失敗する

- メインネット用のETHが十分にあるか確認（ガス代として）
- コントラクトが正しくデプロイされているか、エクスプローラーで確認
- コントラクトアドレスがメインネットのものか確認

## セキュリティチェックリスト

メインネットにデプロイする前に、以下を確認してください：

- [ ] テストネットで十分にテスト済み
- [ ] コントラクトコードをレビュー済み
- [ ] プライベートキーが安全に管理されている
- [ ] デプロイ用のウォレットに十分なETHがある
- [ ] デプロイ後にコントラクトアドレスを正しく設定する

## 参考リンク

- [Base Mainnet Explorer](https://basescan.org)
- [Base Documentation](https://docs.base.org)
- [Foundry Documentation](https://book.getfoundry.sh)

