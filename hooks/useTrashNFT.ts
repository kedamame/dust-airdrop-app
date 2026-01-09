'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAccount, useChainId, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseAbi } from 'viem';
import type { TrashType } from '@/app/page';
import { useNetwork } from '@/contexts/NetworkContext';

// TrashNFTコントラクトのABI（必要な関数のみ）
const TRASH_NFT_ABI = parseAbi([
  'function throwTrash(address to, string name, string emoji, string description, uint8 stinkLevel) returns (uint256)',
  'function totalSupply() view returns (uint256)',
  'event TrashThrown(uint256 indexed tokenId, address indexed from, address indexed to, string trashName, uint8 stinkLevel)',
]);

// アドレスの検証と正規化
function validateAddress(address: string): `0x${string}` | null {
  if (!address || address === '0x0000000000000000000000000000000000000000') {
    return null;
  }
  
  // アドレスは42文字（0x + 40文字）である必要がある
  if (address.length !== 42) {
    console.error(`Invalid address length: ${address.length} (expected 42)`);
    return null;
  }
  
  // 16進数チェック
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    console.error(`Invalid address format: ${address}`);
    return null;
  }
  
  return address.toLowerCase() as `0x${string}`;
}

// テストネット用とメインネット用のコントラクトアドレスを取得
function getContractAddress(isTestnet: boolean): `0x${string}` | null {
  // まず、テストネット/メインネット専用の環境変数を確認
  const specificAddress = isTestnet
    ? process.env.NEXT_PUBLIC_TRASH_NFT_ADDRESS_TESTNET
    : process.env.NEXT_PUBLIC_TRASH_NFT_ADDRESS_MAINNET;
  
  // 専用の環境変数がない場合は、共通の環境変数を確認（後方互換性のため）
  const fallbackAddress = process.env.NEXT_PUBLIC_TRASH_NFT_ADDRESS;
  
  const addressRaw = specificAddress || fallbackAddress || '0x0000000000000000000000000000000000000000';
  const validated = validateAddress(addressRaw);
  
  if (typeof window !== 'undefined') {
    console.log(`TrashNFT Contract Address (${isTestnet ? 'Testnet' : 'Mainnet'}):`, validated || addressRaw);
    if (!validated) {
      console.error(`⚠️ ${isTestnet ? 'テストネット' : 'メインネット'}用のコントラクトアドレスが無効です。.env.localの${isTestnet ? 'NEXT_PUBLIC_TRASH_NFT_ADDRESS_TESTNET' : 'NEXT_PUBLIC_TRASH_NFT_ADDRESS_MAINNET'}を確認してください。`);
    }
  }
  
  return validated;
}

