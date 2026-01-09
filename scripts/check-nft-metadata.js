const hre = require("hardhat");

async function main() {
  const contractAddress = "0xB462C88C9b7D22F0D5583eeA4718C956a267d55c";
  
  console.log("🔍 NFTコントラクトの実装状況を確認します...");
  console.log(`📝 コントラクトアドレス: ${contractAddress}`);
  console.log(`🌐 ネットワーク: Base Sepolia (84532)\n`);

  // プロバイダーを取得
  const provider = hre.ethers.provider;
  
  // コントラクトのABIを読み込む
  const contractArtifact = await hre.artifacts.readArtifact("TrashNFT");
  const contract = new hre.ethers.Contract(contractAddress, contractArtifact.abi, provider);

  try {
    // 総供給量を取得
    const totalSupply = await contract.totalSupply();
    console.log(`✅ 総供給量: ${totalSupply.toString()} NFT\n`);

    if (totalSupply === 0n) {
      console.log("⚠️  NFTがまだミントされていません");
      return;
    }

    // 各NFTのメタデータを確認
    for (let i = 0; i < totalSupply; i++) {
      const tokenId = BigInt(i);
      console.log(`\n📦 Token ID: ${tokenId.toString()}`);
      console.log("─".repeat(50));

      try {
        // tokenURIを取得
        const tokenURI = await contract.tokenURI(tokenId);
        console.log(`✅ tokenURI取得成功`);
        console.log(`📄 URI (最初の100文字): ${tokenURI.substring(0, 100)}...\n`);

        // Base64デコード
        if (tokenURI.startsWith("data:application/json;base64,")) {
          const base64Json = tokenURI.replace("data:application/json;base64,", "");
          const jsonString = Buffer.from(base64Json, "base64").toString("utf-8");
          const metadata = JSON.parse(jsonString);

          console.log("📋 メタデータ:");
          console.log(`   名前: ${metadata.name}`);
          console.log(`   説明: ${metadata.description?.substring(0, 80)}...`);
          
          if (metadata.image) {
            console.log(`   ✅ 画像URL: ${metadata.image.substring(0, 80)}...`);
            
            // 画像がBase64エンコードされたSVGか確認
            if (metadata.image.startsWith("data:image/svg+xml;base64,")) {
              console.log(`   ✅ 画像形式: Base64エンコードされたSVG`);
              
              // SVGをデコードして確認
              const base64Svg = metadata.image.replace("data:image/svg+xml;base64,", "");
              const svgString = Buffer.from(base64Svg, "base64").toString("utf-8");
              
              if (svgString.includes("<svg")) {
                console.log(`   ✅ SVGが正しく生成されています`);
                console.log(`   📏 SVGサイズ: ${svgString.length} 文字`);
                
                // SVGの主要要素を確認
                if (svgString.includes("emoji") || svgString.includes("text")) {
                  console.log(`   ✅ SVGにテキスト要素が含まれています`);
                }
              } else {
                console.log(`   ❌ SVGの形式が正しくありません`);
              }
            } else {
              console.log(`   ⚠️  画像形式: ${metadata.image.substring(0, 50)}...`);
            }
          } else {
            console.log(`   ❌ 画像URLが見つかりません`);
          }

          if (metadata.attributes) {
            console.log(`   📊 属性数: ${metadata.attributes.length}`);
            metadata.attributes.forEach((attr, idx) => {
              console.log(`      ${idx + 1}. ${attr.trait_type}: ${attr.value}`);
            });
          }
        } else {
          console.log(`   ⚠️  予期しないURI形式: ${tokenURI.substring(0, 50)}...`);
        }

        // ゴミデータを取得
        const trashData = await contract.trashData(tokenId);
        console.log(`\n🗑️  ゴミデータ:`);
        console.log(`   名前: ${trashData.name}`);
        console.log(`   絵文字: ${trashData.emoji}`);
        console.log(`   説明: ${trashData.description}`);
        console.log(`   臭さレベル: ${trashData.stinkLevel}/10`);
        console.log(`   投げた人: ${trashData.thrownBy}`);
        console.log(`   投げた時刻: ${new Date(Number(trashData.thrownAt) * 1000).toLocaleString()}`);

      } catch (error) {
        console.error(`   ❌ エラー: ${error.message}`);
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log("✅ 確認完了！");
    console.log("\n💡 エクスプローラーで画像が表示されない場合:");
    console.log("   1. ブラウザのキャッシュをクリア");
    console.log("   2. エクスプローラーのページを再読み込み");
    console.log("   3. 別のエクスプローラー（例: Etherscan）で確認");
    console.log("   4. MetaMaskなどのウォレットでNFTを表示");

  } catch (error) {
    console.error("❌ エラーが発生しました:", error.message);
    console.error("\n考えられる原因:");
    console.error("   1. コントラクトが正しくデプロイされていない");
    console.error("   2. ネットワークが正しくない（Base Sepoliaに接続されているか確認）");
    console.error("   3. コントラクトアドレスが間違っている");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

