# 🔍 GitHubアップロード前の確認チェックリスト

## 問題: `app`ディレクトリが見つからないエラー

このエラーは、GitHubに`app`ディレクトリが正しくアップロードされていない可能性があります。

## ✅ 確認手順

### ステップ1: ローカルで`app`ディレクトリが存在するか確認

プロジェクトフォルダで以下のファイルが存在することを確認：
- `app/layout.tsx`
- `app/page.tsx`
- `app/providers.tsx`
- `app/globals.css`

### ステップ2: Gitで追跡されているか確認

PowerShellまたはコマンドプロンプトで以下を実行：

```bash
git status
```

`app`ディレクトリ内のファイルが表示されることを確認してください。

### ステップ3: もし`app`ディレクトリが表示されない場合

以下のコマンドを実行：

```bash
# すべてのファイルを追加
git add .

# 状態を確認
git status
```

### ステップ4: GitHubにプッシュ

```bash
git commit -m "Add app directory"
git push origin main
```

## 🔧 解決方法

### 方法1: すべてのファイルを再追加

```bash
# すべてのファイルを追加
git add .

# コミット
git commit -m "Fix: Add all files including app directory"

# プッシュ
git push origin main
```

### 方法2: GitHub Desktopを使用

1. GitHub Desktopを開く
2. 左側の「Changes」タブを確認
3. `app`ディレクトリ内のファイルが表示されているか確認
4. 表示されていない場合は、「Repository」→「Show in Explorer」でフォルダを確認
5. すべてのファイルが表示されていることを確認
6. 左下で「Commit to main」をクリック
7. 「Push origin」をクリック

### 方法3: 手動で確認

GitHubのリポジトリページで以下を確認：
1. https://github.com/あなたのユーザー名/リポジトリ名 にアクセス
2. `app`フォルダが表示されているか確認
3. `app/layout.tsx`や`app/page.tsx`が存在するか確認

## ⚠️ 注意事項

`.gitignore`で`app`ディレクトリが除外されていないことを確認してください。

現在の`.gitignore`には`app`ディレクトリを除外する設定はありませんので、問題ないはずです。

## 📝 確認コマンド

以下のコマンドで、GitHubにアップロードされるファイルを確認できます：

```bash
# 追跡されているファイルを確認
git ls-files | grep app
```

`app`ディレクトリ内のファイルが表示されれば問題ありません。

