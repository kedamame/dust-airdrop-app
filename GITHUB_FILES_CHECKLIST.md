# 📋 GitHubにアップロードするファイル一覧

## ✅ アップロードすべきファイル（必須）

### 📁 アプリケーションのコード

- ✅ `app/` フォルダ全体
  - `app/layout.tsx`
  - `app/page.tsx`
  - `app/providers.tsx`
  - `app/globals.css`
  - `app/api/` フォルダ全体

- ✅ `components/` フォルダ全体
  - `components/WalletConnect.tsx`
  - `components/TrashSelector.tsx`
  - `components/SuccessModal.tsx`
  - `components/HistoryModal.tsx`
  - `components/NetworkSwitcher.tsx`
  - `components/LanguageSwitcher.tsx`
  - `components/RecipientInput.tsx`
  - `components/ThrowButton.tsx`
  - `components/TVBackground.tsx`

- ✅ `contexts/` フォルダ全体
  - `contexts/LanguageContext.tsx`
  - `contexts/NetworkContext.tsx`

- ✅ `hooks/` フォルダ全体
  - `hooks/useTrashNFT.ts`
  - `hooks/useFarcasterSDK.ts`

- ✅ `lib/` フォルダ全体
  - `lib/i18n.ts`
  - `lib/history.ts`
  - `lib/constants.ts`

### 📄 設定ファイル

- ✅ `package.json` - 依存関係の定義
- ✅ `package-lock.json` - 依存関係のロックファイル
- ✅ `next.config.js` - Next.jsの設定
- ✅ `tsconfig.json` - TypeScriptの設定
- ✅ `tailwind.config.js` - Tailwind CSSの設定
- ✅ `postcss.config.js` - PostCSSの設定
- ✅ `next-env.d.ts` - Next.jsの型定義

### 📁 静的ファイル

- ✅ `public/` フォルダ全体
  - `public/icon.svg`
  - `public/og-image.svg`
  - `public/splash.svg`

### 📄 コントラクトファイル

- ✅ `contracts/` フォルダ
  - `contracts/TrashNFT.sol`

### 📄 設定ファイル（Git管理用）

- ✅ `.gitignore` - Gitで除外するファイルの定義
- ✅ `README.md` - プロジェクトの説明
- ✅ `vercel.json` - Vercelの設定（あれば）

### 📄 ドキュメント（オプション）

- ✅ `VERCEL_DEPLOY.md` - デプロイガイド
- ✅ `SECURITY_GUIDE.md` - セキュリティガイド
- ✅ その他の`.md`ファイル

## ❌ アップロードしてはいけないファイル

以下のファイルは`.gitignore`で自動的に除外されます（安全のため）：

- ❌ `.env.local` - 秘密鍵やAPIキー（絶対にアップロードしない）
- ❌ `.env` - 環境変数ファイル
- ❌ `node_modules/` - 依存関係（再インストール可能）
- ❌ `.next/` - ビルドファイル（再ビルド可能）
- ❌ `build/` - ビルドファイル
- ❌ `cache/` - キャッシュファイル
- ❌ `artifacts/` - コントラクトのアーティファクト

## 🚀 アップロード方法

### 方法1: GitHub Desktop（最も簡単）

1. GitHub Desktopを開く
2. 「Changes」タブをクリック
3. **すべてのファイルにチェックが入っていることを確認**
4. 「Commit to main」をクリック
5. 「Push origin」をクリック

### 方法2: コマンドライン

```powershell
# プロジェクトフォルダに移動
cd "C:\Users\kaexr\OneDrive\デスクトップ\Baseapp\DustAirdropApp"

# すべてのファイルを追加（.gitignoreで除外されるファイルは自動的に除外されます）
git add .

# 状態を確認
git status

# コミット
git commit -m "Add all project files"

# プッシュ
git push -u origin main --force
```

## ✅ 確認方法

### GitHubで確認

1. https://github.com/kedamame/dust-airdrop-app にアクセス
2. 以下のフォルダとファイルが表示されていることを確認：

**必須ファイル:**
- ✅ `app/` フォルダ
- ✅ `components/` フォルダ
- ✅ `package.json`
- ✅ `next.config.js`
- ✅ `tsconfig.json`

**確認すべきファイル:**
- ✅ `app/layout.tsx`
- ✅ `app/page.tsx`
- ✅ `app/providers.tsx`

### コマンドで確認

```powershell
# 追跡されているファイルを確認
git ls-files
```

## 💡 重要なポイント

1. **`git add .`で自動的に適切なファイルが追加されます**
   - `.gitignore`で除外されたファイルは自動的に除外されます
   - 手動で選択する必要はありません

2. **`.env.local`は絶対にアップロードされません**
   - `.gitignore`で保護されています
   - 安心して`git add .`を使用できます

3. **`node_modules`も自動的に除外されます**
   - Vercelで自動的にインストールされます

## 🎯 まとめ

**アップロードすべきファイル:**
- ✅ すべてのソースコード（`.ts`, `.tsx`, `.js`ファイル）
- ✅ 設定ファイル（`package.json`, `next.config.js`など）
- ✅ 静的ファイル（`public/`フォルダ）

**アップロードしてはいけないファイル:**
- ❌ `.env.local`（自動的に除外されます）
- ❌ `node_modules/`（自動的に除外されます）

**結論:** `git add .`を実行すれば、適切なファイルが自動的に追加されます！

