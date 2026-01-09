@echo off
REM Base Sepoliaテストネットへのデプロイスクリプト（cmd版）

echo 🚀 Base SepoliaにTrashNFTコントラクトをデプロイします...

REM 環境変数の確認
if "%PRIVATE_KEY%"=="" (
    echo ❌ エラー: PRIVATE_KEY環境変数が設定されていません
    echo    set PRIVATE_KEY=your_private_key_here
    exit /b 1
)

REM デプロイ
echo 📦 コントラクトをデプロイ中...
call npx hardhat run scripts/deploy-hardhat.js --network baseSepolia

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ デプロイ完了！
    echo 📝 コントラクトアドレスを.env.localのNEXT_PUBLIC_TRASH_NFT_ADDRESSに設定してください
) else (
    echo.
    echo ❌ デプロイに失敗しました
    exit /b 1
)



