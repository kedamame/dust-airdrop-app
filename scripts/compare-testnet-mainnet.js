const hre = require("hardhat");
require("dotenv").config();

async function main() {
  // テストネットとメインネットのコントラクトアドレス
  const testnetAddress = process.env.NEXT_PUBLIC_TRASH_NFT_ADDRESS_TESTNET || "0x337e73ad59646259a23de2f53798c69b72098116";
  const mainnetAddress = process.env.NEXT_PUBLIC_TRASH_NFT_ADDRESS_MAINNET || "0x111c0519E050F31E8219c13C184DAae75D2a29a7";
  
  console.log("🔍 テストネットとメインネットのコントラクトを詳細比較します...");
  console.log(`🧪 テストネット: ${testnetAddress}`);
  console.log(`🌐 メインネット: ${mainnetAddress}`);
  console.log("");

  const testnetProvider = new hre.ethers.JsonRpcProvider("https://sepolia.base.org");
  const mainnetProvider = new hre.ethers.JsonRpcProvider("https://mainnet.base.org");

  // 基本的なERC721のABI
  const basicABI = [
    "function tokenURI(uint256 tokenId) view returns (string)",
    "function ownerOf(uint256 tokenId) view returns (address)",
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function supportsInterface(bytes4 interfaceId) view returns (bool)",
    "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  ];

  const ERC721_INTERFACE_ID = "0x80ac58cd";
  const ERC721_METADATA_INTERFACE_ID = "0x5b5e139f";
  const ERC721_ENUMERABLE_INTERFACE_ID = "0x780e9d63";

  // テストネットのコントラクトを確認
  console.log("=".repeat(70));
  console.log("🧪 テストネットコントラクト（正常に動作）");
  console.log("=".repeat(70));
  
  try {
    const testnetContract = new hre.ethers.Contract(testnetAddress, basicABI, testnetProvider);
    
    const testnetName = await testnetContract.name();
    const testnetSymbol = await testnetContract.symbol();
    const testnetTotalSupply = await testnetContract.totalSupply();
    const testnetSupportsERC721 = await testnetContract.supportsInterface(ERC721_INTERFACE_ID);
    const testnetSupportsMetadata = await testnetContract.supportsInterface(ERC721_METADATA_INTERFACE_ID);
    const testnetSupportsEnumerable = await testnetContract.supportsInterface(ERC721_ENUMERABLE_INTERFACE_ID);
    
    console.log(`✅ 名前: ${testnetName}`);
    console.log(`✅ シンボル: ${testnetSymbol}`);
    console.log(`✅ 総発行数: ${testnetTotalSupply.toString()}`);
    console.log(`✅ ERC721: ${testnetSupportsERC721}`);
    console.log(`✅ ERC721Metadata: ${testnetSupportsMetadata}`);
    console.log(`✅ ERC721Enumerable: ${testnetSupportsEnumerable}`);
    
    if (testnetTotalSupply > 0n) {
      const tokenId = 0n;
      const testnetTokenURI = await testnetContract.tokenURI(tokenId);
      const testnetOwner = await testnetContract.ownerOf(tokenId);
      
      console.log(`\n📦 Token ID 0:`);
      console.log(`   👤 オーナー: ${testnetOwner}`);
      console.log(`   📄 tokenURI長さ: ${testnetTokenURI.length}文字`);
      
      if (testnetTokenURI.startsWith("data:application/json;base64,")) {
        const base64Json = testnetTokenURI.replace("data:application/json;base64,", "");
        const jsonString = Buffer.from(base64Json, "base64").toString("utf-8");
        const metadata = JSON.parse(jsonString);
        console.log(`   📋 メタデータ名: ${metadata.name}`);
      }
    }
    
    // Transferイベントを確認
    console.log(`\n📡 Transferイベントを確認中...`);
    const testnetFilter = testnetContract.filters.Transfer();
    const testnetEvents = await testnetContract.queryFilter(testnetFilter, 0, "latest");
    console.log(`   ✅ Transferイベント数: ${testnetEvents.length}`);
    if (testnetEvents.length > 0) {
      console.log(`   📝 最新のTransferイベント:`);
      const latestEvent = testnetEvents[testnetEvents.length - 1];
      console.log(`      From: ${latestEvent.args.from}`);
      console.log(`      To: ${latestEvent.args.to}`);
      console.log(`      Token ID: ${latestEvent.args.tokenId.toString()}`);
    }
    
  } catch (error) {
    console.error(`❌ テストネットエラー: ${error.message}`);
  }

  // メインネットのコントラクトを確認
  console.log("\n" + "=".repeat(70));
  console.log("🌐 メインネットコントラクト（404エラー）");
  console.log("=".repeat(70));
  
  try {
    const mainnetContract = new hre.ethers.Contract(mainnetAddress, basicABI, mainnetProvider);
    
    const mainnetName = await mainnetContract.name();
    const mainnetSymbol = await mainnetContract.symbol();
    const mainnetTotalSupply = await mainnetContract.totalSupply();
    const mainnetSupportsERC721 = await mainnetContract.supportsInterface(ERC721_INTERFACE_ID);
    const mainnetSupportsMetadata = await mainnetContract.supportsInterface(ERC721_METADATA_INTERFACE_ID);
    const mainnetSupportsEnumerable = await mainnetContract.supportsInterface(ERC721_ENUMERABLE_INTERFACE_ID);
    
    console.log(`✅ 名前: ${mainnetName}`);
    console.log(`✅ シンボル: ${mainnetSymbol}`);
    console.log(`✅ 総発行数: ${mainnetTotalSupply.toString()}`);
    console.log(`✅ ERC721: ${mainnetSupportsERC721}`);
    console.log(`✅ ERC721Metadata: ${mainnetSupportsMetadata}`);
    console.log(`✅ ERC721Enumerable: ${mainnetSupportsEnumerable}`);
    
    if (mainnetTotalSupply > 0n) {
      const tokenId = 0n;
      const mainnetTokenURI = await mainnetContract.tokenURI(tokenId);
      const mainnetOwner = await mainnetContract.ownerOf(tokenId);
      
      console.log(`\n📦 Token ID 0:`);
      console.log(`   👤 オーナー: ${mainnetOwner}`);
      console.log(`   📄 tokenURI長さ: ${mainnetTokenURI.length}文字`);
      
      if (mainnetTokenURI.startsWith("data:application/json;base64,")) {
        const base64Json = mainnetTokenURI.replace("data:application/json;base64,", "");
        const jsonString = Buffer.from(base64Json, "base64").toString("utf-8");
        const metadata = JSON.parse(jsonString);
        console.log(`   📋 メタデータ名: ${metadata.name}`);
      }
    }
    
    // Transferイベントを確認
    console.log(`\n📡 Transferイベントを確認中...`);
    const mainnetFilter = mainnetContract.filters.Transfer();
    const mainnetEvents = await mainnetContract.queryFilter(mainnetFilter, 0, "latest");
    console.log(`   ✅ Transferイベント数: ${mainnetEvents.length}`);
    if (mainnetEvents.length > 0) {
      console.log(`   📝 最新のTransferイベント:`);
      const latestEvent = mainnetEvents[mainnetEvents.length - 1];
      console.log(`      From: ${latestEvent.args.from}`);
      console.log(`      To: ${latestEvent.args.to}`);
      console.log(`      Token ID: ${latestEvent.args.tokenId.toString()}`);
    }
    
  } catch (error) {
    console.error(`❌ メインネットエラー: ${error.message}`);
  }

  // 比較結果
  console.log("\n" + "=".repeat(70));
  console.log("📊 比較結果と推奨事項");
  console.log("=".repeat(70));
  
  console.log("\n💡 考えられる原因:");
  console.log("   1. Blockscoutのメインネットでのインデックス処理が遅い");
  console.log("   2. メインネットのコントラクトがERC721Enumerableを実装している（テストネットは実装していない）");
  console.log("   3. BlockscoutがメインネットでERC721Enumerableを期待している可能性");
  console.log("   4. メインネットのインデックス処理が完了していない");
  
  console.log("\n🔧 推奨される対応:");
  console.log("   1. コントラクトをERC721Enumerableなしで再デプロイ（既に変更済み）");
  console.log("   2. 時間を置いて再確認（数時間〜1日）");
  console.log("   3. Blockscoutのコントラクトページで確認:");
  console.log(`      https://base.blockscout.com/address/${mainnetAddress}`);
  console.log("   4. トランザクションハッシュから直接確認");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

