# 📤 GitHub Desktopでまとめてアップロードする方法

## ✅ はい、できます！

GitHub Desktopを使えば、フォルダごとまとめて簡単にアップロードできます。

## 🚀 手順（超簡単）

### ステップ1: GitHub Desktopを開く

1. GitHub Desktopを起動
2. 既にリポジトリが開いている場合はそのまま
3. 開いていない場合：
   - 「File」→「Add Local Repository」
   - プロジェクトフォルダ（`DustAirdropApp`）を選択
   - 「Add」をクリック

### ステップ2: ファイルを確認

1. 左側の「Changes」タブをクリック
2. 表示されるファイルを確認：
   - ✅ `app`フォルダとその中のファイル
   - ✅ `components`フォルダ
   - ✅ `package.json`
   - ✅ その他のファイル

### ステップ3: すべてのファイルを選択

1. 左下の「Commit to main」の上にあるチェックボックスを確認
2. すべてのファイルにチェックが入っていることを確認
3. もしチェックが入っていない場合は、チェックボックスをクリック

### ステップ4: コミット（変更を保存）

1. 左下の「Summary」欄にメッセージを入力：
   ```
   Initial commit - Add all files
   ```
   または
   ```
   すべてのファイルを追加
   ```

2. 「Commit to main」ボタンをクリック

### ステップ5: GitHubにアップロード（プッシュ）

1. 上部の「Push origin」ボタンをクリック
2. アップロードが完了するまで待つ（数秒〜数分）

### ステップ6: 確認

1. 「View on GitHub」をクリック
2. GitHubのウェブサイトが開く
3. `app`フォルダが表示されていることを確認

## 📋 確認すべきファイル

GitHubで以下が表示されていることを確認：

- ✅ `app/` フォルダ
  - `layout.tsx`
  - `page.tsx`
  - `providers.tsx`
  - `globals.css`
  - `api/` フォルダ
- ✅ `components/` フォルダ
- ✅ `package.json`
- ✅ `next.config.js`
- ✅ `tsconfig.json`

## ⚠️ 注意事項

### アップロードされないファイル（正常）

以下のファイルは`.gitignore`で除外されているため、アップロードされません（これは正常です）：

- ❌ `.env.local` - 秘密鍵など（安全のため）
- ❌ `node_modules/` - 依存関係（再インストール可能）
- ❌ `.next/` - ビルドファイル（再ビルド可能）

## 🔧 もし`app`フォルダが表示されない場合

### 方法1: 強制的に追加

1. GitHub Desktopで「Repository」→「Open in Command Prompt」（または「Open in Terminal」）
2. 以下のコマンドを実行：

```bash
git add -f app/
git commit -m "Force add app directory"
git push
```

### 方法2: エクスプローラーからドラッグ&ドロップ

1. エクスプローラーで`app`フォルダを開く
2. GitHub Desktopの「Changes」タブにドラッグ&ドロップ
3. 「Commit to main」をクリック
4. 「Push origin」をクリック

## 💡 ヒント

- **一度にすべてのファイルをアップロードできます**
- **フォルダごとまとめてアップロードできます**
- **視覚的に確認できるので安心です**

## 🎉 完了後

1. GitHubで`app`フォルダが表示されていることを確認
2. Vercelのダッシュボードに戻る
3. 自動的に再デプロイが開始されます
4. ビルドが成功するか確認

## 📞 困ったときは

- `app`フォルダが表示されない → 上記の「強制的に追加」を試す
- エラーが出る → エラーメッセージを確認
- ファイルが表示されない → 「Repository」→「Show in Explorer」でフォルダを確認

