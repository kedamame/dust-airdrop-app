# 🚀 Vercelデプロイ手順（初心者向け）

このガイドでは、Vercelにアプリをデプロイする手順を、初心者でもわかりやすく説明します。

## 📋 準備するもの

- GitHubアカウント（無料）
- Vercelアカウント（無料、GitHubアカウントで作成可能）
- このプロジェクトのコード

## ステップ1: GitHubにコードをアップロード

### 1-1. GitHubでリポジトリを作成

1. https://github.com にアクセスしてログイン
2. 右上の「+」ボタンをクリック → 「New repository」を選択
3. リポジトリ名を入力（例：`dust-airdrop-app`）
4. 「Public」または「Private」を選択
5. 「Create repository」をクリック

### 1-2. コードをGitHubにプッシュ

**方法A: GitHub Desktopを使用（初心者向け）**

1. https://desktop.github.com からGitHub Desktopをダウンロード・インストール
2. GitHub Desktopを開く
3. 「File」→「Add Local Repository」をクリック
4. このプロジェクトのフォルダを選択
5. 左下の「Commit to main」をクリック
6. 「Publish repository」をクリック

**方法B: コマンドラインを使用**

1. プロジェクトフォルダでコマンドプロンプト（PowerShell）を開く
2. 以下のコマンドを順番に実行：

```bash
# Gitを初期化（まだの場合）
git init

# すべてのファイルを追加
git add .

# コミット（変更を保存）
git commit -m "Initial commit"

# GitHubのリポジトリURLを追加（作成したリポジトリのURLに置き換える）
git remote add origin https://github.com/あなたのユーザー名/リポジトリ名.git

# GitHubにプッシュ
git push -u origin main
```

## ステップ2: Vercelアカウントを作成

1. https://vercel.com にアクセス
2. 「Sign Up」をクリック
3. 「Continue with GitHub」をクリック
4. GitHubアカウントでログイン
5. VercelがGitHubへのアクセスを求めます → 「Authorize」をクリック

## ステップ3: Vercelでプロジェクトを作成

1. Vercelのダッシュボードで「Add New...」→「Project」をクリック
2. 「Import Git Repository」で、先ほど作成したGitHubリポジトリを選択
3. 「Import」をクリック

## ステップ4: 環境変数を設定

### 4-1. 環境変数設定画面を開く

プロジェクトの設定画面で：
1. 「Settings」タブをクリック
2. 左メニューから「Environment Variables」をクリック

### 4-2. 環境変数を追加

以下の環境変数を1つずつ追加します：

#### ① ネットワークモード
- **Key（名前）**: `NEXT_PUBLIC_USE_TESTNET`
- **Value（値）**: `false`
- 「Add」をクリック

#### ② メインネットのコントラクトアドレス
- **Key（名前）**: `NEXT_PUBLIC_TRASH_NFT_ADDRESS_MAINNET`
- **Value（値）**: `0x6De78096eaa28f50Ded407F60A21a0803A75326B`
- 「Add」をクリック

#### ③ テストネットのコントラクトアドレス（オプション）
- **Key（名前）**: `NEXT_PUBLIC_TRASH_NFT_ADDRESS_TESTNET`
- **Value（値）**: あなたのテストネットのコントラクトアドレス
- 「Add」をクリック

### 4-3. 環境変数の確認

追加した環境変数が表示されていることを確認してください。

## ステップ5: デプロイを実行

1. プロジェクト設定画面の「Deployments」タブに戻る
2. 「Deploy」ボタンをクリック
3. ビルドが開始されます（数分かかります）

### ビルド中の確認事項

- ビルドログが表示されます
- エラーがないか確認してください
- ビルドが完了すると「Ready」と表示されます

## ステップ6: デプロイ後の確認

### 6-1. サイトにアクセス

1. デプロイが完了すると、URLが表示されます
   - 例：`https://your-project.vercel.app`
2. このURLをクリックしてサイトを開く

### 6-2. 動作確認

以下の機能が正常に動作するか確認してください：

- [ ] サイトが表示される
- [ ] ウォレット接続ボタンが表示される
- [ ] ウォレットを接続できる
- [ ] ゴミを選択できる
- [ ] NFTを送信できる
- [ ] ネットワーク切り替えが動作する

## ⚠️ よくある問題と解決方法

### 問題1: ビルドエラーが発生する

**解決方法:**
1. ビルドログを確認してエラーメッセージを読む
2. ローカルで`npm run build`を実行してエラーを確認
3. エラーを修正してGitHubにプッシュ
4. Vercelで再デプロイ

### 問題2: 環境変数が読み込まれない

**解決方法:**
1. 環境変数名が`NEXT_PUBLIC_`で始まっているか確認
2. 環境変数の値が正しいか確認
3. 環境変数を変更した場合は、再デプロイが必要

### 問題3: ウォレット接続が動作しない

**解決方法:**
1. ブラウザのコンソール（F12キー）でエラーを確認
2. ネットワーク設定が正しいか確認
3. 環境変数が正しく設定されているか確認

## 📝 デプロイ後の更新方法

コードを更新した場合：

1. コードを変更
2. GitHubにプッシュ
   ```bash
   git add .
   git commit -m "Update code"
   git push
   ```
3. Vercelが自動的に再デプロイします

## 🎉 完了！

これで、あなたのアプリが世界中からアクセスできるようになりました！

## 📞 サポート

問題が発生した場合：
1. Vercelのドキュメント: https://vercel.com/docs
2. Next.jsのドキュメント: https://nextjs.org/docs
3. ビルドログを確認してエラーメッセージを読む

