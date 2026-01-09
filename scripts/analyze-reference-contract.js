const hre = require("hardhat");

async function main() {
  // 参考コントラクトアドレス（テストネット）
  const referenceAddress = "0x337e73ad59646259a23de2f53798c69b72098116";
  const tokenId = 1;
  
  console.log("🔍 参考コントラクトを分析します...");
  console.log(`📝 コントラクトアドレス: ${referenceAddress}`);
  console.log(`📦 Token ID: ${tokenId}`);
  console.log("");

  const provider = new hre.ethers.JsonRpcProvider("https://sepolia.base.org");

  // 基本的なERC721のABI（tokenURI、ownerOf、name、symbol、totalSupplyなど）
  const basicABI = [
    "function tokenURI(uint256 tokenId) view returns (string)",
    "function ownerOf(uint256 tokenId) view returns (address)",
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function supportsInterface(bytes4 interfaceId) view returns (bool)",
  ];

  try {
    const contract = new hre.ethers.Contract(referenceAddress, basicABI, provider);

    // 基本情報を取得
    console.log("=".repeat(60));
    console.log("📋 基本情報");
    console.log("=".repeat(60));
    
    try {
      const name = await contract.name();
      console.log(`✅ 名前: ${name}`);
    } catch (e) {
      console.log(`⚠️  名前: 取得できませんでした`);
    }

    try {
      const symbol = await contract.symbol();
      console.log(`✅ シンボル: ${symbol}`);
    } catch (e) {
      console.log(`⚠️  シンボル: 取得できませんでした`);
    }

    try {
      const totalSupply = await contract.totalSupply();
      console.log(`✅ 総発行数: ${totalSupply.toString()}`);
    } catch (e) {
      console.log(`⚠️  総発行数: 取得できませんでした`);
    }

    // ERC165インターフェースIDを確認
    const ERC721_INTERFACE_ID = "0x80ac58cd";
    const ERC721_METADATA_INTERFACE_ID = "0x5b5e139f";
    const ERC721_ENUMERABLE_INTERFACE_ID = "0x780e9d63";
    
    try {
      const supportsERC721 = await contract.supportsInterface(ERC721_INTERFACE_ID);
      const supportsMetadata = await contract.supportsInterface(ERC721_METADATA_INTERFACE_ID);
      const supportsEnumerable = await contract.supportsInterface(ERC721_ENUMERABLE_INTERFACE_ID);
      
      console.log(`✅ ERC721: ${supportsERC721}`);
      console.log(`✅ ERC721Metadata: ${supportsMetadata}`);
      console.log(`✅ ERC721Enumerable: ${supportsEnumerable}`);
    } catch (e) {
      console.log(`⚠️  ERC165: 確認できませんでした`);
    }

    // tokenURIを取得
    console.log("\n" + "=".repeat(60));
    console.log("📦 Token URI の詳細");
    console.log("=".repeat(60));
    
    try {
      const owner = await contract.ownerOf(tokenId);
      console.log(`👤 オーナー: ${owner}`);
    } catch (e) {
      console.log(`❌ オーナー取得エラー: ${e.message}`);
    }

    try {
      const tokenURI = await contract.tokenURI(tokenId);
      console.log(`✅ tokenURI取得成功 (長さ: ${tokenURI.length}文字)`);
      console.log(`📄 URI形式: ${tokenURI.substring(0, 50)}...`);
      
      if (tokenURI.startsWith("data:application/json;base64,")) {
        const base64Json = tokenURI.replace("data:application/json;base64,", "");
        const jsonString = Buffer.from(base64Json, "base64").toString("utf-8");
        
        try {
          const metadata = JSON.parse(jsonString);
          
          console.log("\n📋 メタデータ:");
          console.log(`   名前: ${metadata.name}`);
          console.log(`   説明: ${metadata.description?.substring(0, 80)}...`);
          
          // 必須フィールドを確認
          const requiredFields = ['name', 'description', 'image'];
          const missingFields = requiredFields.filter(field => !metadata[field]);
          
          if (missingFields.length > 0) {
            console.log(`   ⚠️  不足しているフィールド: ${missingFields.join(', ')}`);
          } else {
            console.log(`   ✅ 必須フィールドがすべて存在`);
          }
          
          // 画像を確認
          if (metadata.image) {
            console.log(`\n🖼️  画像情報:`);
            console.log(`   形式: ${metadata.image.substring(0, 50)}...`);
            
            if (metadata.image.startsWith("data:image/svg+xml;base64,")) {
              const base64Svg = metadata.image.replace("data:image/svg+xml;base64,", "");
              const svgString = Buffer.from(base64Svg, "base64").toString("utf-8");
              
              console.log(`   ✅ SVG形式 (${svgString.length}文字)`);
              
              // SVGの基本構造を確認
              if (svgString.includes("<?xml")) {
                console.log(`   ✅ XML宣言あり`);
              }
              if (svgString.includes("<svg")) {
                console.log(`   ✅ SVG要素あり`);
              }
              if (svgString.includes("xmlns")) {
                console.log(`   ✅ xmlns属性あり`);
              }
              if (svgString.includes("viewBox")) {
                console.log(`   ✅ viewBox属性あり`);
              }
              
              // SVGの最初の200文字を表示
              console.log(`\n   📄 SVGの最初の200文字:`);
              console.log(`   ${svgString.substring(0, 200)}...`);
            } else if (metadata.image.startsWith("data:image/svg+xml,")) {
              // URLエンコードされたSVG
              const svgEncoded = metadata.image.replace("data:image/svg+xml,", "");
              const svgString = decodeURIComponent(svgEncoded);
              console.log(`   ✅ SVG形式（URLエンコード） (${svgString.length}文字)`);
              console.log(`\n   📄 SVGの最初の200文字:`);
              console.log(`   ${svgString.substring(0, 200)}...`);
            } else {
              console.log(`   ⚠️  予期しない画像形式`);
            }
          }
          
          // 属性を確認
          if (metadata.attributes && Array.isArray(metadata.attributes)) {
            console.log(`\n📊 属性: ${metadata.attributes.length}個`);
            metadata.attributes.forEach((attr, index) => {
              console.log(`   ${index + 1}. ${attr.trait_type}: ${attr.value}`);
            });
          }
          
        } catch (parseError) {
          console.log(`❌ JSON解析エラー: ${parseError.message}`);
          console.log(`📄 JSON内容（最初の500文字）:`);
          console.log(jsonString.substring(0, 500));
        }
      } else if (tokenURI.startsWith("http")) {
        console.log(`📡 HTTP URL形式: ${tokenURI}`);
      } else if (tokenURI.startsWith("ipfs://")) {
        console.log(`🌐 IPFS形式: ${tokenURI}`);
      } else {
        console.log(`⚠️  予期しないURI形式`);
        console.log(`📄 内容（最初の200文字）: ${tokenURI.substring(0, 200)}...`);
      }
      
    } catch (e) {
      console.error(`❌ tokenURI取得エラー: ${e.message}`);
    }

    console.log("\n" + "=".repeat(60));
    console.log("🔗 Blockscoutリンク");
    console.log("=".repeat(60));
    console.log(`https://base-sepolia.blockscout.com/token/${referenceAddress}/instance/${tokenId}`);

  } catch (error) {
    console.error("❌ エラー:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

