# 🧪 テストネット設定ガイド

## 1. 環境変数の設定

`.env.local`ファイルを作成して、以下の内容を設定してください：

```env
# テストネットモードを有効化
NEXT_PUBLIC_USE_TESTNET=true

# コントラクトアドレス（デプロイ後に設定）
NEXT_PUBLIC_TRASH_NFT_ADDRESS=0xYourDeployedContractAddress
```

## 2. スマートコントラクトのデプロイ

### Foundryを使用する場合

#### 2.1 Foundryのインストール

```bash
# Foundryのインストール（未インストールの場合）
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

#### 2.2 プロジェクトのセットアップ

```bash
# Foundryプロジェクトの初期化（まだの場合）
forge init --force

# OpenZeppelinコントラクトのインストール
forge install OpenZeppelin/openzeppelin-contracts
```

#### 2.3 コントラクトのコンパイル

```bash
forge build
```

#### 2.4 Base Sepoliaにデプロイ

```bash
# プライベートキーを環境変数に設定（.envファイル推奨）
export PRIVATE_KEY=your_private_key_here

# Base Sepoliaにデプロイ
forge create contracts/TrashNFT.sol:TrashNFT \
  --rpc-url https://sepolia.base.org \
  --private-key $PRIVATE_KEY \
  --constructor-args "" \
  --chain base-sepolia
```

デプロイが成功すると、コントラクトアドレスが表示されます。

#### 2.5 コントラクトアドレスを環境変数に設定

`.env.local`ファイルを更新：

```env
NEXT_PUBLIC_TRASH_NFT_ADDRESS=0xYourDeployedContractAddress
```

### Hardhatを使用する場合

#### 2.1 Hardhatのインストール

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

#### 2.2 hardhat.config.jsの作成

```javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
```

#### 2.3 デプロイスクリプトの作成

`scripts/deploy.js`:

```javascript
async function main() {
  const TrashNFT = await ethers.getContractFactory("TrashNFT");
  const trashNFT = await TrashNFT.deploy();
  await trashNFT.waitForDeployment();
  console.log("TrashNFT deployed to:", await trashNFT.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

#### 2.4 デプロイ

```bash
npx hardhat run scripts/deploy.js --network baseSepolia
```

## 3. テストネット用ETHの取得

Base Sepoliaでテストするには、テストネット用のETHが必要です：

1. **Base Sepolia Faucet**を使用：
   - https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
   - または https://faucet.quicknode.com/base/sepolia

2. ウォレットにBase Sepoliaネットワークを追加：
   - ネットワーク名: Base Sepolia
   - RPC URL: https://sepolia.base.org
   - チェーンID: 84532
   - 通貨記号: ETH
   - ブロックエクスプローラー: https://sepolia.basescan.org

## 4. アプリケーションの起動

```bash
npm run dev
```

## 5. 動作確認

1. ブラウザで `http://localhost:3000` にアクセス
2. MetaMaskなどのウォレットを接続
3. Base Sepoliaネットワークに切り替え
4. ゴミを選択して送信をテスト

## 6. トラブルシューティング

### コントラクトが見つからないエラー

- `.env.local`の`NEXT_PUBLIC_TRASH_NFT_ADDRESS`が正しく設定されているか確認
- コントラクトアドレスがBase Sepoliaにデプロイされているか確認

### ネットワークエラー

- ウォレットがBase Sepoliaネットワークに接続されているか確認
- RPC URLが正しいか確認

### ガス代不足エラー

- テストネット用のETHがウォレットにあるか確認
- Faucetから取得してください

## 7. メインネットへの切り替え

テストが完了したら、メインネットに切り替えるには：

1. `.env.local`を更新：
```env
NEXT_PUBLIC_USE_TESTNET=false
NEXT_PUBLIC_TRASH_NFT_ADDRESS=0xYourMainnetContractAddress
```

2. アプリケーションを再起動

## 参考リンク

- [Base Sepolia Explorer](https://sepolia.basescan.org)
- [Base Documentation](https://docs.base.org)
- [Foundry Documentation](https://book.getfoundry.sh)
- [Hardhat Documentation](https://hardhat.org/docs)






