require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// PRIVATE_KEYの形式を検証する関数
function getValidPrivateKey() {
  if (!process.env.PRIVATE_KEY) {
    return null;
  }
  
  const privateKey = process.env.PRIVATE_KEY.trim();
  
  // プレースホルダーをチェック
  if (privateKey === "" || privateKey === "your_private_key_here") {
    return null;
  }
  
  // 形式チェック: 64文字（0xなし）または66文字（0x付き）
  if (privateKey.length === 64) {
    // 0xなしの64文字の16進数
    if (/^[0-9a-fA-F]{64}$/.test(privateKey)) {
      return privateKey;
    }
  } else if (privateKey.length === 66 && privateKey.startsWith("0x")) {
    // 0x付きの66文字の16進数
    if (/^0x[0-9a-fA-F]{64}$/.test(privateKey)) {
      return privateKey;
    }
  }
  
  // 形式が正しくない場合はnullを返す（エラーはデプロイスクリプトで表示）
  return null;
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  networks: {
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
      accounts: (() => {
        const pk = getValidPrivateKey();
        return pk ? [pk] : [];
      })(),
      chainId: 84532,
    },
    base: {
      url: process.env.BASE_MAINNET_RPC_URL || "https://mainnet.base.org",
      accounts: (() => {
        const pk = getValidPrivateKey();
        return pk ? [pk] : [];
      })(),
      chainId: 8453,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
