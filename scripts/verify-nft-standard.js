const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const contractAddress = process.env.NEXT_PUBLIC_TRASH_NFT_ADDRESS_MAINNET || "0x111c0519E050F31E8219c13C184DAae75D2a29a7";
  
  console.log("🔍 NFTコントラクトのERC721標準準拠を確認します...");
  console.log(`📝 コントラクトアドレス: ${contractAddress}`);
  console.log("");

  const provider = hre.ethers.provider;
  const contractArtifact = await hre.artifacts.readArtifact("TrashNFT");
  const contract = new hre.ethers.Contract(contractAddress, contractArtifact.abi, provider);

  try {
    // ERC165インターフェースIDを確認
    const ERC721_INTERFACE_ID = "0x80ac58cd";
    const ERC721_METADATA_INTERFACE_ID = "0x5b5e139f";
    const ERC721_ENUMERABLE_INTERFACE_ID = "0x780e9d63";
    
    const supportsERC721 = await contract.supportsInterface(ERC721_INTERFACE_ID);
    const supportsMetadata = await contract.supportsInterface(ERC721_METADATA_INTERFACE_ID);
    const supportsEnumerable = await contract.supportsInterface(ERC721_ENUMERABLE_INTERFACE_ID);
    
    console.log(`✅ ERC721 (0x80ac58cd): ${supportsERC721}`);
    console.log(`✅ ERC721Metadata (0x5b5e139f): ${supportsMetadata}`);
    console.log(`✅ ERC721Enumerable (0x780e9d63): ${supportsEnumerable}`);
    console.log("");

    // 総発行数を確認
    const totalSupply = await contract.totalSupply();
    console.log(`📊 総発行数: ${totalSupply.toString()}`);

    if (totalSupply === 0n) {
      console.log("⚠️  まだNFTがミントされていません");
      return;
    }

    // 各NFTを詳細に確認
    for (let i = 0; i < totalSupply && i < 5; i++) {
      const tokenId = BigInt(i);
      console.log(`\n📦 Token ID: ${tokenId.toString()}`);
      console.log("─".repeat(50));

      try {
        // オーナーを確認
        const owner = await contract.ownerOf(tokenId);
        console.log(`  👤 オーナー: ${owner}`);

        // tokenURIを確認
        const tokenURI = await contract.tokenURI(tokenId);
        console.log(`  ✅ tokenURI取得成功 (長さ: ${tokenURI.length}文字)`);
        
        if (tokenURI.startsWith("data:application/json;base64,")) {
          const base64Json = tokenURI.replace("data:application/json;base64,", "");
          const jsonString = Buffer.from(base64Json, "base64").toString("utf-8");
          
          try {
            const metadata = JSON.parse(jsonString);
            
            console.log(`  📋 メタデータ名: ${metadata.name}`);
            console.log(`  📝 説明: ${metadata.description?.substring(0, 50)}...`);
            
            // 必須フィールドを確認
            const requiredFields = ['name', 'description', 'image'];
            const missingFields = requiredFields.filter(field => !metadata[field]);
            
            if (missingFields.length > 0) {
              console.log(`  ⚠️  不足しているフィールド: ${missingFields.join(', ')}`);
            } else {
              console.log(`  ✅ 必須フィールドがすべて存在`);
            }
            
            // 画像を確認
            if (metadata.image) {
              if (metadata.image.startsWith("data:image/svg+xml;base64,")) {
                const base64Svg = metadata.image.replace("data:image/svg+xml;base64,", "");
                const svgString = Buffer.from(base64Svg, "base64").toString("utf-8");
                
                console.log(`  ✅ 画像: SVG形式 (${svgString.length}文字)`);
                
                // SVGの基本構造を確認
                if (svgString.includes("<svg") && svgString.includes("</svg>")) {
                  console.log(`  ✅ SVG構造が正しい`);
                } else {
                  console.log(`  ⚠️  SVG構造に問題がある可能性`);
                }
              } else {
                console.log(`  ⚠️  予期しない画像形式: ${metadata.image.substring(0, 50)}...`);
              }
            } else {
              console.log(`  ❌ 画像フィールドが存在しません`);
            }
            
            // 属性を確認
            if (metadata.attributes && Array.isArray(metadata.attributes)) {
              console.log(`  ✅ 属性: ${metadata.attributes.length}個`);
            } else {
              console.log(`  ⚠️  属性が存在しないか、配列形式ではない`);
            }
            
          } catch (parseError) {
            console.log(`  ❌ JSON解析エラー: ${parseError.message}`);
            console.log(`  📄 JSON内容（最初の200文字）: ${jsonString.substring(0, 200)}...`);
          }
        } else {
          console.log(`  ⚠️  予期しないURI形式: ${tokenURI.substring(0, 100)}...`);
        }

        // ゴミデータを確認
        const trashData = await contract.trashData(tokenId);
        console.log(`  🗑️  ゴミデータ:`);
        console.log(`     名前: ${trashData.name}`);
        console.log(`     絵文字: ${trashData.emoji}`);
        console.log(`     臭さレベル: ${trashData.stinkLevel}/10`);

        // BlockscoutのURLを表示
        console.log(`  🔗 Blockscout: https://base.blockscout.com/token/${contractAddress}/instance/${tokenId.toString()}`);

      } catch (error) {
        console.error(`  ❌ エラー: ${error.message}`);
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log("✅ 確認完了！");
    console.log("\n💡 Blockscoutで404エラーが出る場合:");
    console.log("   1. インデックス処理に時間がかかる場合があります（数時間〜1日）");
    console.log("   2. コントラクトページで確認: https://base.blockscout.com/address/" + contractAddress);
    console.log("   3. トランザクションハッシュで確認");
    console.log("   4. 別のエクスプローラー（Basescan）で確認");

  } catch (error) {
    console.error("❌ エラー:", error.message);
    console.error("\n💡 確認事項:");
    console.error("   1. コントラクトアドレスが正しいか確認");
    console.error("   2. ネットワークがBase Mainnetか確認");
    console.error("   3. コントラクトが正しくデプロイされているか確認");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

