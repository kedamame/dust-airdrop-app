# 📁 `app`ディレクトリをアップロードする方法

## 🎯 最も簡単な方法: GitHub Desktop

### 手順

1. **GitHub Desktopを開く**
   - 既にリポジトリが開いている場合はそのまま
   - 開いていない場合は「File」→「Add Local Repository」

2. **ファイルを確認**
   - 左側の「Changes」タブをクリック
   - `app`フォルダが表示されているか確認

3. **表示されていない場合**
   - 左下の「Commit to main」の横の「+」をクリック
   - すべてのファイルを選択
   - 「Commit to main」をクリック
   - 「Push origin」をクリック

## 🔧 コマンドラインを使用する場合

### 手順

1. **PowerShellを開く**
   - Windowsキー → 「PowerShell」と入力

2. **プロジェクトフォルダに移動**
   ```powershell
   cd "C:\Users\kaexr\OneDrive\デスクトップ\Baseapp\DustAirdropApp"
   ```

3. **Gitを初期化（まだの場合）**
   ```powershell
   git init
   ```

4. **すべてのファイルを追加**
   ```powershell
   git add .
   ```

5. **状態を確認**
   ```powershell
   git status
   ```
   
   `app`ディレクトリ内のファイルが表示されることを確認

6. **コミット**
   ```powershell
   git commit -m "Add app directory"
   ```

7. **リモートを追加（まだの場合）**
   ```powershell
   git remote add origin https://github.com/kedamame/dust-airdrop-app.git
   ```

8. **プッシュ**
   ```powershell
   git push -u origin main
   ```

## 🌐 ウェブで直接アップロード（緊急時）

1. https://github.com/kedamame/dust-airdrop-app にアクセス
2. 「Add file」→「Upload files」をクリック
3. `app`フォルダをドラッグ&ドロップ
4. 「Commit changes」をクリック

## ✅ 確認

GitHubで以下を確認：
- `app`フォルダが表示されている
- `app/layout.tsx`が存在する
- `app/page.tsx`が存在する

確認できたら、Vercelで再デプロイしてください！

