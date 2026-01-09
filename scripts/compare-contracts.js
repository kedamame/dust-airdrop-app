const hre = require("hardhat");
require("dotenv").config();

async function main() {
  // テストネットとメインネットのコントラクトアドレス
  const testnetAddress = process.env.NEXT_PUBLIC_TRASH_NFT_ADDRESS_TESTNET || "0x0000000000000000000000000000000000000000";
  const mainnetAddress = process.env.NEXT_PUBLIC_TRASH_NFT_ADDRESS_MAINNET || "0x111c0519E050F31E8219c13C184DAae75D2a29a7";
  
  console.log("🔍 テストネットとメインネットのコントラクトを比較します...");
  console.log(`📝 テストネット: ${testnetAddress}`);
  console.log(`📝 メインネット: ${mainnetAddress}`);
  console.log("");

  const provider = hre.ethers.provider;
  const contractArtifact = await hre.artifacts.readArtifact("TrashNFT");

  // テストネットのコントラクトを確認
  if (testnetAddress !== "0x0000000000000000000000000000000000000000") {
    console.log("=".repeat(60));
    console.log("🧪 テストネットコントラクトの確認");
    console.log("=".repeat(60));
    
    try {
      // テストネットのプロバイダーに接続
      const testnetProvider = new hre.ethers.JsonRpcProvider("https://sepolia.base.org");
      const testnetContract = new hre.ethers.Contract(testnetAddress, contractArtifact.abi, testnetProvider);
      
      // ERC165インターフェースIDを確認
      const ERC721_INTERFACE_ID = "0x80ac58cd";
      const ERC721_METADATA_INTERFACE_ID = "0x5b5e139f";
      const ERC721_ENUMERABLE_INTERFACE_ID = "0x780e9d63";
      
      const testnetSupportsERC721 = await testnetContract.supportsInterface(ERC721_INTERFACE_ID);
      const testnetSupportsMetadata = await testnetContract.supportsInterface(ERC721_METADATA_INTERFACE_ID);
      const testnetSupportsEnumerable = await testnetContract.supportsInterface(ERC721_ENUMERABLE_INTERFACE_ID);
      
      console.log(`✅ ERC721: ${testnetSupportsERC721}`);
      console.log(`✅ ERC721Metadata: ${testnetSupportsMetadata}`);
      console.log(`✅ ERC721Enumerable: ${testnetSupportsEnumerable}`);
      
      const testnetTotalSupply = await testnetContract.totalSupply();
      console.log(`📊 総発行数: ${testnetTotalSupply.toString()}`);
      
      if (testnetTotalSupply > 0n) {
        const tokenId = 0n;
        const tokenURI = await testnetContract.tokenURI(tokenId);
        console.log(`✅ tokenURI取得成功 (長さ: ${tokenURI.length}文字)`);
        
        if (tokenURI.startsWith("data:application/json;base64,")) {
          const base64Json = tokenURI.replace("data:application/json;base64,", "");
          const jsonString = Buffer.from(base64Json, "base64").toString("utf-8");
          const metadata = JSON.parse(jsonString);
          console.log(`📋 メタデータ名: ${metadata.name}`);
          
          if (metadata.image && metadata.image.startsWith("data:image/svg+xml;base64,")) {
            const base64Svg = metadata.image.replace("data:image/svg+xml;base64,", "");
            const svgString = Buffer.from(base64Svg, "base64").toString("utf-8");
            console.log(`✅ SVG画像: ${svgString.length}文字`);
          }
        }
      }
      
      console.log(`🔗 Blockscout: https://base-sepolia.blockscout.com/token/${testnetAddress}`);
      
    } catch (error) {
      console.error(`❌ テストネットエラー: ${error.message}`);
    }
  } else {
    console.log("⚠️  テストネットのコントラクトアドレスが設定されていません");
  }

  console.log("\n" + "=".repeat(60));
  console.log("🌐 メインネットコントラクトの確認");
  console.log("=".repeat(60));
  
  try {
    // メインネットのプロバイダーに接続
    const mainnetProvider = new hre.ethers.JsonRpcProvider("https://mainnet.base.org");
    const mainnetContract = new hre.ethers.Contract(mainnetAddress, contractArtifact.abi, mainnetProvider);
    
    // ERC165インターフェースIDを確認
    const ERC721_INTERFACE_ID = "0x80ac58cd";
    const ERC721_METADATA_INTERFACE_ID = "0x5b5e139f";
    const ERC721_ENUMERABLE_INTERFACE_ID = "0x780e9d63";
    
    const mainnetSupportsERC721 = await mainnetContract.supportsInterface(ERC721_INTERFACE_ID);
    const mainnetSupportsMetadata = await mainnetContract.supportsInterface(ERC721_METADATA_INTERFACE_ID);
    const mainnetSupportsEnumerable = await mainnetContract.supportsInterface(ERC721_ENUMERABLE_INTERFACE_ID);
    
    console.log(`✅ ERC721: ${mainnetSupportsERC721}`);
    console.log(`✅ ERC721Metadata: ${mainnetSupportsMetadata}`);
    console.log(`✅ ERC721Enumerable: ${mainnetSupportsEnumerable}`);
    
    const mainnetTotalSupply = await mainnetContract.totalSupply();
    console.log(`📊 総発行数: ${mainnetTotalSupply.toString()}`);
    
    if (mainnetTotalSupply > 0n) {
      const tokenId = 0n;
      const tokenURI = await mainnetContract.tokenURI(tokenId);
      console.log(`✅ tokenURI取得成功 (長さ: ${tokenURI.length}文字)`);
      
      if (tokenURI.startsWith("data:application/json;base64,")) {
        const base64Json = tokenURI.replace("data:application/json;base64,", "");
        const jsonString = Buffer.from(base64Json, "base64").toString("utf-8");
        const metadata = JSON.parse(jsonString);
        console.log(`📋 メタデータ名: ${metadata.name}`);
        
        if (metadata.image && metadata.image.startsWith("data:image/svg+xml;base64,")) {
          const base64Svg = metadata.image.replace("data:image/svg+xml;base64,", "");
          const svgString = Buffer.from(base64Svg, "base64").toString("utf-8");
          console.log(`✅ SVG画像: ${svgString.length}文字`);
        }
      }
    }
    
    console.log(`🔗 Blockscout: https://base.blockscout.com/token/${mainnetAddress}`);
    
  } catch (error) {
    console.error(`❌ メインネットエラー: ${error.message}`);
  }

  console.log("\n" + "=".repeat(60));
  console.log("📊 比較結果");
  console.log("=".repeat(60));
  
  console.log("\n💡 結論:");
  console.log("   テストネットとメインネットで同じコントラクトコードを使用している場合、");
  console.log("   実装は同じになります。");
  console.log("\n   ただし、以下の点に注意してください:");
  console.log("   1. コントラクトアドレスは異なります（別々のネットワーク）");
  console.log("   2. ミントされたNFTは別々に存在します");
  console.log("   3. Blockscoutのインデックス処理は別々に行われます");
  console.log("   4. メインネットのインデックス処理には時間がかかる場合があります");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

