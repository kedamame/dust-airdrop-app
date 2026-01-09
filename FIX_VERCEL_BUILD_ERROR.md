# 🔧 Vercelビルドエラー修正ガイド

## エラー内容

```
Error: > Couldn't find any `pages` or `app` directory. Please create one under the project root
```

## 原因

`app`ディレクトリがGitHubに正しくアップロードされていない可能性があります。

## 解決方法

### ステップ1: ローカルで確認

プロジェクトフォルダで以下を確認：

1. `app`フォルダが存在するか
2. `app/layout.tsx`が存在するか
3. `app/page.tsx`が存在するか

### ステップ2: Gitで確認

PowerShellまたはコマンドプロンプトで：

```bash
# プロジェクトフォルダに移動
cd "C:\Users\kaexr\OneDrive\デスクトップ\Baseapp\DustAirdropApp"

# Gitの状態を確認
git status
```

### ステップ3: すべてのファイルを追加

```bash
# すべてのファイルを追加
git add .

# 追加されたファイルを確認
git status
```

`app`ディレクトリ内のファイルが表示されることを確認してください。

### ステップ4: コミットとプッシュ

```bash
# コミット
git commit -m "Fix: Add app directory to repository"

# GitHubにプッシュ
git push origin main
```

### ステップ5: Vercelで再デプロイ

1. Vercelのダッシュボードに戻る
2. 最新のコミットで自動的に再デプロイが開始されます
3. ビルドが成功するか確認

## 確認方法

### GitHubで確認

1. https://github.com/あなたのユーザー名/リポジトリ名 にアクセス
2. `app`フォルダをクリック
3. 以下のファイルが存在することを確認：
   - `layout.tsx`
   - `page.tsx`
   - `providers.tsx`
   - `globals.css`
   - `api/`フォルダ

### もし`app`フォルダが表示されない場合

以下のコマンドを実行：

```bash
# 強制的にすべてのファイルを追加
git add -f app/

# 確認
git status

# コミット
git commit -m "Force add app directory"

# プッシュ
git push origin main
```

## よくある問題

### 問題1: `app`ディレクトリが`.gitignore`で除外されている

**解決方法:**
`.gitignore`を確認して、`app`が除外されていないことを確認してください。
現在の`.gitignore`には`app`を除外する設定はありません。

### 問題2: ファイルが正しく追加されていない

**解決方法:**
```bash
# すべてのファイルを強制的に追加
git add -A

# 確認
git status

# コミット
git commit -m "Add all files"

# プッシュ
git push origin main
```

## 📝 次のステップ

1. 上記の手順を実行
2. GitHubで`app`ディレクトリが表示されることを確認
3. Vercelで再デプロイ
4. ビルドが成功するか確認

## 💡 ヒント

GitHub Desktopを使用している場合：
1. GitHub Desktopを開く
2. 「Changes」タブで`app`ディレクトリが表示されているか確認
3. 表示されていない場合は、プロジェクトフォルダを確認
4. すべてのファイルを選択してコミット

