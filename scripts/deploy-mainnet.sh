#!/bin/bash

# Base Mainnetへのデプロイスクリプト (Foundry使用)

echo "🚀 Base MainnetにTrashNFTコントラクトをデプロイします..."
echo ""

# 環境変数の確認
if [ -z "$PRIVATE_KEY" ]; then
  echo "❌ エラー: PRIVATE_KEY環境変数が設定されていません"
  echo "   export PRIVATE_KEY=your_private_key_here"
  exit 1
fi

# Foundryの確認
if ! command -v forge &> /dev/null; then
  echo "❌ エラー: Foundryがインストールされていません"
  echo "   curl -L https://foundry.paradigm.xyz | bash"
  echo "   foundryup"
  exit 1
fi

echo "⚠️  警告: メインネットにデプロイします。本番環境です。"
echo "   続行しますか？ (Y/N): "
read -r response

if [ "$response" != "Y" ] && [ "$response" != "y" ]; then
  echo "デプロイをキャンセルしました"
  exit 0
fi

echo ""
echo "📦 コントラクトをデプロイ中..."

# デプロイ実行
forge create contracts/TrashNFT.sol:TrashNFT \
  --rpc-url https://mainnet.base.org \
  --private-key $PRIVATE_KEY \
  --constructor-args "" \
  --chain base \
  --verify

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ デプロイ完了！"
  echo "📝 コントラクトアドレスを.env.localのNEXT_PUBLIC_TRASH_NFT_ADDRESS_MAINNETに設定してください"
else
  echo ""
  echo "❌ デプロイに失敗しました"
  exit 1
fi

