@echo off
REM Base Mainnetへのデプロイスクリプト (Hardhat使用)

echo 🚀 Base MainnetにTrashNFTコントラクトをデプロイします...
echo.

REM 環境変数の確認
if "%PRIVATE_KEY%"=="" (
    echo ❌ エラー: PRIVATE_KEY環境変数が設定されていません
    echo   コマンドプロンプトで以下を実行してください:
    echo   set PRIVATE_KEY=your_private_key_here
    exit /b 1
)

echo ⚠️  警告: メインネットにデプロイします。本番環境です。
echo    続行しますか？ (Y/N):
set /p response=

if /i not "%response%"=="Y" (
    echo デプロイをキャンセルしました
    exit /b 0
)

echo.
echo 📦 コントラクトをデプロイ中...

REM デプロイ実行
npx hardhat run scripts/deploy-hardhat.js --network base

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ デプロイ完了！
    echo 📝 コントラクトアドレスを.env.localのNEXT_PUBLIC_TRASH_NFT_ADDRESS_MAINNETに設定してください
) else (
    echo.
    echo ❌ デプロイに失敗しました
    exit /b 1
)

