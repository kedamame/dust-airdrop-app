'use client';

import { motion } from 'framer-motion';
import type { Language } from '@/lib/i18n';
import { useTranslations } from '@/lib/i18n';

type Props = {
  value: string;
  onChange: (value: string) => void;
  language: Language;
};

export function RecipientInput({ value, onChange, language }: Props) {
  const t = useTranslations(language);
  
  return (
    <div className="space-y-4 w-full">
      {/* セクションタイトル */}
      <div className="tv-panel-title">
        <span className="text-2xl">🎯</span>
        <span>{t.selectTarget}</span>
      </div>
      
      {/* 入力フィールド */}
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t.placeholder}
          className="tv-input"
          style={{ paddingLeft: '3.5rem' }}
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">👤</span>
      </div>

      {/* ヘルプテキスト */}
      <div className="bg-black/40 rounded-lg p-3 border border-yellow-500/30">
        <p className="text-sm text-gray-300 mb-2 font-bold">{t.inputHelp}</p>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>{t.inputExamples.farcaster} <span className="text-yellow-300">@vitalik</span></li>
          <li>{t.inputExamples.ens} <span className="text-yellow-300">vitalik.eth</span></li>
          <li>{t.inputExamples.wallet} <span className="text-yellow-300">0x1234...</span></li>
        </ul>
      </div>

      {/* 入力状態インジケーター */}
      <motion.div 
        className="flex items-center gap-3"
        animate={{ opacity: value ? 1 : 0.5 }}
      >
        <motion.div 
          className="w-4 h-4 rounded-full"
          style={{ 
            background: value ? 'linear-gradient(135deg, #00CC00, #00FF00)' : '#444',
            boxShadow: value ? '0 0 15px #00FF00' : 'none',
          }}
          animate={value ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <span 
          className="text-sm font-bold"
          style={{ color: value ? '#00FF00' : '#666' }}
        >
          {value ? t.targetLocked : t.waitingForInput}
        </span>
        {value && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="badge-circle !text-xs !py-1 !bg-green-600"
          >
            OK
          </motion.span>
        )}
      </motion.div>
    </div>
  );
}
