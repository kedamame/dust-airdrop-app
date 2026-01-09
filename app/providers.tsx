'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { base, baseSepolia } from 'wagmi/chains';
import { useState, useEffect, type ReactNode } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { NetworkProvider } from '@/contexts/NetworkContext';

// テストネットモードかどうか（環境変数で切り替え可能）
const USE_TESTNET = process.env.NEXT_PUBLIC_USE_TESTNET === 'true';
const selectedChain = USE_TESTNET ? baseSepolia : base;

// MetaMask関連のエラーを判定する関数
const isWalletError = (error: unknown): boolean => {
  const errorString = String(error || '');
  const errorMessage = (error as Error)?.message || '';
  const combined = errorString + errorMessage;
  
  return (
    combined.includes('MetaMask') ||
    combined.includes('metamask') ||
    combined.includes('Failed to connect') ||
    combined.includes('User rejected') ||
    combined.includes('Already processing') ||
    combined.includes('wallet') ||
    combined.includes('Wallet') ||
    combined.includes('inpage.js')
  );
};

// モジュールレベルでのエラーハンドラー設定を削除（Next.jsのSSRで問題を引き起こす可能性があるため）

const config = createConfig({
  chains: [base, baseSepolia], // 両方のチェーンをサポート
  connectors: [
    injected({
      shimDisconnect: false, // 実際の接続状態を反映するためfalseに変更
    }),
  ],
  transports: {
    [base.id]: http(
      process.env.NEXT_PUBLIC_BASE_MAINNET_RPC || 'https://mainnet.base.org'
    ),
    [baseSepolia.id]: http(
      process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || 'https://sepolia.base.org'
    ),
  },
});

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  // MetaMask関連のエラーをグローバルでキャッチして無視（追加のリスナー）
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (isWalletError(event.reason)) {
        console.log('Suppressed wallet error (listener):', event.reason?.message || event.reason);
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        return false;
      }
    };

    const handleError = (event: ErrorEvent) => {
      if (isWalletError(event.error) || isWalletError(event.message)) {
        console.log('Suppressed wallet error (listener):', event.message);
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        return false;
      }
    };

    // captureフェーズでキャッチして、他のハンドラーに伝播させない
    window.addEventListener('unhandledrejection', handleUnhandledRejection, true);
    window.addEventListener('error', handleError, true);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection, true);
      window.removeEventListener('error', handleError, true);
    };
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <NetworkProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </NetworkProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}


