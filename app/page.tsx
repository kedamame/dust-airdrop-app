'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { TrashSelector } from '@/components/TrashSelector';
import { RecipientInput } from '@/components/RecipientInput';
import { ThrowButton } from '@/components/ThrowButton';
import { TVBackground } from '@/components/TVBackground';
import { SuccessModal } from '@/components/SuccessModal';
import { HistoryModal } from '@/components/HistoryModal';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { WalletConnect } from '@/components/WalletConnect';
import { NetworkSwitcher } from '@/components/NetworkSwitcher';
import { useAccount, useChainId } from 'wagmi';
import { useFarcasterSDK } from '@/hooks/useFarcasterSDK';
import { useTrashNFT, useResolveAddress } from '@/hooks/useTrashNFT';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations, translations } from '@/lib/i18n';
import { addHistoryItem } from '@/lib/history';

export type TrashType = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  rarity: 'common' | 'rare' | 'legendary' | 'mythical';
  stinkLevel: number;
};

// ゴミの基本データ（言語非依存）
const TRASH_TYPES_BASE = [
  { id: 'banana', emoji: '🍌', rarity: 'common' as const, stinkLevel: 3 },
  { id: 'diaper', emoji: '👶', rarity: 'legendary' as const, stinkLevel: 10 },
  { id: 'mystery', emoji: '🟤', rarity: 'mythical' as const, stinkLevel: 8 },
  { id: 'egg', emoji: '🥚', rarity: 'common' as const, stinkLevel: 6 },
  { id: 'poop', emoji: '💩', rarity: 'legendary' as const, stinkLevel: 10 },
  { id: 'golden_poop', emoji: '💩', rarity: 'mythical' as const, stinkLevel: 10 },
];

// 言語に応じたゴミタイプを生成
function getTrashTypes(language: 'ja' | 'en'): TrashType[] {
  const t = translations[language];
  
  return TRASH_TYPES_BASE.map(trash => {
    const trashId = trash.id as keyof typeof t.trash;
    const descriptionId = trash.id as keyof typeof t.descriptions;
    
    return {
      ...trash,
      name: t.trash[trashId] || trash.id,
      description: t.descriptions[descriptionId] || '',
    };
  });
}

