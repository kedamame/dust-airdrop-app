#!/bin/bash

# Base Sepoliaテストネットへのデプロイスクリプト

echo "🚀 Base SepoliaにTrashNFTコントラクトをデプロイします..."

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
  exit 1
fi

# デプロイ
forge create contracts/TrashNFT.sol:TrashNFT \
  --rpc-url https://sepolia.base.org \
  --private-key $PRIVATE_KEY \
  --constructor-args "" \
  --chain base-sepolia \
  --verify

echo ""
echo "✅ デプロイ完了！"
echo "📝 コントラクトアドレスを.env.localのNEXT_PUBLIC_TRASH_NFT_ADDRESSに設定してください"






