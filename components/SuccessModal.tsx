'use client';

import { motion } from 'framer-motion';
import type { TrashType } from '@/app/page';
import type { Language } from '@/lib/i18n';
import { useTranslations } from '@/lib/i18n';
import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { useReadContract } from 'wagmi';
import { parseAbi } from 'viem';

type Props = {
  trash: TrashType;
  recipient: string;
  onClose: () => void;
  language: Language;
  tokenId?: bigint;
  contractAddress?: `0x${string}`;
  transactionHash?: `0x${string}`;
  chainId?: number;
};

const TRASH_NFT_ABI = parseAbi([
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function totalSupply() view returns (uint256)',
]);

const rarityColors = {
  common: '#888',
  rare: '#0088FF',
  legendary: '#FFD700',
  mythical: '#9933FF',
};

// チェーンIDに応じたエクスプローラーのベースURLを取得
function getExplorerBaseUrl(chainId?: number): string {
  // NetworkContextから取得（なければ環境変数から）
  const USE_TESTNET = typeof window !== 'undefined' 
    ? (() => {
        const saved = localStorage.getItem('gomi-nft-network-mode');
        if (saved === 'testnet') return true;
        if (saved === 'mainnet') return false;
        return process.env.NEXT_PUBLIC_USE_TESTNET === 'true';
      })()
    : process.env.NEXT_PUBLIC_USE_TESTNET === 'true';
  
  const isTestnet = chainId === 84532 || (chainId === undefined && USE_TESTNET);
  
  return isTestnet
    ? 'https://base-sepolia.blockscout.com'
    : 'https://base.blockscout.com';
}

// TX確認用のエクスプローラーURLを取得（メインネットはBasescan、テストネットはBlockscout）
function getTxExplorerUrl(transactionHash: string, chainId?: number): string {
  const USE_TESTNET = typeof window !== 'undefined' 
    ? (() => {
        const saved = localStorage.getItem('gomi-nft-network-mode');
        if (saved === 'testnet') return true;
        if (saved === 'mainnet') return false;
        return process.env.NEXT_PUBLIC_USE_TESTNET === 'true';
      })()
    : process.env.NEXT_PUBLIC_USE_TESTNET === 'true';
  
  const isTestnet = chainId === 84532 || (chainId === undefined && USE_TESTNET);
  
  if (isTestnet) {
    return `https://base-sepolia.blockscout.com/tx/${transactionHash}`;
  } else {
    return `https://basescan.org/tx/${transactionHash}`;
  }
}

// NFT確認用のURLを取得（メインネットはOpenSea、テストネットはBlockscout）
function getNftExplorerUrl(contractAddress: string, tokenId: bigint, chainId?: number): string {
  const USE_TESTNET = typeof window !== 'undefined' 
    ? (() => {
        const saved = localStorage.getItem('gomi-nft-network-mode');
        if (saved === 'testnet') return true;
        if (saved === 'mainnet') return false;
        return process.env.NEXT_PUBLIC_USE_TESTNET === 'true';
      })()
    : process.env.NEXT_PUBLIC_USE_TESTNET === 'true';
  
  const isTestnet = chainId === 84532 || (chainId === undefined && USE_TESTNET);
  
  if (isTestnet) {
    return `https://base-sepolia.blockscout.com/token/${contractAddress}/instance/${tokenId.toString()}`;
  } else {
    // OpenSeaのBase Mainnet URL形式
    return `https://opensea.io/assets/base/${contractAddress}/${tokenId.toString()}`;
  }
}

