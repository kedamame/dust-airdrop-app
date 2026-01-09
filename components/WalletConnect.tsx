'use client';

import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNetwork } from '@/contexts/NetworkContext';
import { useTranslations } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

export function WalletConnect() {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [actualConnected, setActualConnected] = useState(false);
  
  // NetworkContextから取得
  const { isTestnet, expectedChainId } = useNetwork();

  // チェーンを自動切り替えする関数（Rabbyウォレット対応）
  const switchChainDirectly = useCallback(async (targetChainId: number) => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) return;

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
          setError(
            language === 'ja' 
              ? `ネットワークを${isTestnet ? 'Base Sepolia' : 'Base Mainnet'}に追加できませんでした`
              : `Failed to add ${isTestnet ? 'Base Sepolia' : 'Base Mainnet'} network`
          );
        }
      } else if (switchError.code === 4001) {
        // ユーザーが拒否した場合
        console.log('User rejected chain switch');
      } else {
        console.error('Error switching chain:', switchError);
        setError(
          language === 'ja' 
            ? `ネットワークを${isTestnet ? 'Base Sepolia' : 'Base Mainnet'}に切り替えられませんでした`
            : `Failed to switch to ${isTestnet ? 'Base Sepolia' : 'Base Mainnet'} network`
        );
      }
    }
  }, [isTestnet, language, setError]);

  // クライアント側でのみマウントされたことを確認
  useEffect(() => {
    setMounted(true);
  }, []);

  // ウォレット側の実際の接続状態を確認
  useEffect(() => {
    if (!mounted) return;

    const checkWalletConnection = async () => {
      if (typeof window === 'undefined') {
        setActualConnected(false);
        return;
      }

      const ethereum = (window as any).ethereum;
      if (!ethereum) {
        setActualConnected(false);
        return;
      }

      try {
        // ウォレット側の接続状態を確認
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        const isWalletConnected = accounts && accounts.length > 0;
        setActualConnected(isWalletConnected && isConnected && !!address);
        
        // 接続されている場合、チェーンIDを確認して自動切り替え
        if (isWalletConnected && isConnected && address) {
          try {
            const currentChainId = await ethereum.request({ method: 'eth_chainId' });
            const currentChainIdNumber = parseInt(currentChainId, 16);
            console.log('Current wallet chain ID:', currentChainIdNumber, 'Expected:', expectedChainId);
            
            if (currentChainIdNumber !== expectedChainId) {
              console.log('Chain mismatch detected, switching...');
              await switchChainDirectly(expectedChainId);
            }
          } catch (err) {
            console.error('Error checking chain ID:', err);
          }
        }
      } catch (err) {
        console.error('Error checking wallet connection:', err);
        setActualConnected(false);
      }
    };

    checkWalletConnection();
    
    // ウォレットの接続状態が変更されたときに確認
    const ethereum = (window as any).ethereum;
    if (ethereum) {
      const handleAccountsChanged = () => {
        checkWalletConnection();
      };
      
      const handleDisconnect = () => {
        setActualConnected(false);
      };

      const handleChainChanged = (newChainId: string) => {
        console.log('Chain changed to:', parseInt(newChainId, 16));
        checkWalletConnection();
      };

      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('disconnect', handleDisconnect);
      ethereum.on('chainChanged', handleChainChanged);
      
      return () => {
        if (ethereum) {
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
          ethereum.removeListener('disconnect', handleDisconnect);
          ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [mounted, isConnected, address, expectedChainId, switchChainDirectly]);

  // エラーハンドリング
  useEffect(() => {
    if (connectError) {
      const errorMessage = connectError.message || '';
      
      // ユーザーが拒否した場合
      if (errorMessage.includes('User rejected') || errorMessage.includes('rejected')) {
        setError(language === 'ja' ? '接続がキャンセルされました' : 'Connection was cancelled');
        return;
      }
      
      // その他のエラー
      if (errorMessage.includes('No Ethereum provider')) {
        setError(language === 'ja' ? 'ウォレット拡張機能が見つかりません。MetaMaskなどをインストールしてください。' : 'Wallet extension not found. Please install MetaMask or similar.');
      } else {
        setError(language === 'ja' ? '接続に失敗しました' : 'Connection failed');
      }
    } else {
      setError(null);
    }
  }, [connectError, language]);

  // 接続成功時にエラーをクリア
  useEffect(() => {
    if (isConnected) {
      setError(null);
    }
  }, [isConnected]);

  // チェーンが接続されたときに、期待するチェーンに自動切り替え（wagmiのchainIdを使用）
  useEffect(() => {
    if (isConnected && chainId && chainId !== expectedChainId) {
      console.log(`Wagmi chain ID: ${chainId}, Expected: ${expectedChainId}, Switching...`);
      switchChainDirectly(expectedChainId);
    }
  }, [isConnected, chainId, expectedChainId, switchChainDirectly]);

  // 利用可能なコネクターを探す
  const connector = connectors.find(c => c.id === 'injected') || connectors[0];

  const handleConnect = async () => {
    if (!connector) {
      setError(language === 'ja' ? 'ウォレット拡張機能が見つかりません。MetaMaskなどをインストールしてください。' : 'Wallet extension not found. Please install MetaMask or similar.');
      return;
    }

    setError(null);
    
    // 接続前にチェーンを確認して切り替える
    const ethereum = (window as any).ethereum;
    if (ethereum) {
      try {
        const currentChainId = await ethereum.request({ method: 'eth_chainId' });
        const currentChainIdNumber = parseInt(currentChainId, 16);
        console.log('Pre-connect chain ID:', currentChainIdNumber, 'Expected:', expectedChainId);
        
        if (currentChainIdNumber !== expectedChainId) {
          console.log('Switching chain before connect...');
          await switchChainDirectly(expectedChainId);
          // チェーン切り替え後に少し待つ
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (err) {
        console.error('Error checking/switching chain before connect:', err);
      }
    }
    
    connect({ connector });
  };

  const handleDisconnect = async () => {
    try {
      setError(null);
      
      // ウォレット側の接続も切断
      const ethereum = (window as any).ethereum;
      if (ethereum && ethereum.isMetaMask) {
        try {
          // MetaMaskの場合は、接続を切断
          await ethereum.request({
            method: 'wallet_revokePermissions',
            params: [{ eth_accounts: {} }],
          });
        } catch (err) {
          console.log('Error revoking permissions:', err);
        }
      }
      
      // wagmiの接続状態も切断
      disconnect();
      setActualConnected(false);
    } catch (err) {
      console.error('Error disconnecting:', err);
      // エラーが発生してもwagmiの切断は実行
      disconnect();
      setActualConnected(false);
    }
  };

  // サーバー側レンダリング時は空のdivを返す（Hydrationエラーを防ぐ）
  if (!mounted) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="tv-button px-6 py-3 text-lg font-bold opacity-50" style={{
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)',
        }}>
          <span>🔗 {t.connectWallet || 'ウォレットを接続'}</span>
        </div>
      </div>
    );
  }

  // 接続済みの場合（実際の接続状態も確認）
  if (actualConnected && isConnected && address) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-3"
      >
        <div className="flex items-center gap-3">
          <div className="badge-circle !bg-green-600 text-sm">
            ✅ {t.walletConnected || 'ウォレット接続済み'}
          </div>
          <div className="text-xs text-gray-300 font-mono">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
          <button
            onClick={handleDisconnect}
            className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
          >
            {t.disconnect || '切断'}
          </button>
        </div>
      </motion.div>
    );
  }

  // 未接続の場合
  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={handleConnect}
        disabled={isPending || !connector}
        className="tv-button px-6 py-3 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)',
        }}
      >
        {isPending ? (
          <span>🔄 {t.connecting || '接続中...'}</span>
        ) : (
          <span>🔗 {t.connectWallet || 'ウォレットを接続'}</span>
        )}
      </motion.button>
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-400 text-center max-w-md px-4"
        >
          ⚠️ {error}
        </motion.div>
      )}
      
      {!connector && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-yellow-400 text-center max-w-md px-4"
        >
          💡 {language === 'ja' 
            ? 'MetaMaskなどのウォレット拡張機能をインストールしてください' 
            : 'Please install a wallet extension like MetaMask'}
        </motion.div>
      )}
    </div>
  );
}