export function useTrashNFT() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [error, setError] = useState<string | null>(null);
  
  // NetworkContextから取得
  const { isTestnet, expectedChainId } = useNetwork();
  
  // NetworkContextの設定に基づいてコントラクトアドレスを取得
  // 実際のチェーンIDではなく、ユーザーが選択したネットワークモードに基づく
  const TRASH_NFT_ADDRESS = getContractAddress(isTestnet);

  const { 
    data: hash,
    isPending: isWritePending,
    writeContract,
    reset,
    error: writeError,
  } = useWriteContract();

  const { 
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    data: receipt,
    error: receiptError,
  } = useWaitForTransactionReceipt({ hash });

  // エラーを監視
  useEffect(() => {
    if (writeError) {
      console.error('Write contract error:', writeError);
      setError(writeError.message || 'トランザクションの送信に失敗しました');
    }
  }, [writeError]);

  useEffect(() => {
    if (receiptError) {
      console.error('Transaction receipt error:', receiptError);
      setError(receiptError.message || 'トランザクションの確認に失敗しました');
    }
  }, [receiptError]);

  const throwTrash = useCallback(async (
    recipientAddress: `0x${string}`,
    trash: TrashType,
  ): Promise<`0x${string}` | null> => {
    // 接続状態を確認
    if (!isConnected || !address) {
      const errorMsg = 'ウォレットが接続されていません。ウォレットを接続してください。';
      setError(errorMsg);
      console.error(errorMsg);
      return null;
    }

    // コントラクトアドレスの検証
    if (!TRASH_NFT_ADDRESS) {
      const envVarName = isTestnet 
        ? 'NEXT_PUBLIC_TRASH_NFT_ADDRESS_TESTNET'
        : 'NEXT_PUBLIC_TRASH_NFT_ADDRESS_MAINNET';
      const errorMsg = `${isTestnet ? 'テストネット' : 'メインネット'}用のコントラクトアドレスが無効です。.env.localの${envVarName}を確認してください。`;
      setError(errorMsg);
      console.error(errorMsg);
      console.error('Network mode:', isTestnet ? 'testnet' : 'mainnet');
      console.error('Expected chain ID:', expectedChainId);
      return null;
    }

    // チェーンIDの確認
    if (chainId && chainId !== expectedChainId) {
      const networkName = isTestnet ? 'Base Sepolia' : 'Base Mainnet';
      const errorMsg = `ネットワークが正しくありません。${networkName} (${expectedChainId}) に切り替えてください。現在: ${chainId}`;
      setError(errorMsg);
      console.error(errorMsg);
      console.error('Expected chain ID:', expectedChainId, 'Current:', chainId);
      console.error('Network mode:', isTestnet ? 'testnet' : 'mainnet');
      return null;
    }

    // デバッグ情報
    console.log('Throwing trash:', {
      contractAddress: TRASH_NFT_ADDRESS,
      recipient: recipientAddress,
      trash: trash.name,
      chainId,
      expectedChainId,
      isConnected,
      isTestnet,
      networkMode: isTestnet ? 'testnet' : 'mainnet',
    });

    try {
      setError(null);

      console.log('Calling writeContract with:', {
        address: TRASH_NFT_ADDRESS,
        functionName: 'throwTrash',
        chainId: expectedChainId,
        networkMode: isTestnet ? 'testnet' : 'mainnet',
        args: {
          to: recipientAddress,
          name: trash.name,
          emoji: trash.emoji,
          description: trash.description,
          stinkLevel: trash.stinkLevel,
        },
      });

      // writeContractを呼び出し（ミント＆転送を一度に実行）
      writeContract({
        address: TRASH_NFT_ADDRESS,
        abi: TRASH_NFT_ABI,
        functionName: 'throwTrash',
        chainId: expectedChainId, // 明示的にチェーンIDを指定
        args: [
          recipientAddress,  // 送り先アドレス（NFTはここに直接ミントされる）
          trash.name,
          trash.emoji,
          trash.description,
          trash.stinkLevel,
        ],
      });

      console.log('writeContract called successfully');
      
      // hashは非同期で更新されるため、少し待つ
      // 実際のhashはuseWriteContractのhookから取得される
      return null;
    } catch (err) {
      console.error('Throw trash error:', err);
      const message = err instanceof Error ? err.message : '不明なエラー';
      setError(message);
      return null;
    }
  }, [isConnected, address, writeContract, chainId, expectedChainId, isTestnet, TRASH_NFT_ADDRESS]);

  const resetState = useCallback(() => {
    reset();
    setError(null);
  }, [reset]);

  return {
    // 状態
    isConnected: isConnected && !!address,
    address,
    error,
    hash,
    receipt,
    contractAddress: TRASH_NFT_ADDRESS,
    
    // ローディング状態
    isWritePending,
    isConfirming,
    isConfirmed,
    
    // アクション
    throwTrash,
    resetState,
  };
}

// ユーザー名/ENSをアドレスに解決するフック
export function useResolveAddress() {
  const [isResolving, setIsResolving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolve = useCallback(async (query: string): Promise<`0x${string}` | null> => {
    if (!query) return null;

    // すでにアドレスの場合
    if (query.startsWith('0x') && query.length === 42) {
      return query as `0x${string}`;
    }

    setIsResolving(true);
    setError(null);

    try {
      const response = await fetch(`/api/resolve?q=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (data.address) {
        return data.address as `0x${string}`;
      }

      setError('アドレスを解決できませんでした');
      return null;
    } catch (err) {
      setError('解決中にエラーが発生しました');
      return null;
    } finally {
      setIsResolving(false);
    }
  }, []);

  return {
    resolve,
    isResolving,
    error,
  };
}
