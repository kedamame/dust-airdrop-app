# ⚡ テストネット クイックスタート

## 最短でテストネットで試す方法

### 1. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成：

```env
NEXT_PUBLIC_USE_TESTNET=true
NEXT_PUBLIC_TRASH_NFT_ADDRESS=0x0000000000000000000000000000000000000000
```

### 2. スマートコントラクトのデプロイ（Foundry使用）

#### 2.1 Foundryのインストール（初回のみ）

```bash
# Windows (PowerShell)
irm https://foundry.paradigm.xyz | iex

# Mac/Linux
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

#### 2.2 OpenZeppelinのインストール

```bash
forge install OpenZeppelin/openzeppelin-contracts
```

#### 2.3 デプロイ

**Windows (PowerShell):**
```powershell
$env:PRIVATE_KEY = "your_private_key_here"
.\scripts\deploy-testnet.ps1
```

**Mac/Linux:**
```bash
export PRIVATE_KEY=your_private_key_here
bash scripts/deploy-testnet.sh
```

または手動で：
```bash
forge create contracts/TrashNFT.sol:TrashNFT \
  --rpc-url https://sepolia.base.org \
  --private-key $PRIVATE_KEY \
  --constructor-args "" \
  --chain base-sepolia
```

#### 2.4 コントラクトアドレスを設定

デプロイが成功したら、表示されたコントラクトアドレスを `.env.local` に設定：

```env
NEXT_PUBLIC_TRASH_NFT_ADDRESS=0xYourDeployedContractAddress
```

### 3. テストネット用ETHの取得

1. Base Sepolia Faucetにアクセス：
   - https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
   - または https://faucet.quicknode.com/base/sepolia

2. ウォレットアドレスを入力してETHを取得

3. MetaMaskにBase Sepoliaネットワークを追加：
   - ネットワーク名: Base Sepolia
   - RPC URL: https://sepolia.base.org
   - チェーンID: 84532
   - 通貨記号: ETH
   - ブロックエクスプローラー: https://sepolia.basescan.org

### 4. アプリケーションの起動

```bash
npm run dev
```

### 5. テスト

1. ブラウザで `http://localhost:3000` にアクセス
2. MetaMaskを接続
3. Base Sepoliaネットワークに切り替え
4. ゴミを選択して送信をテスト！

## トラブルシューティング

### コントラクトが見つからない
- `.env.local`の`NEXT_PUBLIC_TRASH_NFT_ADDRESS`を確認
- アプリを再起動

### ネットワークエラー
- ウォレットがBase Sepoliaに接続されているか確認
- MetaMaskでネットワークを手動で切り替え

### ガス代不足
- Faucetからテストネット用ETHを取得

## 次のステップ

詳細な手順は `TESTNET_SETUP.md` を参照してください。






