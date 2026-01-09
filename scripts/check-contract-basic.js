const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const mainnetAddress = process.env.NEXT_PUBLIC_TRASH_NFT_ADDRESS_MAINNET || "0x6De78096eaa28f50Ded407F60A21a0803A75326B";
  
  console.log("🔍 メインネットコントラクトの基本情報を確認します...");
  console.log(`📝 コントラクトアドレス: ${mainnetAddress}`);
  console.log("");

  const provider = new hre.ethers.JsonRpcProvider("https://mainnet.base.org");

  // 最小限のABI
  const minimalABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function ownerOf(uint256 tokenId) view returns (address)",
    "function tokenURI(uint256 tokenId) view returns (string)",
  ];

  try {
    const contract = new hre.ethers.Contract(mainnetAddress, minimalABI, provider);

    console.log("=".repeat(70));
    console.log("基本情報");
    console.log("=".repeat(70));
    
    const name = await contract.name();
    const symbol = await contract.symbol();
    const totalSupply = await contract.totalSupply();
    
    console.log(`✅ 名前: ${name}`);
    console.log(`✅ シンボル: ${symbol}`);
    console.log(`✅ 総発行数: ${totalSupply.toString()}`);

    if (totalSupply === 0n) {
      console.log("\n⚠️  NFTがまだミントされていません");
      return;
    }

    console.log("\n" + "=".repeat(70));
    console.log("NFTの詳細");
    console.log("=".repeat(70));
    
    for (let i = 0; i < totalSupply && i < 5; i++) {
      const tokenId = BigInt(i);
      console.log(`\n📦 Token ID: ${tokenId.toString()}`);

      try {
        const owner = await contract.ownerOf(tokenId);
        console.log(`   👤 オーナー: ${owner}`);

        const tokenURI = await contract.tokenURI(tokenId);
        console.log(`   ✅ tokenURI取得成功 (長さ: ${tokenURI.length}文字)`);
        
        if (tokenURI.startsWith("data:application/json;base64,")) {
          const base64Json = tokenURI.replace("data:application/json;base64,", "");
          const jsonString = Buffer.from(base64Json, "base64").toString("utf-8");
          
          try {
            const metadata = JSON.parse(jsonString);
            console.log(`   📋 メタデータ名: ${metadata.name}`);
            
            if (metadata.image && metadata.image.startsWith("data:image/svg+xml;base64,")) {
              const base64Svg = metadata.image.replace("data:image/svg+xml;base64,", "");
              const svgString = Buffer.from(base64Svg, "base64").toString("utf-8");
              console.log(`   ✅ SVG画像: ${svgString.length}文字`);
            }
          } catch (parseError) {
            console.log(`   ⚠️  JSON解析エラー`);
          }
        }

        console.log(`   🔗 https://base.blockscout.com/token/${mainnetAddress}/instance/${tokenId.toString()}`);

      } catch (error) {
        console.error(`   ❌ エラー: ${error.message}`);
      }
    }

    // コントラクトのコードを確認
    console.log("\n" + "=".repeat(70));
    console.log("コントラクトコードの確認");
    console.log("=".repeat(70));
    
    const code = await provider.getCode(mainnetAddress);
    if (code === "0x") {
      console.log("❌ コントラクトが存在しません（アドレスが間違っている可能性）");
    } else {
      console.log(`✅ コントラクトコードが存在します (${code.length}文字)`);
    }

    // 最近のトランザクションを確認
    console.log("\n" + "=".repeat(70));
    console.log("最近のトランザクション");
    console.log("=".repeat(70));
    
    try {
      // Etherscan APIを使用してトランザクションを確認
      console.log("💡 Basescanで確認:");
      console.log(`   https://basescan.org/address/${mainnetAddress}`);
      console.log("\n💡 Blockscoutで確認:");
      console.log(`   https://base.blockscout.com/address/${mainnetAddress}`);
    } catch (error) {
      console.error(`   ❌ エラー: ${error.message}`);
    }

    console.log("\n" + "=".repeat(70));
    console.log("考えられる原因と解決策");
    console.log("=".repeat(70));
    
    console.log("\n💡 404エラーの主な原因:");
    console.log("   1. Blockscoutのインデックス処理がまだ完了していない");
    console.log("      → メインネットでは、インデックス処理に数時間〜数日かかることがあります");
    console.log("   2. Blockscoutがメインネットで異なる方法でNFTを認識している");
    console.log("      → コントラクトページでNFTが表示されているか確認してください");
    console.log("   3. Transferイベントが正しく発行されていない");
    console.log("      → _safeMintが正しく呼ばれているか確認");
    console.log("   4. Blockscoutのメインネットでのバグや制限");
    console.log("      → 別のエクスプローラー（Basescan）で確認");
    
    console.log("\n🔧 推奨される対応:");
    console.log("   1. コントラクトページで確認:");
    console.log(`      https://base.blockscout.com/address/${mainnetAddress}`);
    console.log("   2. 時間を置いて再確認（24時間後など）");
    console.log("   3. Basescanで確認:");
    console.log(`      https://basescan.org/address/${mainnetAddress}#writeContract`);
    console.log("   4. トランザクションハッシュから直接NFTを確認");

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

