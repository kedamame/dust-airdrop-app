# 🔧 Hardhatとは？

## 概要

**Hardhat**は、Ethereum（およびEVM互換チェーン）用の開発環境です。JavaScript/TypeScriptで書かれたスマートコントラクトの開発、テスト、デプロイを支援するツールです。

## Hardhatの主な機能

### 1. **コントラクトのコンパイル**
- Solidityコードをコンパイルして、ブロックチェーンにデプロイ可能な形式に変換
- エラーチェックや最適化も実行

### 2. **ローカル開発環境**
- ローカルでブロックチェーンネットワークを起動してテスト可能
- ガス代がかからないので、開発中に便利

### 3. **デプロイ機能**
- テストネットやメインネットにコントラクトをデプロイ
- デプロイスクリプトを書いて自動化可能

### 4. **テスト機能**
- JavaScript/TypeScriptでコントラクトのテストを書ける
- テストネットにデプロイする前に、ローカルで動作確認

### 5. **デバッグ機能**
- エラーが発生した際の詳細な情報を表示
- スタックトレースやガス使用量の分析

## このプロジェクトでの使用

このプロジェクトでは、Hardhatを以下の目的で使用しています：

### 1. コントラクトのデプロイ

`scripts/deploy-hardhat.js`というスクリプトで、TrashNFTコントラクトをデプロイします。

```bash
# テストネットにデプロイ
npx hardhat run scripts/deploy-hardhat.js --network baseSepolia

# メインネットにデプロイ
npx hardhat run scripts/deploy-hardhat.js --network base
```

### 2. 設定ファイル

`hardhat.config.js`で、以下の設定を行っています：

- **Solidityのバージョン**: 0.8.20
- **ネットワーク設定**: Base Sepolia（テストネット）とBase Mainnet（メインネット）
- **最適化設定**: ガス代を削減するための最適化

### 3. インストール状況

`package.json`に含まれています：

```json
{
  "devDependencies": {
    "hardhat": "^2.22.0",
    "@nomicfoundation/hardhat-toolbox": "^6.1.0"
  }
}
```

## HardhatとFoundryの違い

このプロジェクトでは、**Hardhat**と**Foundry**の両方のデプロイ方法をサポートしています。

### Hardhat（このプロジェクトで使用中）

**メリット:**
- ✅ JavaScript/TypeScriptで書ける（Web開発者に馴染みやすい）
- ✅ 豊富なプラグインと統合
- ✅ 詳細なエラーメッセージ
- ✅ 既にインストール済み（npm経由）

**デメリット:**
- ❌ やや重い（Node.jsベース）
- ❌ コンパイルがやや遅い

### Foundry（別の選択肢）

**メリット:**
- ✅ 非常に高速（Rustベース）
- ✅ 軽量
- ✅ Solidityでテストを書ける

**デメリット:**
- ❌ 別途インストールが必要
- ❌ 学習曲線がやや高い

## 使い方

### 基本的な使い方

1. **コントラクトをコンパイル**
```bash
npx hardhat compile
```

2. **テストを実行**
```bash
npx hardhat test
```

3. **デプロイ**
```bash
npx hardhat run scripts/deploy-hardhat.js --network baseSepolia
```

### このプロジェクトでの推奨方法

**Windows (PowerShell):**
```powershell
# プライベートキーを設定
$env:PRIVATE_KEY = "your_private_key_here"

# デプロイスクリプトを実行
.\scripts\deploy-mainnet-hardhat.ps1
```

**Mac/Linux:**
```bash
export PRIVATE_KEY=your_private_key_here
npx hardhat run scripts/deploy-hardhat.js --network base
```

## まとめ

- **Hardhat** = Ethereum開発用のツール
- このプロジェクトでは、コントラクトのデプロイに使用
- 既にインストール済みなので、すぐに使える
- デプロイスクリプトが用意されているので、簡単にデプロイ可能

詳細は以下のドキュメントを参照：
- `HARDHAT_DEPLOY.md` - Hardhatを使ったデプロイガイド
- `MAINNET_DEPLOY.md` - メインネットデプロイガイド

