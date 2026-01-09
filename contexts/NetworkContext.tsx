'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type NetworkMode = 'testnet' | 'mainnet';

type NetworkContextType = {
  networkMode: NetworkMode;
  setNetworkMode: (mode: NetworkMode) => void;
  isTestnet: boolean;
  expectedChainId: number;
};

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider({ children }: { children: ReactNode }) {
  // デフォルトは環境変数から取得、なければtestnet
  // サーバー側とクライアント側で同じ初期値を使用（Hydrationエラーを防ぐ）
  const defaultMode = (process.env.NEXT_PUBLIC_USE_TESTNET === 'true' ? 'testnet' : 'mainnet') as NetworkMode;
  
  const [networkMode, setNetworkModeState] = useState<NetworkMode>(defaultMode);
  const [mounted, setMounted] = useState(false);

  // クライアント側でのみマウントされたことを確認
  useEffect(() => {
    setMounted(true);
    // ローカルストレージからネットワークモードを読み込み
    const saved = localStorage.getItem('gomi-nft-network-mode') as NetworkMode | null;
    if (saved === 'testnet' || saved === 'mainnet') {
      setNetworkModeState(saved);
    }
  }, []);

  // ネットワークモード変更時にローカルストレージに保存
  const setNetworkMode = (mode: NetworkMode) => {
    setNetworkModeState(mode);
    localStorage.setItem('gomi-nft-network-mode', mode);
  };

  const isTestnet = networkMode === 'testnet';
  const expectedChainId = isTestnet ? 84532 : 8453; // Base Sepolia or Base Mainnet

  return (
    <NetworkContext.Provider value={{ networkMode, setNetworkMode, isTestnet, expectedChainId }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within NetworkProvider');
  }
  return context;
}

