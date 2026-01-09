const hre = require("hardhat");

async function main() {
  const contractAddress = "0xD7A3231D1189C5F7F691FFC18517816955b2C5F2";
  
  console.log("🔍 TokenURIの詳細を確認します...");
  console.log(`📝 コントラクトアドレス: ${contractAddress}\n`);

  const provider = hre.ethers.provider;
  const contractArtifact = await hre.artifacts.readArtifact("TrashNFT");
  const contract = new hre.ethers.Contract(contractAddress, contractArtifact.abi, provider);

  try {
    const totalSupply = await contract.totalSupply();
    console.log(`✅ 総供給量: ${totalSupply.toString()} NFT\n`);

    for (let i = 0; i < totalSupply; i++) {
      try {
        console.log(`\n📦 Token ID: ${i}`);
        console.log("─".repeat(50));
        
        // ゴミデータを取得
        const trashData = await contract.trashData(BigInt(i));
        console.log(`   名前: ${trashData.name}`);
        console.log(`   絵文字: ${trashData.emoji}`);
        console.log(`   説明: ${trashData.description}`);
        console.log(`   臭さレベル: ${trashData.stinkLevel}/10`);
        
        // tokenURIを取得
        try {
          const tokenURI = await contract.tokenURI(BigInt(i));
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
                
                // SVGの内容を確認
                if (svgString.includes(trashData.emoji)) {
                  console.log(`   ✅ 絵文字がSVGに含まれています`);
                } else {
                  console.log(`   ❌ 絵文字がSVGに含まれていません`);
                  console.log(`   📄 SVGの内容（最初の300文字）:`);
                  console.log(`   ${svgString.substring(0, 300)}...`);
                }
                
                // SVGの構造を確認
                if (svgString.includes("<text")) {
                  console.log(`   ✅ テキスト要素が含まれています`);
                }
                
                if (svgString.includes("<?xml")) {
                  console.log(`   ✅ XML宣言が含まれています`);
                }
              } else {
                console.log(`   ⚠️  画像形式が予期しない形式: ${metadata.image.substring(0, 50)}...`);
              }
            } else {
              console.log(`   ❌ 画像URLが見つかりません`);
            }
          }
        } catch (error) {
          console.log(`   ❌ tokenURI取得エラー: ${error.message}`);
          if (error.message.includes("Stack too deep")) {
            console.log(`   💡 スタックが深すぎるエラーが発生しています`);
          }
        }
      } catch (error) {
        console.log(`   ❌ エラー: ${error.message}`);
      }
    }
    
    console.log("\n✅ 確認完了！");
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

