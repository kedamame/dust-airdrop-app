const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const mainnetAddress = "0x6De78096eaa28f50Ded407F60A21a0803A75326B";
  const tokenId = 0;
  
  console.log("🔍 Basescanで画像が表示されない原因を詳細に調査します...");
  console.log(`📝 コントラクトアドレス: ${mainnetAddress}`);
  console.log(`📦 Token ID: ${tokenId}`);
  console.log("");

  const provider = new hre.ethers.JsonRpcProvider("https://mainnet.base.org");
  const contractArtifact = await hre.artifacts.readArtifact("TrashNFT");
  const contract = new hre.ethers.Contract(mainnetAddress, contractArtifact.abi, provider);

  try {
    console.log("=".repeat(70));
    console.log("1. tokenURIの取得と解析");
    console.log("=".repeat(70));
    
    const tokenURI = await contract.tokenURI(tokenId);
    console.log(`✅ tokenURI取得成功`);
    console.log(`📄 長さ: ${tokenURI.length}文字`);
    console.log(`📄 形式: ${tokenURI.substring(0, 80)}...`);
    
    if (!tokenURI.startsWith("data:application/json;base64,")) {
      console.log(`❌ 予期しないURI形式です`);
      return;
    }

    const base64Json = tokenURI.replace("data:application/json;base64,", "");
    const jsonString = Buffer.from(base64Json, "base64").toString("utf-8");
    
    console.log(`\n📋 JSONメタデータ:`);
    console.log(`   長さ: ${jsonString.length}文字`);
    
    let metadata;
    try {
      metadata = JSON.parse(jsonString);
      console.log(`   ✅ JSON解析成功`);
    } catch (e) {
      console.log(`   ❌ JSON解析エラー: ${e.message}`);
      return;
    }

    console.log(`\n📋 メタデータ内容:`);
    console.log(`   名前: ${metadata.name}`);
    console.log(`   説明: ${metadata.description?.substring(0, 60)}...`);
    
    if (!metadata.image) {
      console.log(`\n❌ 画像フィールドが存在しません`);
      return;
    }

    console.log(`\n🖼️  画像情報:`);
    console.log(`   形式: ${metadata.image.substring(0, 80)}...`);
    
    if (!metadata.image.startsWith("data:image/svg+xml;base64,")) {
      console.log(`   ❌ 予期しない画像形式です`);
      return;
    }

    const base64Svg = metadata.image.replace("data:image/svg+xml;base64,", "");
    const svgString = Buffer.from(base64Svg, "base64").toString("utf-8");
    
    console.log(`   ✅ SVG形式`);
    console.log(`   📏 SVGサイズ: ${svgString.length}文字`);
    
    console.log(`\n📐 SVG構造チェック:`);
    const checks = {
      "XML宣言": svgString.includes("<?xml"),
      "SVG要素": svgString.includes("<svg"),
      "xmlns属性": svgString.includes('xmlns="http://www.w3.org/2000/svg"'),
      "viewBox属性": svgString.includes("viewBox"),
      "width属性": svgString.includes("width"),
      "height属性": svgString.includes("height"),
      "SVGが閉じられている": svgString.includes("</svg>"),
    };
    
    for (const [key, value] of Object.entries(checks)) {
      console.log(`   ${key}: ${value ? '✅' : '❌'}`);
    }

    // SVGの最初と最後を表示
    console.log(`\n📄 SVGの最初の300文字:`);
    console.log(`   ${svgString.substring(0, 300)}...`);
    console.log(`\n📄 SVGの最後の100文字:`);
    console.log(`   ...${svgString.substring(svgString.length - 100)}`);

    // Basescanが期待する形式を確認
    console.log("\n" + "=".repeat(70));
    console.log("2. Basescan互換性の確認");
    console.log("=".repeat(70));
    
    // 1. Base64エンコーディングの検証
    try {
      const reEncoded = Buffer.from(svgString, "utf-8").toString("base64");
      const isEncodedCorrectly = reEncoded === base64Svg;
      console.log(`   Base64エンコーディング: ${isEncodedCorrectly ? '✅ 正しい' : '❌ 問題あり'}`);
    } catch (e) {
      console.log(`   Base64エンコーディング: ❌ エラー - ${e.message}`);
    }

    // 2. SVGの有効性を確認
    const hasValidStructure = 
      svgString.includes("<?xml") &&
      svgString.includes("<svg") &&
      svgString.includes("</svg>");
    console.log(`   SVG構造: ${hasValidStructure ? '✅ 有効' : '❌ 無効'}`);

    // 3. 特殊文字の確認
    const hasEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(svgString);
    console.log(`   絵文字の有無: ${hasEmoji ? '✅ あり' : '⚠️  なし'}`);

    // 4. Basescanが処理できるサイズか確認
    const svgSizeKB = svgString.length / 1024;
    console.log(`   SVGサイズ: ${svgSizeKB.toFixed(2)}KB`);
    if (svgSizeKB > 10) {
      console.log(`   ⚠️  SVGサイズが大きい可能性があります（10KB以上）`);
    }

    console.log("\n" + "=".repeat(70));
    console.log("3. 推奨される対処法");
    console.log("=".repeat(70));
    
    console.log(`\n💡 Basescanで画像が表示されない場合:`);
    console.log(`   1. Basescanのキャッシュをクリア`);
    console.log(`   2. 時間を置いて再確認（インデックス処理を待つ）`);
    console.log(`   3. ブラウザの開発者ツールでエラーを確認`);
    console.log(`   4. 直接tokenURIを呼び出してメタデータを確認`);
    
    console.log(`\n🔗 Basescan:`);
    console.log(`   https://basescan.org/nft/${mainnetAddress}/${tokenId}`);
    console.log(`   https://basescan.org/address/${mainnetAddress}`);
    
    console.log(`\n🔗 直接tokenURIを確認:`);
    console.log(`   コントラクトから直接tokenURI(${tokenId})を呼び出して確認してください`);

    // メタデータのJSONを表示（デバッグ用）
    console.log(`\n📋 完全なメタデータJSON:`);
    console.log(JSON.stringify(metadata, null, 2));

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

