# 💻 ターミナルからGitHubにアップロードする方法

## ✅ はい、できます！

ターミナル（コマンドライン）からも簡単にアップロードできます。

## 🚀 手順（初心者向け）

### ステップ1: PowerShellを開く

1. **Windowsキーを押す**
2. **「PowerShell」と入力**
3. **「Windows PowerShell」を選択**（管理者権限は不要）

### ステップ2: プロジェクトフォルダに移動

PowerShellで以下のコマンドを実行：

```powershell
cd "C:\Users\kaexr\OneDrive\デスクトップ\Baseapp\DustAirdropApp"
```

**注意:** パスが異なる場合は、エクスプローラーでプロジェクトフォルダを開き、アドレスバーからパスをコピーして使用してください。

### ステップ3: Gitを初期化（まだの場合）

```powershell
git init
```

### ステップ4: すべてのファイルを追加

```powershell
git add .
```

このコマンドで、`app`フォルダを含むすべてのファイルが追加されます。

### ステップ5: 状態を確認

```powershell
git status
```

`app`ディレクトリ内のファイルが表示されることを確認してください。

### ステップ6: コミット（変更を保存）

```powershell
git commit -m "Add all files including app directory"
```

### ステップ7: リモートリポジトリを追加（まだの場合）

```powershell
git remote add origin https://github.com/kedamame/dust-airdrop-app.git
```

**注意:** 既にリモートが追加されている場合は、このステップはスキップしてください。

### ステップ8: GitHubにアップロード（プッシュ）

```powershell
git push -u origin main
```

初回の場合は、GitHubの認証情報を求められることがあります。

## 📋 完全なコマンド一覧（コピー&ペースト用）

```powershell
# 1. プロジェクトフォルダに移動
cd "C:\Users\kaexr\OneDrive\デスクトップ\Baseapp\DustAirdropApp"

# 2. Gitを初期化（まだの場合）
git init

# 3. すべてのファイルを追加
git add .

# 4. 状態を確認
git status

# 5. コミット
git commit -m "Add all files including app directory"

# 6. リモートを追加（まだの場合）
git remote add origin https://github.com/kedamame/dust-airdrop-app.git

# 7. プッシュ
git push -u origin main
```

## 🔍 各コマンドの説明

- `cd` - フォルダを移動する
- `git init` - Gitリポジトリを初期化する
- `git add .` - すべてのファイルを追加する（`.`は現在のフォルダ全体を意味する）
- `git status` - ファイルの状態を確認する
- `git commit -m "メッセージ"` - 変更を保存する
- `git remote add origin URL` - GitHubのリポジトリを追加する
- `git push -u origin main` - GitHubにアップロードする

## ⚠️ よくあるエラーと解決方法

### エラー1: "fatal: not a git repository"

**原因:** Gitリポジトリが初期化されていない

**解決方法:**
```powershell
git init
```

### エラー2: "remote origin already exists"

**原因:** 既にリモートリポジトリが追加されている

**解決方法:** このエラーは無視して、次のステップに進んでください。

### エラー3: "Authentication failed"

**原因:** GitHubの認証情報が必要

**解決方法:**
1. GitHubのパーソナルアクセストークンを作成
2. または、GitHub Desktopを使用する

### エラー4: "app directory not found"

**原因:** `app`フォルダが正しく追加されていない

**解決方法:**
```powershell
# 強制的にappフォルダを追加
git add -f app/

# 確認
git status

# コミット
git commit -m "Force add app directory"

# プッシュ
git push origin main
```

## ✅ 確認方法

### GitHubで確認

1. https://github.com/kedamame/dust-airdrop-app にアクセス
2. `app`フォルダが表示されているか確認
3. `app/layout.tsx`や`app/page.tsx`が存在するか確認

### コマンドで確認

```powershell
# 追跡されているファイルを確認
git ls-files | Select-String "app"
```

`app`ディレクトリ内のファイルが表示されれば成功です。

## 💡 ヒント

- **コマンドは1つずつ実行してください**
- **エラーメッセージを読んで、何が問題か確認してください**
- **`git status`で状態を確認できます**

## 🎉 完了後

1. GitHubで`app`フォルダが表示されていることを確認
2. Vercelのダッシュボードに戻る
3. 自動的に再デプロイが開始されます
4. ビルドが成功するか確認

## 📞 困ったときは

- エラーが出たら、エラーメッセージを読む
- `git status`で状態を確認する
- GitHub Desktopを使う方法もあります

