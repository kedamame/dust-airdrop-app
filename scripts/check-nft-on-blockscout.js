const hre = require("hardhat");

async function main() {
  // コントラクトアドレス（メインネット）
  const contractAddress = process.env.NEXT_PUBLIC_TRASH_NFT_ADDRESS_MAINNET || "0x111c0519E050F31E8219c13C184DAae75D2a29a7";
  
  console.log("🔍 BlockscoutでNFTが表示されない原因を調査します...");
  console.log(`📝 コントラクトアドレス: ${contractAddress}`);
  console.log("");

  const TrashNFT = await hre.ethers.getContractFactory("TrashNFT");
  const contract = TrashNFT.attach(contractAddress);

  try {
    // 総発行数を確認
    const totalSupply = await contract.totalSupply();
    console.log(`📊 総発行数: ${totalSupply.toString()}`);

    if (totalSupply === 0n) {
      console.log("⚠️  まだNFTがミントされていません");
      return;
    }

    // 各NFTを確認
    for (let i = 0; i < totalSupply; i++) {
      const tokenId = BigInt(i);
      console.log(`\n📦 Token ID: ${tokenId.toString()}`);

      try {
        // オーナーを確認
        const owner = await contract.ownerOf(tokenId);
        console.log(`   👤 オーナー: ${owner}`);

        // tokenURIを確認
        const tokenURI = await contract.tokenURI(tokenId);
        console.log(`   ✅ tokenURI取得成功`);

        if (tokenURI.startsWith("data:application/json;base64,")) {
          const base64Json = tokenURI.replace("data:application/json;base64,", "");
          const jsonString = Buffer.from(base64Json, "base64").toString("utf-8");
          const metadata = JSON.parse(jsonString);
          
          console.log(`   📋 メタデータ名: ${metadata.name}`);
          
          if (metadata.image) {
            console.log(`   ✅ 画像URL存在`);
            
            if (metadata.image.startsWith("data:image/svg+xml;base64,")) {
              const base64Svg = metadata.image.replace("data:image/svg+xml;base64,", "");
              const svgString = Buffer.from(base64Svg, "base64").toString("utf-8");
              
              console.log(`   ✅ SVG生成成功`);
              console.log(`   📏 SVGサイズ: ${svgString.length} 文字`);
            }
          }

          // BlockscoutのURLを表示
          console.log(`   🔗 Blockscout URL: https://base.blockscout.com/token/${contractAddress}/instance/${tokenId.toString()}`);
        } else {
          console.log(`   ⚠️  予期しないURI形式: ${tokenURI.substring(0, 50)}...`);
        }

        // ゴミデータを確認
        const trashData = await contract.trashData(tokenId);
        console.log(`   🗑️  ゴミデータ:`);
        console.log(`      名前: ${trashData.name}`);
        console.log(`      絵文字: ${trashData.emoji}`);
        console.log(`      臭さレベル: ${trashData.stinkLevel}/10`);

      } catch (error) {
        console.error(`   ❌ エラー: ${error.message}`);
      }
    }

    console.log("\n✅ 確認完了！");
    console.log("\n💡 もしBlockscoutで404エラーが出る場合:");
    console.log("   1. 時間を置いて再確認（インデックス処理に時間がかかる場合があります）");
    console.log("   2. コントラクトページで確認: https://base.blockscout.com/address/" + contractAddress);
    console.log("   3. トランザクションハッシュで確認");

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

