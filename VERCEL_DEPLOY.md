# 🚀 Vercelデプロイガイド

## デプロイ前の確認事項

### ✅ 必須環境変数

Vercelのダッシュボードで以下の環境変数を設定してください：

#### 基本設定
```env
# テストネットモード（true: Base Sepolia, false: Base Mainnet）
NEXT_PUBLIC_USE_TESTNET=false

# コントラクトアドレス（メインネット）
NEXT_PUBLIC_TRASH_NFT_ADDRESS_MAINNET=0x6De78096eaa28f50Ded407F60A21a0803A75326B

# コントラクトアドレス（テストネット、オプション）
NEXT_PUBLIC_TRASH_NFT_ADDRESS_TESTNET=0xYourTestnetContractAddress

# ベースURL（本番環境のURL）
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```

#### オプション環境変数
```env
# Neynar API（Farcaster機能を使用する場合）
NEYNAR_API_KEY=your-api-key
```

### 📋 デプロイ手順

1. **Vercelアカウントの作成**
   - https://vercel.com にアクセス
   - GitHubアカウントでログイン

2. **プロジェクトのインポート**
   - Vercelダッシュボードで「New Project」をクリック
   - GitHubリポジトリを選択
   - プロジェクトをインポート

3. **環境変数の設定**
   - プロジェクト設定 → Environment Variables
   - 上記の環境変数を追加

4. **ビルド設定の確認**
   - Framework Preset: Next.js
   - Build Command: `npm run build`（デフォルト）
   - Output Directory: `.next`（デフォルト）
   - Install Command: `npm install`（デフォルト）

5. **デプロイ**
   - 「Deploy」ボタンをクリック
   - ビルドが完了するまで待機

### ⚠️ 注意事項

1. **環境変数の設定**
   - `.env.local`はGitにコミットされません
   - Vercelのダッシュボードで環境変数を設定してください

2. **ビルドエラーの確認**
   - ビルドログを確認してエラーがないか確認
   - TypeScriptの型エラーがないか確認

3. **本番環境での動作確認**
   - デプロイ後、実際にNFTを送信して動作を確認
   - ウォレット接続が正しく動作するか確認

4. **パフォーマンス**
   - 初回ロード時間を確認
   - 必要に応じて画像の最適化を検討

### 🔧 トラブルシューティング

#### ビルドエラーが発生する場合
- `npm run build`をローカルで実行してエラーを確認
- TypeScriptの型エラーを修正
- 依存関係のバージョンを確認

#### 環境変数が読み込まれない場合
- Vercelのダッシュボードで環境変数が正しく設定されているか確認
- 環境変数名が`NEXT_PUBLIC_`で始まっているか確認
- デプロイ後に環境変数を変更した場合は、再デプロイが必要

#### ウォレット接続が動作しない場合
- ネットワーク設定が正しいか確認
- RPC URLが正しく設定されているか確認

### 📝 カスタムドメインの設定（オプション）

1. Vercelダッシュボードで「Settings」→「Domains」
2. カスタムドメインを追加
3. DNS設定を更新

### 🔐 セキュリティ

- プライベートキーやシークレットキーは環境変数に設定
- `.env.local`をGitにコミットしない
- Vercelの環境変数は暗号化されて保存されます

