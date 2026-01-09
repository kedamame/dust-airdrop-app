# 🌐 ネットワーク切り替えガイド

## 問題
「ネットワークが正しくありません。Base Sepolia (84532) に切り替えてください。現在: 1」というエラーが表示される場合、MetaMaskがEthereum Mainnetに接続されています。

## 解決方法

### 1. MetaMaskでBase Sepoliaネットワークに切り替え

#### 方法1: 既に追加済みの場合
1. MetaMaskを開く
2. ネットワークセレクター（上部）をクリック
3. 「Base Sepolia」を選択

#### 方法2: まだ追加していない場合

**手動で追加:**
1. MetaMaskを開く
2. ネットワークセレクターをクリック
3. 「ネットワークの追加」をクリック
4. 以下の情報を入力：
   - **ネットワーク名**: Base Sepolia
   - **新しいRPC URL**: https://sepolia.base.org
   - **チェーンID**: 84532
   - **通貨記号**: ETH
   - **ブロックエクスプローラーURL**: https://sepolia.basescan.org
5. 「保存」をクリック

**Chainlistを使用（推奨）:**
1. https://chainlist.org/ にアクセス
2. 「Base Sepolia」を検索
3. 「接続」をクリックしてMetaMaskに追加

### 2. ネットワーク切り替えの確認

ブラウザをリロードして、再度NFT送信を試してください。

コンソール（F12）で以下を確認：
```
Expected chain ID: 84532, Current: 84532
```

### 3. テストネット用ETHの取得

Base Sepoliaでテストするには、テストネット用ETHが必要です：

1. **Base Sepolia Faucet**にアクセス：
   - https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
   - または https://faucet.quicknode.com/base/sepolia

2. MetaMaskのウォレットアドレスを入力してETHを取得

## トラブルシューティング

### ネットワークが切り替わらない場合

1. MetaMaskをリフレッシュ（拡張機能を無効化→有効化）
2. ブラウザをリロード
3. 別のブラウザで試す

### ネットワークが表示されない場合

手動で追加する方法を使用してください。



