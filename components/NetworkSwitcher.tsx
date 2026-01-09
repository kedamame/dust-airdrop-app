'use client';

import { motion } from 'framer-motion';
import { useNetwork } from '@/contexts/NetworkContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAccount, useChainId } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { useEffect, useState } from 'react';

export function NetworkSwitcher() {
  const { networkMode, setNetworkMode, isTestnet, expectedChainId } = useNetwork();
  const { language } = useLanguage();
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const [isSwitching, setIsSwitching] = useState(false);
  const [mounted, setMounted] = useState(false);

  // クライアント側でのみマウントされたことを確認
  useEffect(() => {
    setMounted(true);
  }, []);

  // チェーン切り替え関数
  const switchChain = async (targetChainId: number) => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) return;

    setIsSwitching(true);
    try {
      // まず、チェーンの切り替えを試みる
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
    } catch (switchError: any) {
      // エラーコード4902は、チェーンがウォレットに追加されていないことを意味する
      if (switchError.code === 4902 || switchError.code === -32603) {
        // チェーンを追加する
        const chainConfig = isTestnet ? baseSepolia : base;
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${targetChainId.toString(16)}`,
                chainName: chainConfig.name,
                nativeCurrency: {
                  name: chainConfig.nativeCurrency.name,
                  symbol: chainConfig.nativeCurrency.symbol,
                  decimals: chainConfig.nativeCurrency.decimals,
                },
                rpcUrls: [chainConfig.rpcUrls.default.http[0]],
                blockExplorerUrls: chainConfig.blockExplorers?.default?.url
                  ? [chainConfig.blockExplorers.default.url]
                  : [],
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding chain:', addError);
        }
      } else if (switchError.code === 4001) {
        // ユーザーが拒否した場合
        console.log('User rejected chain switch');
      } else {
        console.error('Error switching chain:', switchError);
      }
    } finally {
      setIsSwitching(false);
    }
  };

  // ネットワークモード切り替え時にチェーンも切り替える
  const handleNetworkSwitch = async (newMode: 'testnet' | 'mainnet') => {
    setNetworkMode(newMode);
    
    // ウォレットが接続されている場合、チェーンも切り替える
    if (isConnected) {
      const ethereum = (window as any).ethereum;
      if (ethereum) {
        const newChainId = newMode === 'testnet' ? 84532 : 8453;
        await switchChain(newChainId);
      }
    }
  };

  // 現在のチェーンIDと期待するチェーンIDが一致しない場合の警告
  const chainMismatch = isConnected && chainId && chainId !== expectedChainId;

  // サーバー側レンダリング時は空のdivを返す（Hydrationエラーを防ぐ）
  if (!mounted) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 bg-gray-900/80 rounded-lg p-1 border border-gray-700 opacity-50">
          <div className="px-4 py-2 rounded-md text-sm font-semibold bg-transparent text-gray-400">
            🧪 {language === 'ja' ? 'テストネット' : 'Testnet'}
          </div>
          <div className="px-4 py-2 rounded-md text-sm font-semibold bg-transparent text-gray-400">
            🌐 {language === 'ja' ? 'メインネット' : 'Mainnet'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2 bg-gray-900/80 rounded-lg p-1 border border-gray-700">
        <motion.button
          onClick={() => handleNetworkSwitch('testnet')}
          disabled={isSwitching}
          className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
            networkMode === 'testnet'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-transparent text-gray-400 hover:text-white'
          } ${isSwitching ? 'opacity-50 cursor-not-allowed' : ''}`}
          whileHover={networkMode !== 'testnet' && !isSwitching ? { scale: 1.05 } : {}}
          whileTap={networkMode !== 'testnet' && !isSwitching ? { scale: 0.95 } : {}}
        >
          {isSwitching && networkMode === 'testnet' ? '🔄' : '🧪'} {language === 'ja' ? 'テストネット' : 'Testnet'}
        </motion.button>
        <motion.button
          onClick={() => handleNetworkSwitch('mainnet')}
          disabled={isSwitching}
          className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
            networkMode === 'mainnet'
              ? 'bg-green-600 text-white shadow-lg'
              : 'bg-transparent text-gray-400 hover:text-white'
          } ${isSwitching ? 'opacity-50 cursor-not-allowed' : ''}`}
          whileHover={networkMode !== 'mainnet' && !isSwitching ? { scale: 1.05 } : {}}
          whileTap={networkMode !== 'mainnet' && !isSwitching ? { scale: 0.95 } : {}}
        >
          {isSwitching && networkMode === 'mainnet' ? '🔄' : '🌐'} {language === 'ja' ? 'メインネット' : 'Mainnet'}
        </motion.button>
      </div>
      
      {chainMismatch && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-yellow-400 text-center max-w-md px-4"
        >
          ⚠️ {language === 'ja' 
            ? `ネットワークが一致しません。${networkMode === 'testnet' ? 'Base Sepolia' : 'Base Mainnet'}に切り替えてください。`
            : `Network mismatch. Please switch to ${networkMode === 'testnet' ? 'Base Sepolia' : 'Base Mainnet'}.`}
        </motion.div>
      )}
    </div>
  );
}

