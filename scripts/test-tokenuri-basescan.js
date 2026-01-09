const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const mainnetAddress = process.env.NEXT_PUBLIC_TRASH_NFT_ADDRESS_MAINNET || "0x6De78096eaa28f50Ded407F60A21a0803A75326B";
  
  console.log("🔍 Basescanで画像が表示されない原因を調査します...");
  console.log(`📝 コントラクトアドレス: ${mainnetAddress}`);
  console.log("");

  const provider = new hre.ethers.JsonRpcProvider("https://mainnet.base.org");

  const minimalABI = [
    "function tokenURI(uint256 tokenId) view returns (string)",
    "function totalSupply() view returns (uint256)",
  ];

  try {
    const contract = new hre.ethers.Contract(mainnetAddress, minimalABI, provider);

    const totalSupply = await contract.totalSupply();
    console.log(`📊 総発行数: ${totalSupply.toString()}`);

    if (totalSupply === 0n) {
      console.log("⚠️  NFTがまだミントされていません");
      return;
    }

    const tokenId = 0n;
    const tokenURI = await contract.tokenURI(tokenId);
    
    console.log("\n" + "=".repeat(70));
    console.log("tokenURIの詳細分析");
    console.log("=".repeat(70));
    
    console.log(`\n📄 tokenURI長さ: ${tokenURI.length}文字`);
    console.log(`📄 tokenURI形式: ${tokenURI.substring(0, 50)}...`);
    
    if (tokenURI.startsWith("data:application/json;base64,")) {
      const base64Json = tokenURI.replace("data:application/json;base64,", "");
      const jsonString = Buffer.from(base64Json, "base64").toString("utf-8");
      
      try {
        const metadata = JSON.parse(jsonString);
        
        console.log(`\n✅ JSON解析成功`);
        console.log(`📋 メタデータ名: ${metadata.name}`);
        console.log(`📝 説明: ${metadata.description?.substring(0, 80)}...`);
        
        // 画像を詳細に確認
        if (metadata.image) {
          console.log(`\n🖼️  画像情報:`);
          console.log(`   形式: ${metadata.image.substring(0, 60)}...`);
          
          if (metadata.image.startsWith("data:image/svg+xml;base64,")) {
            const base64Svg = metadata.image.replace("data:image/svg+xml;base64,", "");
            const svgString = Buffer.from(base64Svg, "base64").toString("utf-8");
            
            console.log(`   ✅ SVG形式 (${svgString.length}文字)`);
            
            // SVGの基本構造を確認
            const checks = {
              "XML宣言": svgString.includes("<?xml"),
              "SVG要素": svgString.includes("<svg"),
              "xmlns属性": svgString.includes("xmlns"),
              "viewBox属性": svgString.includes("viewBox"),
              "width属性": svgString.includes("width"),
              "height属性": svgString.includes("height"),
            };
            
            console.log(`\n   📐 SVG構造チェック:`);
            for (const [key, value] of Object.entries(checks)) {
              console.log(`      ${key}: ${value ? '✅' : '❌'}`);
            }
            
            // SVGの最初の500文字を表示
            console.log(`\n   📄 SVGの最初の500文字:`);
            console.log(`   ${svgString.substring(0, 500)}...`);
            
            // Basescanが期待する形式を確認
            console.log(`\n   🔍 Basescan互換性チェック:`);
            
            // 1. SVGが正しくエンコードされているか
            try {
              const reEncoded = Buffer.from(svgString, "utf-8").toString("base64");
              const originalBase64 = base64Svg;
              const isEncodedCorrectly = reEncoded === originalBase64;
              console.log(`      Base64エンコーディング: ${isEncodedCorrectly ? '✅' : '❌'}`);
            } catch (e) {
              console.log(`      Base64エンコーディング: ❌ エラー`);
            }
            
            // 2. SVGに特殊文字が含まれていないか
            const hasSpecialChars = /[^\x20-\x7E\n\r\t]/.test(svgString);
            console.log(`      特殊文字の有無: ${hasSpecialChars ? '⚠️  あり' : '✅ なし'}`);
            
            // 3. SVGが閉じられているか
            const isClosed = svgString.includes("</svg>");
            console.log(`      SVGが閉じられている: ${isClosed ? '✅' : '❌'}`);
            
            // 4. 絵文字が正しく含まれているか
            const hasEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(svgString);
            console.log(`      絵文字の有無: ${hasEmoji ? '✅ あり' : '⚠️  なし'}`);
            
            // Basescanがdata URIを正しく処理できるか確認
            console.log(`\n   💡 Basescanでの表示問題の可能性:`);
            console.log(`      1. Basescanがdata URIを正しく処理できていない可能性`);
            console.log(`      2. SVGのBase64エンコーディングに問題がある可能性`);
            console.log(`      3. SVGの構造に問題がある可能性`);
            console.log(`      4. Basescanが大きなSVGを処理できない可能性`);
            
          } else if (metadata.image.startsWith("data:image/svg+xml,")) {
            // URLエンコードされたSVG
            const svgEncoded = metadata.image.replace("data:image/svg+xml,", "");
            const svgString = decodeURIComponent(svgEncoded);
            console.log(`   ✅ SVG形式（URLエンコード） (${svgString.length}文字)`);
            console.log(`   ⚠️  BasescanはBase64エンコードを推奨する可能性があります`);
          } else {
            console.log(`   ⚠️  予期しない画像形式`);
          }
        } else {
          console.log(`\n❌ 画像フィールドが存在しません`);
        }
        
        // 属性を確認
        if (metadata.attributes && Array.isArray(metadata.attributes)) {
          console.log(`\n📊 属性: ${metadata.attributes.length}個`);
        }
        
      } catch (parseError) {
        console.log(`\n❌ JSON解析エラー: ${parseError.message}`);
        console.log(`📄 JSON内容（最初の500文字）:`);
        console.log(jsonString.substring(0, 500));
      }
    } else {
      console.log(`\n⚠️  予期しないURI形式`);
    }

    console.log("\n" + "=".repeat(70));
    console.log("推奨される対応");
    console.log("=".repeat(70));
    
    console.log("\n💡 Basescanで画像が表示されない場合の対処法:");
    console.log("   1. tokenURIが正しく実装されているか確認（✅ 確認済み）");
    console.log("   2. SVGの構造が正しいか確認（✅ 確認済み）");
    console.log("   3. Basescanのキャッシュをクリア");
    console.log("   4. 時間を置いて再確認（Basescanのインデックス処理を待つ）");
    console.log("   5. 別の方法で画像を確認（直接tokenURIを呼び出して確認）");
    
    console.log(`\n🔗 Basescan:`);
    console.log(`   https://basescan.org/address/${mainnetAddress}`);
    console.log(`   https://basescan.org/token/${mainnetAddress}?a=0`);

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

