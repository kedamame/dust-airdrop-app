# 📤 GitHubにアップロードする方法（初心者向け）

## 問題: `app`ディレクトリがアップロードできない

この問題を解決する方法をいくつか紹介します。

## 方法1: GitHub Desktopを使用（最も簡単）

### ステップ1: GitHub Desktopを開く

1. GitHub Desktopを起動
2. 既にリポジトリが開いている場合は、そのまま進む
3. 開いていない場合は、「File」→「Add Local Repository」でプロジェクトフォルダを選択

### ステップ2: ファイルを確認

1. 左側の「Changes」タブをクリック
2. `app`フォルダが表示されているか確認
3. 表示されていない場合、次のステップに進む

### ステップ3: すべてのファイルを追加

1. 左下の「Show in Explorer」をクリック（または、エクスプローラーでプロジェクトフォルダを開く）
2. `app`フォルダが存在することを確認
3. GitHub Desktopに戻る
4. 「Repository」→「Show in Finder」（Mac）または「Show in Explorer」（Windows）でフォルダを確認

### ステップ4: 強制的に追加

1. GitHub Desktopの左下で「Commit to main」の横にある「+」ボタンをクリック
2. すべてのファイルを選択
3. または、コマンドラインで以下を実行：

```bash
# プロジェクトフォルダでPowerShellを開く
cd "C:\Users\kaexr\OneDrive\デスクトップ\Baseapp\DustAirdropApp"

# Gitを初期化（まだの場合）
git init

# すべてのファイルを追加
git add .

# 状態を確認
git status
```

### ステップ5: コミットとプッシュ

1. GitHub Desktopで「Commit to main」をクリック
2. コミットメッセージを入力（例：「Add app directory」）
3. 「Commit to main」をクリック
4. 「Push origin」をクリック

## 方法2: コマンドラインを使用

### ステップ1: PowerShellを開く

1. Windowsキーを押す
2. 「PowerShell」と入力
3. 「Windows PowerShell」を選択

### ステップ2: プロジェクトフォルダに移動

```powershell
cd "C:\Users\kaexr\OneDrive\デスクトップ\Baseapp\DustAirdropApp"
```

### ステップ3: Gitを初期化（まだの場合）

```powershell
git init
```

### ステップ4: リモートリポジトリを追加（まだの場合）

```powershell
git remote add origin https://github.com/kedamame/dust-airdrop-app.git
```

### ステップ5: すべてのファイルを追加

```powershell
# すべてのファイルを追加
git add .

# 状態を確認
git status
```

`app`ディレクトリ内のファイルが表示されることを確認してください。

### ステップ6: コミット

```powershell
git commit -m "Add app directory and all files"
```

### ステップ7: GitHubにプッシュ

```powershell
git push -u origin main
```

## 方法3: ウェブで直接アップロード（緊急時）

もし上記の方法がうまくいかない場合：

1. https://github.com/kedamame/dust-airdrop-app にアクセス
2. 「Add file」→「Upload files」をクリック
3. `app`フォルダをドラッグ&ドロップ
4. 「Commit changes」をクリック

## 確認方法

### GitHubで確認

1. https://github.com/kedamame/dust-airdrop-app にアクセス
2. `app`フォルダをクリック
3. 以下のファイルが存在することを確認：
   - `layout.tsx`
   - `page.tsx`
   - `providers.tsx`
   - `globals.css`
   - `api/`フォルダ

## トラブルシューティング

### 問題1: `app`フォルダが表示されない

**解決方法:**
```powershell
# 強制的に追加
git add -f app/

# 確認
git status

# コミット
git commit -m "Force add app directory"

# プッシュ
git push origin main
```

### 問題2: Gitリポジトリが初期化されていない

**解決方法:**
```powershell
# Gitを初期化
git init

# すべてのファイルを追加
git add .

# コミット
git commit -m "Initial commit"

# リモートを追加
git remote add origin https://github.com/kedamame/dust-airdrop-app.git

# プッシュ
git push -u origin main
```

### 問題3: パスの問題

**解決方法:**
- プロジェクトフォルダのパスに日本語が含まれている場合、問題が発生する可能性があります
- エクスプローラーでプロジェクトフォルダを開き、アドレスバーからパスをコピーして使用してください

## 💡 推奨方法

**初心者の方には、GitHub Desktopを使用することをおすすめします。**

1. 視覚的にファイルを確認できる
2. ドラッグ&ドロップで簡単に操作できる
3. エラーメッセージがわかりやすい

