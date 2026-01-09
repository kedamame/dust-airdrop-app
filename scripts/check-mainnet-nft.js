const hre = require("hardhat");
require("dotenv").config();

async function main() {
  // コントラクトアドレス（メインネット）
  const contractAddress = process.env.NEXT_PUBLIC_TRASH_NFT_ADDRESS_MAINNET || "0x111c0519E050F31E8219c13C184DAae75D2a29a7";
  
  console.log("🔍 メインネットのNFTを確認します...");
  console.log(`📝 コントラクトアドレス: ${contractAddress}`);
  console.log(`🌐 ネットワーク: Base Mainnet`);
  console.log("");

  const TrashNFT = await hre.ethers.getContractFactory("TrashNFT");
  const contract = TrashNFT.attach(contractAddress);

  try {
    // 総発行数を確認
    let totalSupply;
    try {
      totalSupply = await contract.totalSupply();
    } catch (error) {
      // totalSupplyが存在しない場合は、別の方法で確認
      console.log("⚠️  totalSupply()が利用できません。ERC721Enumerableが実装されていない可能性があります。");
      console.log("   これは既存のコントラクトでは問題ありません。");
      return;
    }

    console.log(`📊 総発行数: ${totalSupply.toString()}`);

    if (totalSupply === 0n) {
      console.log("⚠️  まだNFTがミントされていません");
      return;
    }

    // 各NFTを確認
    console.log(`\n📦 ${totalSupply.toString()}個のNFTを確認中...\n`);
    
    for (let i = 0; i < totalSupply && i < 10; i++) { // 最初の10個のみ確認
      const tokenId = BigInt(i);
      console.log(`Token ID: ${tokenId.toString()}`);

      try {
        // オーナーを確認
        const owner = await contract.ownerOf(tokenId);
        console.log(`  👤 オーナー: ${owner}`);

        // tokenURIを確認
        const tokenURI = await contract.tokenURI(tokenId);
        
        if (tokenURI.startsWith("data:application/json;base64,")) {
          const base64Json = tokenURI.replace("data:application/json;base64,", "");
          const jsonString = Buffer.from(base64Json, "base64").toString("utf-8");
          const metadata = JSON.parse(jsonString);
          
          console.log(`  📋 名前: ${metadata.name}`);
          
          if (metadata.image && metadata.image.startsWith("data:image/svg+xml;base64,")) {
            console.log(`  ✅ 画像: SVG形式`);
          }

          // BlockscoutのURLを表示
          console.log(`  🔗 https://base.blockscout.com/token/${contractAddress}/instance/${tokenId.toString()}`);
        } else {
          console.log(`  ⚠️  予期しないURI形式`);
        }

        // ゴミデータを確認
        const trashData = await contract.trashData(tokenId);
        console.log(`  🗑️  ${trashData.name} (臭さ: ${trashData.stinkLevel}/10)`);

      } catch (error) {
        console.error(`  ❌ エラー: ${error.message}`);
      }
      
      console.log("");
    }

    console.log("✅ 確認完了！");
    console.log("\n💡 Blockscoutで404エラーが出る場合:");
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

