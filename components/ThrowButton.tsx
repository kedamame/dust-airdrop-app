'use client';

import { motion } from 'framer-motion';
import type { TrashType } from '@/app/page';
import type { Language } from '@/lib/i18n';
import { useTranslations } from '@/lib/i18n';

type Props = {
  selectedTrash: TrashType | null;
  recipient: string;
  isThrowing: boolean;
  onThrow: () => void;
  language: Language;
};

export function ThrowButton({ selectedTrash, recipient, isThrowing, onThrow, language }: Props) {
  const t = useTranslations(language);
  const isDisabled = !selectedTrash || !recipient || isThrowing;
  const isGolden = selectedTrash?.id === 'golden_poop';

  return (
    <div className="text-center">
      {/* メインボタン */}
      <motion.button
        onClick={onThrow}
        disabled={isDisabled}
        className={`
          tv-button min-w-[300px] py-6 text-xl
          ${!isDisabled && !isGolden ? 'tv-button-red' : ''}
        `}
        style={isGolden && !isDisabled ? {
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
        } : {}}
        whileHover={!isDisabled ? { scale: 1.05 } : {}}
        whileTap={!isDisabled ? { scale: 0.95 } : {}}
      >
        {isThrowing ? (
          <>
            <span className="text-2xl animate-spin">💫</span>
            <span>{t.throwing}</span>
          </>
        ) : (
          <>
            <span className="text-2xl">{isGolden ? '✨' : '🚀'}</span>
            <span>{t.throwGomi}</span>
            <span className="text-2xl">{isGolden ? '💩' : '🗑️'}</span>
          </>
        )}
      </motion.button>

      {/* 補助テキスト */}
      {!isDisabled && !isThrowing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4"
        >
          <motion.p
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="text-lg font-black text-red-500"
            style={{ textShadow: '0 0 10px rgba(255, 0, 0, 0.5)' }}
          >
            {t.pressToAttack}
          </motion.p>
          {isGolden && (
            <p className="text-sm text-yellow-400 mt-1">
              ✨ {language === 'ja' ? '輝くうんちで金運UP!?' : 'Fortune UP with shining poop!?'} ✨
            </p>
          )}
        </motion.div>
      )}

      {/* 無効時のメッセージ */}
      {isDisabled && !isThrowing && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-gray-400"
        >
          {!selectedTrash 
            ? `👆 ${t.selectGomiFirst}` 
            : `👆 ${t.enterTarget}`}
        </motion.p>
      )}

      {/* ローディング時 */}
      {isThrowing && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <div className="tv-progress w-64 mx-auto">
            <motion.div
              className="tv-progress-bar"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, ease: 'linear' }}
            />
          </div>
          <p className="text-sm text-yellow-300 mt-2">
            {language === 'ja' ? 'ブロックチェーンに刻印中... 🔗' : 'Engraving on blockchain... 🔗'}
          </p>
        </motion.div>
      )}

      {/* 注意書き */}
      <p className="mt-6 text-xs text-gray-500">
        {t.cannotCancel}
      </p>
    </div>
  );
}
