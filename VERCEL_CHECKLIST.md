# ✅ Vercelデプロイ前チェックリスト

## 📋 デプロイ前の確認事項

### 1. プロジェクトの準備状況

- [x] `package.json`が正しく設定されている
- [x] 依存関係がインストールされている
- [x] TypeScriptの設定が正しい
- [x] Next.jsの設定が正しい
- [x] ビルドエラーがない

### 2. 環境変数の設定

Vercelのダッシュボードで以下の環境変数を設定してください：

#### 必須環境変数
```env
# ネットワークモード（メインネットの場合）
NEXT_PUBLIC_USE_TESTNET=false

# コントラクトアドレス（メインネット）
NEXT_PUBLIC_TRASH_NFT_ADDRESS_MAINNET=0x6De78096eaa28f50Ded407F60A21a0803A75326B

# ベースURL（デプロイ後に自動設定されるが、必要に応じて手動設定）
NEXT_PUBLIC_BASE_URL=https://your-project.vercel.app
```

#### オプション環境変数
```env
# テストネット用コントラクトアドレス（テストネットも使用する場合）
NEXT_PUBLIC_TRASH_NFT_ADDRESS_TESTNET=0xYourTestnetContractAddress

# Neynar API（Farcaster機能を使用する場合）
NEYNAR_API_KEY=your-api-key

# カスタムRPC URL（オプション）
NEXT_PUBLIC_BASE_MAINNET_RPC=https://mainnet.base.org
NEXT_PUBLIC_BASE_SEPOLIA_RPC=https://sepolia.base.org
```

### 3. ビルド設定

Vercelは自動的にNext.jsプロジェクトを検出しますが、以下の設定を確認してください：

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`（デフォルト）
- **Output Directory**: `.next`（デフォルト）
- **Install Command**: `npm install`（デフォルト）
- **Node.js Version**: 18.x以上（推奨）

### 4. デプロイ手順

1. **GitHubリポジトリにプッシュ**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Vercelでプロジェクトをインポート**
   - https://vercel.com にアクセス
   - 「New Project」をクリック
   - GitHubリポジトリを選択
   - プロジェクトをインポート

3. **環境変数を設定**
   - プロジェクト設定 → Environment Variables
   - 上記の環境変数を追加

4. **デプロイ**
   - 「Deploy」ボタンをクリック
   - ビルドが完了するまで待機

### 5. デプロイ後の確認

- [ ] サイトが正常に表示される
- [ ] ウォレット接続が動作する
- [ ] NFT送信機能が動作する
- [ ] ネットワーク切り替えが動作する
- [ ] 履歴機能が動作する
- [ ] モバイル表示が正しい

### 6. トラブルシューティング

#### ビルドエラーが発生する場合
- ローカルで`npm run build`を実行してエラーを確認
- TypeScriptの型エラーを修正
- 依存関係のバージョンを確認

#### 環境変数が読み込まれない場合
- Vercelのダッシュボードで環境変数が正しく設定されているか確認
- 環境変数名が`NEXT_PUBLIC_`で始まっているか確認
- デプロイ後に環境変数を変更した場合は、再デプロイが必要

#### ウォレット接続が動作しない場合
- ネットワーク設定が正しいか確認
- RPC URLが正しく設定されているか確認
- ブラウザのコンソールでエラーを確認

### 7. セキュリティ

- ✅ `.env.local`は`.gitignore`に含まれている
- ✅ プライベートキーは環境変数に設定しない（フロントエンドでは使用しない）
- ✅ Vercelの環境変数は暗号化されて保存される

### 8. パフォーマンス

- 初回ロード時間を確認
- 必要に応じて画像の最適化を検討
- VercelのAnalyticsでパフォーマンスを監視

## 🎉 デプロイ完了後

デプロイが完了したら、以下のURLでアクセスできます：
- 本番環境: `https://your-project.vercel.app`
- プレビュー環境: 各プルリクエストごとに自動生成

## 📝 注意事項

- Vercelは自動的にHTTPSを提供します
- カスタムドメインを設定する場合は、Vercelのダッシュボードで設定してください
- 環境変数を変更した場合は、再デプロイが必要です

