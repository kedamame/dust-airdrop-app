# 🚀 Vercelデプロイ（超簡単版）

## 必要なもの
- GitHubアカウント（無料）
- Vercelアカウント（無料）

## 手順

### 1. GitHubにコードをアップロード

#### 方法1: GitHub Desktopを使う（おすすめ）

1. https://desktop.github.com からダウンロード
2. インストールして起動
3. GitHubにログイン
4. 「File」→「Add Local Repository」
5. このプロジェクトのフォルダを選択
6. 左下で「Commit to main」をクリック
7. 「Publish repository」をクリック

#### 方法2: ウェブでアップロード

1. https://github.com にログイン
2. 右上の「+」→「New repository」
3. リポジトリ名を入力（例：`dust-airdrop-app`）
4. 「Create repository」をクリック
5. 「uploading an existing file」をクリック
6. このプロジェクトのフォルダ内のファイルをすべてドラッグ&ドロップ
7. 「Commit changes」をクリック

### 2. Vercelでデプロイ

1. https://vercel.com にアクセス
2. 「Sign Up」→「Continue with GitHub」でログイン
3. 「Add New...」→「Project」をクリック
4. 作成したGitHubリポジトリを選択
5. 「Import」をクリック

### 3. 環境変数を設定

1. 「Environment Variables」をクリック
2. 以下の3つを追加：

```
名前: NEXT_PUBLIC_USE_TESTNET
値: false
```

```
名前: NEXT_PUBLIC_TRASH_NFT_ADDRESS_MAINNET
値: 0x6De78096eaa28f50Ded407F60A21a0803A75326B
```

```
名前: NEXT_PUBLIC_TRASH_NFT_ADDRESS_TESTNET
値: あなたのテストネットのコントラクトアドレス（あれば）
```

3. 各環境変数を追加したら「Add」をクリック

### 4. デプロイ実行

1. 「Deploy」ボタンをクリック
2. 数分待つ（ビルドが完了するまで）
3. 「Ready」と表示されたら完了！

### 5. 確認

1. 表示されたURL（例：`https://your-project.vercel.app`）をクリック
2. サイトが表示されれば成功！

## 完了！

これで世界中からアクセスできるようになりました🎉

## 困ったときは

- ビルドエラーが出たら、エラーメッセージを読む
- 環境変数は必ず`NEXT_PUBLIC_`で始める
- エラーが出たら、Vercelのビルドログを確認

