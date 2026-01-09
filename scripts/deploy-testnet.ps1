# Base Sepoliaテストネットへのデプロイスクリプト（PowerShell版）

Write-Host "🚀 Base SepoliaにTrashNFTコントラクトをデプロイします..." -ForegroundColor Cyan

# 環境変数の確認
if (-not $env:PRIVATE_KEY) {
    Write-Host "❌ エラー: PRIVATE_KEY環境変数が設定されていません" -ForegroundColor Red
    Write-Host "   `$env:PRIVATE_KEY = 'your_private_key_here'" -ForegroundColor Yellow
    exit 1
}

# Foundryの確認
if (-not (Get-Command forge -ErrorAction SilentlyContinue)) {
    Write-Host "❌ エラー: Foundryがインストールされていません" -ForegroundColor Red
    Write-Host "   curl -L https://foundry.paradigm.xyz | bash" -ForegroundColor Yellow
    exit 1
}

# デプロイ
Write-Host "📦 コントラクトをデプロイ中..." -ForegroundColor Yellow
forge create contracts/TrashNFT.sol:TrashNFT `
  --rpc-url https://sepolia.base.org `
  --private-key $env:PRIVATE_KEY `
  --constructor-args "" `
  --chain base-sepolia

Write-Host ""
Write-Host "✅ デプロイ完了！" -ForegroundColor Green
Write-Host "📝 コントラクトアドレスを.env.localのNEXT_PUBLIC_TRASH_NFT_ADDRESSに設定してください" -ForegroundColor Cyan






