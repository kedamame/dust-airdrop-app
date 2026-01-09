require("dotenv").config();
const hre = require("hardhat");

async function main() {
  console.log("🚀 TrashNFTコントラクトをデプロイします...");

  // 環境変数の確認
  if (!process.env.PRIVATE_KEY) {
    console.error("❌ エラー: PRIVATE_KEY環境変数が設定されていません");
    console.error("   cmdの場合: set PRIVATE_KEY=your_private_key_here");
    console.error("   PowerShellの場合: $env:PRIVATE_KEY = 'your_private_key_here'");
    process.exit(1);
  }

  // PRIVATE_KEYの形式確認（0xなしで64文字、または0x付きで66文字）
  const privateKey = process.env.PRIVATE_KEY.trim();
  if (privateKey.length !== 64 && privateKey.length !== 66) {
    console.error("❌ エラー: PRIVATE_KEYの形式が正しくありません");
    console.error("   64文字の16進数（0xなし）または66文字（0x付き）である必要があります");
    console.error(`   現在の長さ: ${privateKey.length}文字`);
    console.error("");
    console.error("📝 正しい形式の例:");
    console.error("   64文字（0xなし）: 1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef");
    console.error("   66文字（0x付き）: 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef");
    console.error("");
    console.error("💡 設定方法:");
    console.error("   cmdの場合:");
    console.error("     set PRIVATE_KEY=your_64_character_hex_string");
    console.error("   PowerShellの場合:");
    console.error("     $env:PRIVATE_KEY = 'your_64_character_hex_string'");
    console.error("");
    console.error("⚠️  注意: MetaMaskから秘密鍵をエクスポートする場合は、");
    console.error("   「アカウントの詳細」→「秘密鍵をエクスポート」から取得できます。");
    console.error("   秘密鍵は64文字の16進数です（0xは含まれません）。");
    process.exit(1);
  }
  
  // 16進数の形式チェック
  const hexPattern = /^[0-9a-fA-F]+$/;
  const hexWithoutPrefix = privateKey.startsWith("0x") ? privateKey.slice(2) : privateKey;
  if (!hexPattern.test(hexWithoutPrefix)) {
    console.error("❌ エラー: PRIVATE_KEYは16進数のみで構成されている必要があります");
    console.error("   0-9、a-f、A-Fの文字のみが許可されています");
    console.error(`   現在の値（最初の10文字）: ${privateKey.slice(0, 10)}...`);
    process.exit(1);
  }

  // ウォレットの確認
  const signers = await hre.ethers.getSigners();
  if (signers.length === 0) {
    console.error("❌ エラー: 署名者が見つかりません");
    console.error("   hardhat.config.jsのaccounts設定を確認してください");
    console.error(`   PRIVATE_KEYの値: ${privateKey.slice(0, 10)}...${privateKey.slice(-4)}`);
    process.exit(1);
  }

  const [deployer] = signers;
  if (!deployer || !deployer.address) {
    console.error("❌ エラー: デプロイアカウントを取得できませんでした");
    process.exit(1);
  }

  console.log("📝 デプロイアカウント:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 残高:", hre.ethers.formatEther(balance), "ETH");
  
  if (balance === 0n) {
    console.warn("⚠️  警告: 残高が0です。テストネット用ETHが必要です。");
    console.warn("   Faucet: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet");
  }

  // コントラクトを取得
  const TrashNFT = await hre.ethers.getContractFactory("TrashNFT");
  
  // デプロイ
  console.log("📦 コントラクトをデプロイ中...");
  const trashNFT = await TrashNFT.deploy();
  
  // デプロイ完了を待つ
  await trashNFT.waitForDeployment();
  
  const address = await trashNFT.getAddress();
  console.log("");
  console.log("✅ デプロイ完了！");
  console.log("📝 コントラクトアドレス:", address);
  console.log("");
  console.log("🔗 ブロックエクスプローラー:");
  if (hre.network.name === "baseSepolia") {
    console.log(`   https://sepolia.basescan.org/address/${address}`);
  } else if (hre.network.name === "base") {
    console.log(`   https://basescan.org/address/${address}`);
  }
  console.log("");
  console.log("📋 .env.localファイルを更新してください:");
  if (hre.network.name === "baseSepolia") {
    console.log(`   NEXT_PUBLIC_TRASH_NFT_ADDRESS_TESTNET=${address}`);
  } else if (hre.network.name === "base") {
    console.log(`   NEXT_PUBLIC_TRASH_NFT_ADDRESS_MAINNET=${address}`);
  } else {
    console.log(`   NEXT_PUBLIC_TRASH_NFT_ADDRESS=${address}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
