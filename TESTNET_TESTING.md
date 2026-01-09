# 🧪 テストネット動作確認ガイド

## 前提条件の確認

### 1. `.env.local`ファイルの設定確認

プロジェクトルートの`.env.local`ファイルに以下が設定されていることを確認：

```env
NEXT_PUBLIC_USE_TESTNET=true
NEXT_PUBLIC_TRASH_NFT_ADDRESS=0xデプロイされたコントラクトアドレス
```

**重要**: `0x0000000000000000000000000000000000000000`のままになっていないか確認してください。

### 2. MetaMaskの準備

#### Base Sepoliaネットワークの追加

MetaMaskで以下のネットワークを追加：

- **ネットワーク名**: Base Sepolia
- **RPC URL**: https://sepolia.base.org
- **チェーンID**: 84532
- **通貨記号**: ETH
- **ブロックエクスプローラー**: https://sepolia.basescan.org

#### テストネット用ETHの取得

1. Base Sepolia Faucetにアクセス：
   - https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
   - または https://faucet.quicknode.com/base/sepolia

2. MetaMaskのウォレットアドレスを入力してETHを取得

## テスト手順

### 1. 開発サーバーの起動

```cmd
npm run dev
```

### 2. ブラウザでアクセス

`http://localhost:3000` にアクセス

### 3. MetaMaskの接続

1. ページ上の「ウォレットを接続」ボタンをクリック
2. MetaMaskが開いたら、接続を承認
3. **Base Sepoliaネットワークに切り替えていることを確認**

### 4. ゴミNFTの送信テスト

1. **ゴミを選択**: 利用可能なゴミの種類から1つを選択
2. **犠牲者を入力**: 
   - 送信先のウォレットアドレス（`0x`で始まる42文字）
   - またはFarcaster/ENS名
3. **投げるボタンをクリック**: 「▲ 投げる ▲」ボタンをクリック
4. **トランザクションの承認**: MetaMaskでトランザクションを承認
5. **確認を待つ**: トランザクションが確認されるまで待機
6. **成功メッセージ**: 成功モーダルが表示されれば完了

### 5. 確認事項

- ✅ コントラクトアドレスが正しく設定されているか
- ✅ Base Sepoliaネットワークに接続されているか
- ✅ テストネット用ETHが十分にあるか（ガス代が必要）
- ✅ トランザクションが正常に実行されるか
- ✅ 成功モーダルが表示されるか
- ✅ ブロックエクスプローラーでトランザクションを確認できるか

## トラブルシューティング

### エラー: コントラクトがデプロイされていません

- `.env.local`の`NEXT_PUBLIC_TRASH_NFT_ADDRESS`を確認
- アプリを再起動（`npm run dev`を停止して再起動）

### エラー: ネットワークが一致しません

- MetaMaskでBase Sepoliaネットワークに切り替え
- ブラウザをリロード

### エラー: ガス代不足

- Base Sepolia Faucetからテストネット用ETHを取得
- ウォレットの残高を確認

### トランザクションが承認されない

- MetaMaskでトランザクションを確認
- ガス代の設定を確認
- ネットワークがBase Sepoliaになっているか確認

## ブロックエクスプローラーでの確認

デプロイされたコントラクトとトランザクションは以下で確認できます：

- **Base Sepolia Explorer**: https://sepolia.basescan.org
- コントラクトアドレスで検索して、デプロイを確認
- トランザクションハッシュで検索して、NFT送信を確認

## 次のステップ

テストが成功したら：

1. メインネットにデプロイ
2. `.env.local`を更新してメインネットのコントラクトアドレスを設定
3. `NEXT_PUBLIC_USE_TESTNET=false`に変更



