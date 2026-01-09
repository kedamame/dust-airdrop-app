# Base Mainnetへのデプロイスクリプト (Hardhat使用)

Write-Host "🚀 Base MainnetにTrashNFTコントラクトをデプロイします..." -ForegroundColor Cyan
Write-Host ""

# 環境変数の確認
if (-not $env:PRIVATE_KEY) {
    Write-Host "❌ エラー: PRIVATE_KEY環境変数が設定されていません" -ForegroundColor Red
    Write-Host "   PowerShellで以下を実行してください:" -ForegroundColor Yellow
    Write-Host "   `$env:PRIVATE_KEY = `"your_private_key_here`"" -ForegroundColor Yellow
    exit 1
}

# Hardhatの確認
if (-not (Get-Command npx -ErrorAction SilentlyContinue)) {
    Write-Host "❌ エラー: npxがインストールされていません" -ForegroundColor Red
    Write-Host "   npm installを実行してください" -ForegroundColor Yellow
    exit 1
}

Write-Host "⚠️  警告: メインネットにデプロイします。本番環境です。" -ForegroundColor Yellow
Write-Host "   続行しますか？ (Y/N): " -ForegroundColor Yellow -NoNewline
$response = Read-Host

if ($response -ne "Y" -and $response -ne "y") {
    Write-Host "デプロイをキャンセルしました" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "📦 コントラクトをデプロイ中..." -ForegroundColor Cyan

# デプロイ実行
$ErrorActionPreference = "Stop"
try {
    npx hardhat run scripts/deploy-hardhat.js --network base
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ デプロイ完了！" -ForegroundColor Green
        Write-Host "📝 コントラクトアドレスを.env.localのNEXT_PUBLIC_TRASH_NFT_ADDRESS_MAINNETに設定してください" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "❌ デプロイに失敗しました" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host ""
    Write-Host "❌ デプロイ中にエラーが発生しました: $_" -ForegroundColor Red
    exit 1
}
