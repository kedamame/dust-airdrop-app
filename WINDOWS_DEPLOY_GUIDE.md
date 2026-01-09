# 🪟 Windowsでのメインネットデプロイガイド

## 前提条件

- Node.jsがインストールされていること
- メインネット用のETHがウォレットにあること（ガス代として）
- プライベートキーを準備していること

## 方法1: PowerShellを使用（推奨）

### ステップ1: PowerShellを開く

1. Windowsキーを押す
2. 「PowerShell」と入力
3. 「Windows PowerShell」を選択（管理者権限は不要）

### ステップ2: プロジェクトフォルダに移動

```powershell
cd "C:\Users\kaexr\OneDrive\デスクトップ\Baseapp\DustAirdropApp"
```

※ 実際のフォルダパスに合わせて変更してください

### ステップ3: プライベートキーを設定

```powershell
$env:PRIVATE_KEY = "your_private_key_here"
```

**⚠️ 重要:**
- `your_private_key_here`の部分を実際のプライベートキーに置き換えてください
- プライベートキーは64文字の16進数（0xなし）または66文字（0x付き）です
- 例: `$env:PRIVATE_KEY = "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"`

### ステップ4: デプロイスクリプトを実行

#### Hardhatを使用する場合（推奨）

```powershell
.\scripts\deploy-mainnet-hardhat.ps1
```

#### Foundryを使用する場合

```powershell
.\scripts\deploy-mainnet.ps1
```

### ステップ5: 確認プロンプトに「Y」と入力

スクリプトが実行されると、以下のような確認プロンプトが表示されます：

```
⚠️  警告: メインネットにデプロイします。本番環境です。
   続行しますか？ (Y/N):
```

「Y」と入力してEnterキーを押してください。

### ステップ6: デプロイ結果を確認

デプロイが成功すると、以下のような出力が表示されます：

```
✅ デプロイ完了！
📝 コントラクトアドレスを.env.localのNEXT_PUBLIC_TRASH_NFT_ADDRESS_MAINNETに設定してください
```

コントラクトアドレス（`0x`で始まる42文字の文字列）をメモしてください。

### ステップ7: 環境変数を設定

`.env.local`ファイルを開いて、以下のように設定：

```env
# テストネット用（既存）
NEXT_PUBLIC_TRASH_NFT_ADDRESS_TESTNET=0xYourTestnetContractAddress

# メインネット用（新しくデプロイしたアドレス）
NEXT_PUBLIC_TRASH_NFT_ADDRESS_MAINNET=0xYourMainnetContractAddress
```

## 方法2: コマンドプロンプトを使用

### ステップ1: コマンドプロンプトを開く

1. Windowsキーを押す
2. 「cmd」と入力
3. 「コマンドプロンプト」を選択

### ステップ2: プロジェクトフォルダに移動

```cmd
cd "C:\Users\kaexr\OneDrive\デスクトップ\Baseapp\DustAirdropApp"
```

### ステップ3: プライベートキーを設定

```cmd
set PRIVATE_KEY=your_private_key_here
```

**⚠️ 重要:**
- `your_private_key_here`の部分を実際のプライベートキーに置き換えてください
- 例: `set PRIVATE_KEY=1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef`

### ステップ4: デプロイスクリプトを実行

```cmd
scripts\deploy-mainnet-hardhat.bat
```

### ステップ5以降

PowerShellの場合と同じです。

## 方法3: 手動でデプロイ（スクリプトを使わない場合）

### PowerShellの場合

```powershell
# 1. プライベートキーを設定
$env:PRIVATE_KEY = "your_private_key_here"

# 2. Hardhatでデプロイ
npx hardhat run scripts/deploy-hardhat.js --network base
```

### コマンドプロンプトの場合

```cmd
REM 1. プライベートキーを設定
set PRIVATE_KEY=your_private_key_here

REM 2. Hardhatでデプロイ
npx hardhat run scripts/deploy-hardhat.js --network base
```

## トラブルシューティング

### エラー: "PRIVATE_KEY環境変数が設定されていません"

**原因:** 環境変数が正しく設定されていない

**解決方法:**
1. 新しいPowerShell/コマンドプロンプトウィンドウを開く
2. 再度環境変数を設定
3. デプロイスクリプトを実行

### エラー: "npx が見つかりません"

**原因:** Node.jsがインストールされていない、またはPATHに含まれていない

**解決方法:**
1. Node.jsをインストール: https://nodejs.org/
2. インストール後、新しいPowerShell/コマンドプロンプトウィンドウを開く
3. `node --version`でインストールを確認

### エラー: "残高が0です"

**原因:** Base Mainnet用のETHが不足している

**解決方法:**
1. ウォレットにBase Mainnet用のETHがあるか確認
2. ガス代として十分なETHが必要です（通常0.001 ETH程度）

### エラー: "スクリプトの実行が無効になっています"

**PowerShellの場合:**

```powershell
# 実行ポリシーを確認
Get-ExecutionPolicy

# 実行ポリシーを変更（現在のセッションのみ）
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
```

または、スクリプトを直接実行せず、手動でコマンドを実行：

```powershell
$env:PRIVATE_KEY = "your_private_key_here"
npx hardhat run scripts/deploy-hardhat.js --network base
```

## プライベートキーの取得方法

### MetaMaskから取得する場合

1. MetaMaskを開く
2. 右上のアカウントアイコンをクリック
3. 「アカウントの詳細」を選択
4. 「秘密鍵をエクスポート」をクリック
5. パスワードを入力
6. 表示された秘密鍵をコピー

**⚠️ 重要:**
- プライベートキーは絶対に他人に共有しないでください
- スクリーンショットを取らないでください
- 安全な場所に保管してください

## デプロイ後の確認

1. デプロイが成功したら、コントラクトアドレスをメモ
2. `.env.local`ファイルに`NEXT_PUBLIC_TRASH_NFT_ADDRESS_MAINNET`を設定
3. アプリケーションを再起動
4. UI上の「メインネット」ボタンをクリック
5. ウォレットを接続して動作確認

## 参考リンク

- [Base Mainnet Explorer](https://basescan.org)
- [Hardhat公式ドキュメント](https://hardhat.org/docs)

