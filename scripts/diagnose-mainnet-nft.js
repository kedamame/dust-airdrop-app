const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const mainnetAddress = process.env.NEXT_PUBLIC_TRASH_NFT_ADDRESS_MAINNET || "0x6De78096eaa28f50Ded407F60A21a0803A75326B";
  
  console.log("🔍 メインネットNFTの404エラーの原因を診断します...");
  console.log(`📝 コントラクトアドレス: ${mainnetAddress}`);
  console.log("");

  const provider = new hre.ethers.JsonRpcProvider("https://mainnet.base.org");
  const contractArtifact = await hre.artifacts.readArtifact("TrashNFT");
  const contract = new hre.ethers.Contract(mainnetAddress, contractArtifact.abi, provider);

  try {
    console.log("=".repeat(70));
    console.log("1. 基本情報の確認");
    console.log("=".repeat(70));
    
    const name = await contract.name();
    const symbol = await contract.symbol();
    const totalSupply = await contract.totalSupply();
    
    console.log(`✅ 名前: ${name}`);
    console.log(`✅ シンボル: ${symbol}`);
    console.log(`✅ 総発行数: ${totalSupply.toString()}`);

    // ERC165インターフェースIDを確認
    const ERC721_INTERFACE_ID = "0x80ac58cd";
    const ERC721_METADATA_INTERFACE_ID = "0x5b5e139f";
    const ERC721_ENUMERABLE_INTERFACE_ID = "0x780e9d63";
    
    const supportsERC721 = await contract.supportsInterface(ERC721_INTERFACE_ID);
    const supportsMetadata = await contract.supportsInterface(ERC721_METADATA_INTERFACE_ID);
    const supportsEnumerable = await contract.supportsInterface(ERC721_ENUMERABLE_INTERFACE_ID);
    
    console.log(`\n📋 ERC165インターフェース:`);
    console.log(`   ERC721: ${supportsERC721}`);
    console.log(`   ERC721Metadata: ${supportsMetadata}`);
    console.log(`   ERC721Enumerable: ${supportsEnumerable}`);
    
    if (supportsEnumerable) {
      console.log(`   ⚠️  ERC721Enumerableが実装されています（テストネットでは実装されていません）`);
    }

    if (totalSupply === 0n) {
      console.log("\n⚠️  NFTがまだミントされていません");
      return;
    }

    console.log("\n" + "=".repeat(70));
    console.log("2. NFTの詳細確認");
    console.log("=".repeat(70));
    
    for (let i = 0; i < totalSupply && i < 3; i++) {
      const tokenId = BigInt(i);
      console.log(`\n📦 Token ID: ${tokenId.toString()}`);

      try {
        // オーナーを確認
        const owner = await contract.ownerOf(tokenId);
        console.log(`   👤 オーナー: ${owner}`);

        // tokenURIを確認
        const tokenURI = await contract.tokenURI(tokenId);
        console.log(`   ✅ tokenURI取得成功 (長さ: ${tokenURI.length}文字)`);
        
        if (tokenURI.startsWith("data:application/json;base64,")) {
          const base64Json = tokenURI.replace("data:application/json;base64,", "");
          const jsonString = Buffer.from(base64Json, "base64").toString("utf-8");
          
          try {
            const metadata = JSON.parse(jsonString);
            
            console.log(`   📋 メタデータ名: ${metadata.name}`);
            
            // 必須フィールドを確認
            const requiredFields = ['name', 'description', 'image'];
            const missingFields = requiredFields.filter(field => !metadata[field]);
            
            if (missingFields.length > 0) {
              console.log(`   ❌ 不足しているフィールド: ${missingFields.join(', ')}`);
            } else {
              console.log(`   ✅ 必須フィールドがすべて存在`);
            }
            
            // 画像を確認
            if (metadata.image) {
              if (metadata.image.startsWith("data:image/svg+xml;base64,")) {
                const base64Svg = metadata.image.replace("data:image/svg+xml;base64,", "");
                const svgString = Buffer.from(base64Svg, "base64").toString("utf-8");
                
                console.log(`   ✅ SVG画像: ${svgString.length}文字`);
                
                // SVGの基本構造を確認
                const hasXmlDecl = svgString.includes("<?xml");
                const hasSvgTag = svgString.includes("<svg");
                const hasXmlns = svgString.includes("xmlns");
                const hasViewBox = svgString.includes("viewBox");
                
                console.log(`   📐 SVG構造:`);
                console.log(`      XML宣言: ${hasXmlDecl ? '✅' : '❌'}`);
                console.log(`      SVG要素: ${hasSvgTag ? '✅' : '❌'}`);
                console.log(`      xmlns属性: ${hasXmlns ? '✅' : '❌'}`);
                console.log(`      viewBox属性: ${hasViewBox ? '✅' : '❌'}`);
                
                if (!hasXmlDecl || !hasSvgTag || !hasXmlns || !hasViewBox) {
                  console.log(`   ⚠️  SVG構造に問題がある可能性があります`);
                }
              } else {
                console.log(`   ⚠️  予期しない画像形式`);
              }
            }
            
          } catch (parseError) {
            console.log(`   ❌ JSON解析エラー: ${parseError.message}`);
          }
        } else {
          console.log(`   ⚠️  予期しないURI形式: ${tokenURI.substring(0, 50)}...`);
        }

        // BlockscoutのURLを表示
        console.log(`   🔗 Blockscout: https://base.blockscout.com/token/${mainnetAddress}/instance/${tokenId.toString()}`);

      } catch (error) {
        console.error(`   ❌ エラー: ${error.message}`);
      }
    }

    console.log("\n" + "=".repeat(70));
    console.log("3. Transferイベントの確認");
    console.log("=".repeat(70));
    
    try {
      // 最近のブロックから確認（全ブロックをスキャンするとエラーになるため）
      const currentBlock = await provider.getBlockNumber();
      const fromBlock = Math.max(0, currentBlock - 10000); // 最近の10000ブロック
      
      console.log(`📡 ブロック ${fromBlock} から ${currentBlock} までを確認中...`);
      
      const filter = contract.filters.Transfer();
      const events = await contract.queryFilter(filter, fromBlock, currentBlock);
      
      console.log(`   ✅ Transferイベント数: ${events.length}`);
      
      if (events.length > 0) {
        console.log(`\n   📝 最新のTransferイベント:`);
        const latestEvent = events[events.length - 1];
        console.log(`      From: ${latestEvent.args.from}`);
        console.log(`      To: ${latestEvent.args.to}`);
        console.log(`      Token ID: ${latestEvent.args.tokenId.toString()}`);
        console.log(`      ブロック: ${latestEvent.blockNumber}`);
        console.log(`      トランザクション: ${latestEvent.transactionHash}`);
      } else {
        console.log(`   ⚠️  Transferイベントが見つかりませんでした`);
        console.log(`   💡 これは、BlockscoutがNFTを認識できない原因の可能性があります`);
      }
      
    } catch (error) {
      console.error(`   ❌ Transferイベント取得エラー: ${error.message}`);
    }

    console.log("\n" + "=".repeat(70));
    console.log("4. Blockscoutでの確認方法");
    console.log("=".repeat(70));
    
    console.log(`\n🔗 コントラクトページ:`);
    console.log(`   https://base.blockscout.com/address/${mainnetAddress}`);
    
    console.log(`\n🔗 NFTインスタンスページ（直接アクセス）:`);
    for (let i = 0; i < totalSupply && i < 3; i++) {
      console.log(`   Token ${i}: https://base.blockscout.com/token/${mainnetAddress}/instance/${i}`);
    }

    console.log("\n" + "=".repeat(70));
    console.log("5. 考えられる原因と解決策");
    console.log("=".repeat(70));
    
    console.log("\n💡 考えられる原因:");
    console.log("   1. Blockscoutのインデックス処理がまだ完了していない");
    console.log("      → 数時間〜1日待ってから再確認");
    console.log("   2. Transferイベントが正しく発行されていない");
    console.log("      → コントラクトの_safeMintが正しく呼ばれているか確認");
    console.log("   3. Blockscoutがメインネットで異なる方法でNFTを認識している");
    console.log("      → コントラクトページでNFTが表示されているか確認");
    console.log("   4. tokenURIの実装に問題がある");
    console.log("      → 上記の確認結果を参照");
    console.log("   5. コントラクトアドレスが正しく設定されていない");
    console.log("      → .env.localのNEXT_PUBLIC_TRASH_NFT_ADDRESS_MAINNETを確認");
    
    console.log("\n🔧 推奨される対応:");
    console.log("   1. コントラクトページでNFTが表示されているか確認");
    console.log("   2. トランザクションハッシュから直接NFTを確認");
    console.log("   3. 時間を置いて再確認（Blockscoutのインデックス処理を待つ）");
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

