const hre = require("hardhat");

async function main() {
  const contractAddress = "0xB462C88C9b7D22F0D5583eeA4718C956a267d55c";
  
  console.log("🔍 NFTのSVGコンテンツを確認します...");
  console.log(`📝 コントラクトアドレス: ${contractAddress}\n`);

  const provider = hre.ethers.provider;
  const contractArtifact = await hre.artifacts.readArtifact("TrashNFT");
  const contract = new hre.ethers.Contract(contractAddress, contractArtifact.abi, provider);

  try {
    const totalSupply = await contract.totalSupply();
    console.log(`✅ 総供給量: ${totalSupply.toString()} NFT\n`);

    // 最終兵器、うんち、輝くうんちのToken IDを確認
    const targetNames = ["最終兵器", "うんち", "輝くうんち", "Final Weapon", "Poop", "Shining Poop"];
    
    for (let i = 0; i < totalSupply; i++) {
      try {
        const trashData = await contract.trashData(BigInt(i));
        const name = trashData.name;
        
        if (targetNames.includes(name)) {
          console.log(`\n📦 Token ID: ${i}`);
          console.log(`   名前: ${name}`);
          console.log(`   絵文字: ${trashData.emoji}`);
          
          const tokenURI = await contract.tokenURI(BigInt(i));
          
          if (tokenURI.startsWith("data:application/json;base64,")) {
            const base64Json = tokenURI.replace("data:application/json;base64,", "");
            const jsonString = Buffer.from(base64Json, "base64").toString("utf-8");
            const metadata = JSON.parse(jsonString);
            
            if (metadata.image && metadata.image.startsWith("data:image/svg+xml;base64,")) {
              const base64Svg = metadata.image.replace("data:image/svg+xml;base64,", "");
              const svgString = Buffer.from(base64Svg, "base64").toString("utf-8");
              
              console.log(`   ✅ SVG生成成功`);
              console.log(`   📏 SVGサイズ: ${svgString.length} 文字`);
              
              // SVGの内容を確認
              if (svgString.includes(trashData.emoji)) {
                console.log(`   ✅ 絵文字がSVGに含まれています: ${trashData.emoji}`);
              } else {
                console.log(`   ❌ 絵文字がSVGに含まれていません`);
              }
              
              // SVGの構造を確認
              if (svgString.includes("<text")) {
                console.log(`   ✅ テキスト要素が含まれています`);
              }
              
              // SVGの最初の200文字を表示
              console.log(`   📄 SVGの最初の200文字:`);
              console.log(`   ${svgString.substring(0, 200)}...`);
            }
          }
        }
      } catch (error) {
        // エラーは無視
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

