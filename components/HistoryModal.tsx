'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadHistory, clearHistory, type ThrowHistory } from '@/lib/history';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAccount } from 'wagmi';
import { useNetwork } from '@/contexts/NetworkContext';

// NetworkContextから取得（なければ環境変数から）
const getExplorerBaseUrl = (): string => {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_USE_TESTNET === 'true'
      ? 'https://base-sepolia.blockscout.com'
      : 'https://base.blockscout.com';
  }
  
  const saved = localStorage.getItem('gomi-nft-network-mode');
  if (saved === 'testnet') return 'https://base-sepolia.blockscout.com';
  if (saved === 'mainnet') return 'https://base.blockscout.com';
  
  return process.env.NEXT_PUBLIC_USE_TESTNET === 'true'
    ? 'https://base-sepolia.blockscout.com'
    : 'https://base.blockscout.com';
};


interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HistoryModal({ isOpen, onClose }: HistoryModalProps) {
  const { language } = useLanguage();
  const { chainId } = useAccount();
  const { isTestnet } = useNetwork();
  const [history, setHistory] = useState<ThrowHistory[]>([]);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // 現在のネットワークモードに応じた履歴を読み込む
      setHistory(loadHistory(isTestnet));
    }
  }, [isOpen, isTestnet]);

  const handleClear = () => {
    if (confirm(language === 'ja' 
      ? `${isTestnet ? 'テストネット' : 'メインネット'}の履歴をすべて削除しますか？` 
      : `Are you sure you want to clear all ${isTestnet ? 'testnet' : 'mainnet'} history?`)) {
      setIsClearing(true);
      clearHistory(isTestnet);
      setHistory([]);
      setTimeout(() => setIsClearing(false), 500);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString(language === 'ja' ? 'ja-JP' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const shortenAddress = (address: string) => {
    if (!address) return '-';
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const openExplorer = (txHash: string) => {
    window.open(`${getExplorerBaseUrl()}/tx/${txHash}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* オーバーレイ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-50"
          />
          
          {/* モーダル */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-700">
              {/* ヘッダー */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span>📜</span>
                    {language === 'ja' ? '送信履歴' : 'Send History'}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    isTestnet 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-green-600 text-white'
                  }`}>
                    {isTestnet 
                      ? (language === 'ja' ? 'テストネット' : 'Testnet')
                      : (language === 'ja' ? 'メインネット' : 'Mainnet')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {history.length > 0 && (
                    <button
                      onClick={handleClear}
                      disabled={isClearing}
                      className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      {language === 'ja' ? '全削除' : 'Clear All'}
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="w-10 h-10 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* コンテンツ */}
              <div className="flex-1 overflow-y-auto p-6">
                {history.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <div className="text-6xl mb-4">📭</div>
                    <p className="text-lg">
                      {language === 'ja' 
                        ? 'まだ送信履歴がありません' 
                        : 'No send history yet'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-3xl">{item.trashEmoji}</span>
                              <div>
                                <div className="font-semibold text-white">
                                  {item.trashName}
                                </div>
                                <div className="text-sm text-gray-400">
                                  {formatDate(item.timestamp)}
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-3 space-y-1 text-sm">
                              <div className="flex items-center gap-2 text-gray-300">
                                <span className="text-gray-500">
                                  {language === 'ja' ? '送信先:' : 'To:'}
                                </span>
                                <span className="font-mono">
                                  {item.recipient.includes('0x') 
                                    ? shortenAddress(item.recipient) 
                                    : item.recipient}
                                </span>
                                {item.recipientAddress && item.recipientAddress !== item.recipient && (
                                  <span className="text-gray-500 text-xs">
                                    ({shortenAddress(item.recipientAddress)})
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500">
                                  {language === 'ja' ? 'TX:' : 'TX:'}
                                </span>
                                <button
                                  onClick={() => openExplorer(item.transactionHash)}
                                  className="font-mono text-blue-400 hover:text-blue-300 underline text-xs"
                                >
                                  {shortenAddress(item.transactionHash)}
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => openExplorer(item.transactionHash)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors whitespace-nowrap"
                          >
                            {language === 'ja' ? '確認' : 'View'}
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