export function SuccessModal({ trash, recipient, onClose, language, tokenId, contractAddress, transactionHash, chainId }: Props) {
  const t = useTranslations(language);
  const [nftImageUrl, setNftImageUrl] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [actualTokenId, setActualTokenId] = useState<bigint | undefined>(tokenId);

  // totalSupplyから最新のtokenIdを取得（tokenIdが未指定の場合）
  const { data: totalSupply } = useReadContract({
    address: contractAddress,
    abi: TRASH_NFT_ABI,
    functionName: 'totalSupply',
    query: {
      enabled: contractAddress !== undefined && actualTokenId === undefined,
    },
  });

  // totalSupplyから最新のtokenIdを計算
  useEffect(() => {
    if (totalSupply !== undefined && totalSupply > 0n && actualTokenId === undefined) {
      // 最新のtokenIdは totalSupply - 1 (0ベースインデックス)
      setActualTokenId(totalSupply - 1n);
    }
  }, [totalSupply, actualTokenId]);

  // tokenURIを取得して画像URLを抽出
  const { data: tokenURI } = useReadContract({
    address: contractAddress,
    abi: TRASH_NFT_ABI,
    functionName: 'tokenURI',
    args: actualTokenId !== undefined ? [actualTokenId] : undefined,
    query: {
      enabled: actualTokenId !== undefined && contractAddress !== undefined,
    },
  });

  // tokenURIから画像URLを抽出
  useEffect(() => {
    if (tokenURI) {
      setIsLoadingImage(true);
      try {
        // Base64エンコードされたJSONをデコード
        if (tokenURI.startsWith('data:application/json;base64,')) {
          const base64Json = tokenURI.replace('data:application/json;base64,', '');
          const jsonString = atob(base64Json);
          const metadata = JSON.parse(jsonString);
          
          if (metadata.image) {
            setNftImageUrl(metadata.image);
          }
        }
      } catch (err) {
        console.error('Failed to parse tokenURI:', err);
      } finally {
        setIsLoadingImage(false);
      }
    }
  }, [tokenURI]);

  useEffect(() => {
    // お祝いの紙吹雪
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FFD700', '#FF0000', '#FF69B4'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FFD700', '#FF0000', '#FF69B4'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'radial-gradient(ellipse, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.98) 100%)' }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.5, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="success-modal max-w-md w-full relative"
      >
        {/* 内部コンテンツ */}
        <div className="relative z-10">
          {/* 成功テキスト */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6"
          >
            <div className="ribbon inline-block text-2xl mb-4">
              {t.success}
            </div>
            <p className="text-yellow-300 text-lg font-bold">
              {t.successMessage}
            </p>
          </motion.div>

          {/* NFT画像表示 */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', bounce: 0.5 }}
            className="text-center mb-6"
          >
            {nftImageUrl ? (
              <div className="mb-4 flex justify-center">
                <motion.img
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  src={nftImageUrl}
                  alt={`${trash.name} NFT`}
                  className={`w-64 h-64 object-contain rounded-xl border-4 ${
                    trash.id === 'golden_poop' ? 'border-yellow-400 shadow-[0_0_30px_rgba(255,215,0,0.6)]' : 'border-yellow-500/50'
                  }`}
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)',
                  }}
                />
              </div>
            ) : isLoadingImage ? (
              <div className="mb-4 flex justify-center items-center w-64 h-64 mx-auto">
                <div className="text-4xl animate-spin">⏳</div>
              </div>
            ) : (
              <div 
                className={`text-8xl mb-4 inline-block ${trash.id === 'golden_poop' ? 'golden-special' : ''}`}
              >
                {trash.emoji}
              </div>
            )}
            <div className="flex justify-center gap-2">
              <span 
                className="badge-circle"
                style={{ 
                  background: rarityColors[trash.rarity],
                  color: trash.rarity === 'legendary' ? '#000' : '#fff',
                }}
              >
                {t.rarity[trash.rarity]}
              </span>
            </div>
          </motion.div>

          {/* 詳細情報 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-black/50 rounded-xl p-4 mb-6 border border-yellow-500/30"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">{t.item}</span>
                <span 
                  className="font-bold"
                  style={{ color: rarityColors[trash.rarity] }}
                >
                  {trash.name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">{t.target}</span>
                <span className="text-yellow-300 font-bold truncate max-w-[180px]">
                  {recipient}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">{t.stinkLevelFull}:</span>
                <div className="flex items-center gap-2">
                  <div className="stink-gauge">
                    {Array.from({ length: 10 }).map((_, i) => {
                      const isActive = i < trash.stinkLevel;
                      const isDanger = trash.stinkLevel >= 8;
                      return (
                        <div 
                          key={i} 
                          className={`stink-bar ${isActive ? 'active' : ''} ${
                            isActive && isDanger ? 'danger' : ''
                          }`}
                          style={{ width: 6, height: 12 }}
                        />
                      );
                    })}
                  </div>
                  <span className="text-red-400 font-bold">{trash.stinkLevel}/10</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">{t.status}</span>
                <span className="text-green-400 font-bold">{t.onChainSaved}</span>
              </div>
              {actualTokenId !== undefined && contractAddress && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Token ID:</span>
                  <span className="text-yellow-300 font-bold font-mono">
                    #{actualTokenId.toString()}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* エクスプローラーリンク */}
          {(transactionHash || (actualTokenId !== undefined && contractAddress)) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex gap-2 justify-center items-center mb-6"
            >
              {transactionHash && (
                <motion.a
                  href={getTxExplorerUrl(transactionHash, chainId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tv-button px-3 py-2 text-xs whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'linear-gradient(135deg, #4A90E2, #357ABD)',
                  }}
                >
                  🔗 {language === 'ja' ? 'TX確認' : 'View TX'}
                </motion.a>
              )}
              {actualTokenId !== undefined && contractAddress && (
                <motion.a
                  href={getNftExplorerUrl(contractAddress, actualTokenId, chainId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tv-button px-3 py-2 text-xs whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  }}
                >
                  🖼️ {language === 'ja' ? 'NFT確認' : 'View NFT'}
                </motion.a>
              )}
            </motion.div>
          )}

          {/* メッセージ */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-gray-300 text-sm mb-6"
          >
            {trash.id === 'golden_poop' 
              ? t.goldenMessage
              : trash.id === 'diaper'
              ? t.diaperMessage
              : t.defaultMessage}
          </motion.p>

          {/* 閉じるボタン */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={onClose}
            className="tv-button w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-xl">🎁</span>
            <span>{t.throwMore}</span>
          </motion.button>
        </div>

        {/* 装飾 */}
        <div className="absolute top-4 left-4 text-2xl">✨</div>
        <div className="absolute top-4 right-4 text-2xl">✨</div>
        <div className="absolute bottom-4 left-4 text-xl">⭐</div>
        <div className="absolute bottom-4 right-4 text-xl">⭐</div>
      </motion.div>
    </motion.div>
  );
}