export default function Home() {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const trashTypes = useMemo(() => getTrashTypes(language), [language]);
  const [selectedTrashId, setSelectedTrashId] = useState<string | null>(null);
  const [recipient, setRecipient] = useState('');
  const [resolvedRecipientAddress, setResolvedRecipientAddress] = useState<string>('');
  const [isThrowing, setIsThrowing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  // 投げた回数（初期値は0、クライアントサイドでローカルストレージから読み込む）
  const [throwCount, setThrowCount] = useState(0);
  const [isThrowCountLoaded, setIsThrowCountLoaded] = useState(false);
  const { context } = useFarcasterSDK();
  
  // クライアントサイドでローカルストレージから投げた回数を読み込む
  useEffect(() => {
    const saved = localStorage.getItem('trashNFT_throwCount');
    if (saved) {
      setThrowCount(parseInt(saved, 10));
    }
    setIsThrowCountLoaded(true);
  }, []);
  
  // 投げた回数をローカルストレージに保存（初回読み込み完了後のみ）
  useEffect(() => {
    if (isThrowCountLoaded) {
      localStorage.setItem('trashNFT_throwCount', throwCount.toString());
    }
  }, [throwCount, isThrowCountLoaded]);
  
  // 選択中のゴミをIDから取得（言語変更時も自動更新）
  const selectedTrash = useMemo(() => {
    return selectedTrashId ? trashTypes.find(t => t.id === selectedTrashId) || null : null;
  }, [selectedTrashId, trashTypes]);
  
  const handleSelectTrash = useCallback((trash: TrashType) => {
    setSelectedTrashId(trash.id);
  }, []);
  
  // NFT送信機能
  const { 
    throwTrash, 
    isWritePending, 
    isConfirming, 
    isConfirmed, 
    error: nftError,
    receipt,
    hash: txHash,
    contractAddress,
    resetState
  } = useTrashNFT();
  const chainId = useChainId();
  const { resolve } = useResolveAddress();

  // トランザクション確認時の処理
  useEffect(() => {
    if (isConfirmed && receipt && isThrowing && selectedTrash && recipient) {
      setIsThrowing(false);
      setShowSuccess(true);
      setThrowCount(prev => prev + 1);
      
      // 履歴に追加
      if (txHash) {
        // ネットワークモードを取得（chainIdから判定）
        const isTestnet = chainId === 84532;
        addHistoryItem({
          recipient: recipient, // 入力値（解決前の値も保存）
          recipientAddress: resolvedRecipientAddress || receipt.to || '', // 解決後のアドレス
          trashId: selectedTrash.id,
          trashName: selectedTrash.name,
          trashEmoji: selectedTrash.emoji,
          transactionHash: txHash,
          chainId: chainId,
        }, isTestnet);
      }
    }
  }, [isConfirmed, receipt, isThrowing, selectedTrash, recipient, resolvedRecipientAddress, txHash, chainId]);

  // 成功モーダルを閉じる時の処理
  const handleCloseSuccess = useCallback(() => {
    setShowSuccess(false);
    // 前回の送信状態をリセット
    resetState();
  }, [resetState]);

  // トランザクションハッシュが取得された時の処理
  useEffect(() => {
    if (txHash && isThrowing) {
      console.log('Transaction hash received:', txHash);
      // トランザクションが送信されたので、確認を待つ
    }
  }, [txHash, isThrowing]);

  // エラー表示
  useEffect(() => {
    if (nftError && isThrowing) {
      console.error('NFT error:', nftError);
      alert(`${t.transactionFailed}: ${nftError}`);
      setIsThrowing(false);
    }
  }, [nftError, isThrowing, t]);

  const handleThrow = useCallback(async () => {
    if (!selectedTrash || !recipient) {
      console.warn('Missing required data:', { selectedTrash, recipient });
      return;
    }

    // 前回の送信状態をリセット
    resetState();
    
    console.log('Starting NFT throw process...');
    setIsThrowing(true);

    try {
      // 送り先アドレスを解決
      console.log('Resolving recipient address:', recipient);
      const recipientAddress = await resolve(recipient);
      
      if (!recipientAddress) {
        console.error('Failed to resolve recipient address');
        alert(t.resolveFailed);
        setIsThrowing(false);
        return;
      }

      console.log('Recipient address resolved:', recipientAddress);
      // 解決済みアドレスを保存（履歴用）
      setResolvedRecipientAddress(recipientAddress);

      // 通販風の紙吹雪
      const colors = ['#FFD700', '#FF0000', '#FFFFFF', '#FF69B4'];
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
        colors,
        scalar: 1.5,
      });

      // NFTをミント＆送信（コントラクトが一度に実行）
      console.log('Calling throwTrash function...');
      const result = await throwTrash(recipientAddress, selectedTrash);
      console.log('throwTrash result:', result);
      
      // トランザクション送信後、確認を待つ（useEffectで処理）
      // タイムアウト処理（60秒に延長）
      setTimeout(() => {
        if (isThrowing && !isConfirmed) {
          console.warn('Transaction confirmation timeout');
          setIsThrowing(false);
          alert(language === 'ja' ? 'トランザクションの確認に時間がかかっています。ウォレットで確認してください。' : 'Transaction confirmation is taking time. Please check your wallet.');
        }
      }, 60000);
    } catch (err) {
      console.error('NFT送信エラー:', err);
      alert(`${t.transactionFailed}: ${err instanceof Error ? err.message : language === 'ja' ? '不明なエラー' : 'Unknown error'}`);
      setIsThrowing(false);
    }
  }, [selectedTrash, recipient, throwTrash, resolve, isThrowing, isConfirmed, t, language, resetState]);

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* 言語切り替え */}
      <LanguageSwitcher />
      
      {/* 背景 */}
      <TVBackground />

      {/* テロップ */}
      <div className="ticker-wrap fixed top-0 left-0 right-0 z-30">
        <div className="ticker">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex">
              <span className="ticker-item">{t.ticker.limited}</span>
              <span className="ticker-item">{t.ticker.freeShipping}</span>
              <span className="ticker-item">{t.ticker.legendary}</span>
              <span className="ticker-item">{t.ticker.gift}</span>
            </div>
          ))}
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20 w-full">
        
        {/* タイトルエリア */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-8 w-full max-w-4xl mx-auto"
        >
          {/* 限定バッジ */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="badge-circle mb-4 text-sm"
          >
            {t.webLimited}
          </motion.div>

          {/* メインタイトル */}
          <h1 className="tv-title text-4xl md:text-6xl mb-4">
            {t.title}
          </h1>
          
          {/* サブタイトル */}
          <div className="ribbon text-xl md:text-2xl mb-6">
            {t.subtitle}
          </div>

          {/* キャッチコピー */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-xl text-yellow-300 font-bold"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
          >
            {t.catchphrase}
          </motion.p>
        </motion.div>

        {/* ネットワーク切り替え */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4 flex justify-center"
        >
          <NetworkSwitcher />
        </motion.div>

        {/* ウォレット接続 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 flex justify-center"
        >
          <WalletConnect />
        </motion.div>

        {/* ステータスバー */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex gap-4 mb-6 flex-wrap justify-center w-full"
        >
          {context?.user && (
            <div className="badge-circle !bg-blue-600 text-sm">
              👤 {context.user.username || t.guest}
            </div>
          )}
          <div className="badge-circle text-sm" style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)' }}>
            🗑️ {t.thrown}: {throwCount}
          </div>
          <button
            onClick={() => setShowHistory(true)}
            className="badge-circle text-sm !bg-purple-600 hover:!bg-purple-700 transition-colors cursor-pointer"
          >
            📜 {language === 'ja' ? '履歴' : 'History'}
          </button>
        </motion.div>

        {/* メインコンテンツ */}
        <div className="w-full max-w-lg mx-auto space-y-6">
          {/* ゴミ選択 */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="tv-panel"
          >
            <TrashSelector
              trashTypes={trashTypes}
              selectedTrash={selectedTrash}
              onSelect={handleSelectTrash}
              language={language}
            />
          </motion.div>

          {/* 送り先入力 */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="tv-panel"
          >
            <RecipientInput
              value={recipient}
              language={language}
              onChange={setRecipient}
            />
          </motion.div>

          {/* 投げるボタン */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center"
          >
            <ThrowButton
              selectedTrash={selectedTrash}
              recipient={recipient}
              isThrowing={isThrowing}
              onThrow={handleThrow}
              language={language}
            />
          </motion.div>
        </div>

        {/* 注意書き */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 max-w-md text-center mx-auto"
        >
          <p className="text-xs text-gray-400">
            {t.warning}<br/>
            {t.noReturns}<br/>
            {t.individualResults}
          </p>
        </motion.div>
      </div>

      {/* 成功モーダル */}
      <AnimatePresence>
        {showSuccess && selectedTrash && (
          <SuccessModal
            trash={selectedTrash}
            recipient={recipient}
            onClose={handleCloseSuccess}
            language={language}
            tokenId={receipt?.logs?.[0]?.topics?.[3] ? BigInt(receipt.logs[0].topics[3]) : undefined}
            contractAddress={contractAddress || undefined}
            transactionHash={txHash}
            chainId={chainId}
          />
        )}
      </AnimatePresence>

      {/* 履歴モーダル */}
      <HistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
      />

      {/* 投げている時のオーバーレイ */}
      <AnimatePresence>
        {isThrowing && selectedTrash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'radial-gradient(ellipse, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.98) 100%)' }}
          >
            {/* スポットライト */}
            <div className="absolute inset-0 overflow-hidden">
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px]"
                style={{ 
                  background: 'radial-gradient(ellipse, rgba(255, 215, 0, 0.3) 0%, transparent 70%)',
                }}
              />
            </div>

            {/* 飛んでいくゴミ */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ 
                scale: [0, 1.5, 1.5, 0.5],
                rotate: [-180, 0, 360, 720],
                y: [0, -50, -50, 300],
                x: [0, 0, 0, 200],
              }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className={`text-8xl ${selectedTrash.id === 'golden_poop' ? 'golden-special' : ''}`}
            >
              {selectedTrash.emoji}
            </motion.div>

            {/* テキスト */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-1/3"
            >
              <div className="tv-title text-3xl md:text-5xl text-center">
                {selectedTrash.id === 'golden_poop' ? (
                  <span className="golden-text">✨ GOLDEN ATTACK! ✨</span>
                ) : (
                  '🚀 投げています...! 🚀'
                )}
              </div>
            </motion.div>

            {/* プログレスバー */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-64">
              <div className="tv-progress">
                <motion.div
                  className="tv-progress-bar"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, ease: 'linear' }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
