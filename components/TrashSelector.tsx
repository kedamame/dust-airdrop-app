'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { TrashType } from '@/app/page';
import type { Language } from '@/lib/i18n';
import { useTranslations } from '@/lib/i18n';

type Props = {
  trashTypes: TrashType[];
  selectedTrash: TrashType | null;
  onSelect: (trash: TrashType) => void;
  language: Language;
};

const rarityColors = {
  common: '#888',
  rare: '#0088FF',
  legendary: '#FFD700',
  mythical: '#9933FF',
};

// 最終兵器（赤ちゃんの絵文字におむつを重ねる）のSVGコンポーネント
function DiaperSVG({ size = 64 }: { size?: number }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block', width: size, height: size }}>
      {/* 背景：赤ちゃんの絵文字 */}
      <div 
        style={{ 
          fontSize: `${size * 0.75}px`, 
          lineHeight: `${size}px`,
          textAlign: 'center',
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: 1
        }}
      >
        👶
      </div>
      {/* 前面：おむつのSVG（赤ちゃんの下半身に重ねる、右側にずらして顔が見えるように） */}
      <svg 
        viewBox="0 0 100 100" 
        width={size * 0.65}
        height={size * 0.45}
        style={{ 
          position: 'absolute',
          bottom: size * 0.15,
          left: '60%',
          transform: 'translateX(-50%)',
          zIndex: 2
        }}
      >
        <defs>
          <linearGradient id="diaperGrad-overlay" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#FFFFFF' }} />
            <stop offset="20%" style={{ stopColor: '#FAFAFA' }} />
            <stop offset="50%" style={{ stopColor: '#F5F5F5' }} />
            <stop offset="80%" style={{ stopColor: '#F0F0F0' }} />
            <stop offset="100%" style={{ stopColor: '#E8E8E8' }} />
          </linearGradient>
          <linearGradient id="waistBandGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#F8F8F8' }} />
            <stop offset="50%" style={{ stopColor: '#F0F0F0' }} />
            <stop offset="100%" style={{ stopColor: '#E8E8E8' }} />
          </linearGradient>
          <linearGradient id="tapeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#F5F5F5' }} />
            <stop offset="30%" style={{ stopColor: '#F8F8F8' }} />
            <stop offset="70%" style={{ stopColor: '#F8F8F8' }} />
            <stop offset="100%" style={{ stopColor: '#F5F5F5' }} />
          </linearGradient>
          <linearGradient id="tapeAdhesive" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#E8E8E8' }} />
            <stop offset="50%" style={{ stopColor: '#F0F0F0' }} />
            <stop offset="100%" style={{ stopColor: '#E8E8E8' }} />
          </linearGradient>
          <filter id="shadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1"/>
            <feOffset dx="0" dy="1" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {/* おむつの本体（上部が広く、下部が少し狭い、角を丸く） */}
        <path 
          d="M 12 8 Q 12 5 15 5 L 85 5 Q 88 5 88 8 L 90 72 Q 90 75 87 75 L 13 75 Q 10 75 10 72 Z" 
          fill="url(#diaperGrad-overlay)" 
          stroke="#D5D5D5" 
          strokeWidth="1.5"
          filter="url(#shadow)"
        />
        {/* おむつの上部ウエストバンド（ゴム部分 - より詳細に） */}
        <rect x="12" y="5" width="76" height="4" rx="2" fill="url(#waistBandGrad)" stroke="#C8C8C8" strokeWidth="0.5"/>
        {/* ウエストバンドの折り返し部分（2層で立体感） */}
        <path 
          d="M 15 5 Q 50 7 85 5" 
          stroke="#B8B8B8" 
          strokeWidth="1" 
          fill="none"
          opacity="0.6"
        />
        <path 
          d="M 15 7 Q 50 9 85 7" 
          stroke="#B8B8B8" 
          strokeWidth="0.8" 
          fill="none"
          opacity="0.4"
        />
        {/* おむつの中央部分（お尻の膨らみを表現 - より立体的に） */}
        <ellipse cx="50" cy="45" rx="32" ry="22" fill="#FFFFFF" opacity="0.25"/>
        <ellipse cx="50" cy="42" rx="28" ry="18" fill="#FFFFFF" opacity="0.15"/>
        {/* おむつの縫い目（中央の縦線） */}
        <line x1="50" y1="10" x2="50" y2="70" stroke="#D8D8D8" strokeWidth="0.8" opacity="0.4" strokeDasharray="2,2"/>
        {/* おむつのテープ（左側 - より詳細に） */}
        <g transform="translate(2, 10)">
          {/* テープのベース */}
          <rect x="0" y="0" width="9" height="6" rx="1" fill="url(#tapeGrad)" stroke="#C8C8C8" strokeWidth="1"/>
          {/* テープの内側部分（粘着面） */}
          <rect x="1" y="1" width="7" height="4" rx="0.5" fill="url(#tapeAdhesive)"/>
          {/* 粘着テープの模様（横線で粘着面を表現） */}
          <line x1="2" y1="2" x2="7" y2="2" stroke="#D0D0D0" strokeWidth="0.3"/>
          <line x1="2" y1="3.5" x2="7" y2="3.5" stroke="#D0D0D0" strokeWidth="0.3"/>
          <line x1="2" y1="5" x2="7" y2="5" stroke="#D0D0D0" strokeWidth="0.3"/>
          {/* テープの角の丸み（ハイライト） */}
          <circle cx="1" cy="1" r="0.5" fill="#E8E8E8" opacity="0.6"/>
          <circle cx="8" cy="1" r="0.5" fill="#E8E8E8" opacity="0.6"/>
          {/* テープの影 */}
          <rect x="0.5" y="6" width="8" height="0.5" fill="#D0D0D0" opacity="0.3"/>
        </g>
        {/* おむつのテープ（右側） */}
        <g transform="translate(89, 10)">
          <rect x="0" y="0" width="9" height="6" rx="1" fill="url(#tapeGrad)" stroke="#C8C8C8" strokeWidth="1"/>
          <rect x="1" y="1" width="7" height="4" rx="0.5" fill="url(#tapeAdhesive)"/>
          <line x1="2" y1="2" x2="7" y2="2" stroke="#D0D0D0" strokeWidth="0.3"/>
          <line x1="2" y1="3.5" x2="7" y2="3.5" stroke="#D0D0D0" strokeWidth="0.3"/>
          <line x1="2" y1="5" x2="7" y2="5" stroke="#D0D0D0" strokeWidth="0.3"/>
          <circle cx="1" cy="1" r="0.5" fill="#E8E8E8" opacity="0.6"/>
          <circle cx="8" cy="1" r="0.5" fill="#E8E8E8" opacity="0.6"/>
          <rect x="0.5" y="6" width="8" height="0.5" fill="#D0D0D0" opacity="0.3"/>
        </g>
        {/* おむつの中央の模様（ハート - より詳細に） */}
        <g opacity="0.5">
          <ellipse cx="50" cy="38" rx="12" ry="8" fill="#FFB6C1" opacity="0.3"/>
          <path 
            d="M 50 35 Q 50 32 47 32 Q 44 32 44 35 Q 44 38 50 48 Q 56 38 56 35 Q 56 32 53 32 Q 50 32 50 35" 
            fill="#FFB6C1" 
            stroke="#FF91A4" 
            strokeWidth="0.5"
          />
          {/* ハートのハイライト */}
          <ellipse cx="48" cy="34" rx="2" ry="1.5" fill="#FFFFFF" opacity="0.6"/>
        </g>
        {/* おむつの下部のライン（太もも部分 - レッグホール） */}
        <path 
          d="M 13 68 Q 50 70 87 68" 
          stroke="#C8C8C8" 
          strokeWidth="1.2" 
          fill="none"
          opacity="0.5"
        />
        <path 
          d="M 13 71 Q 50 73 87 71" 
          stroke="#C8C8C8" 
          strokeWidth="0.8" 
          fill="none"
          opacity="0.3"
        />
        {/* おむつの側面の縫い目（左右） */}
        <line x1="15" y1="10" x2="15" y2="70" stroke="#D8D8D8" strokeWidth="0.6" opacity="0.3" strokeDasharray="1.5,1.5"/>
        <line x1="85" y1="10" x2="85" y2="70" stroke="#D8D8D8" strokeWidth="0.6" opacity="0.3" strokeDasharray="1.5,1.5"/>
        {/* おむつのテクスチャ（細かい点で柔らかさを表現） */}
        <g opacity="0.1">
          {Array.from({ length: 20 }).map((_, i) => (
            <circle 
              key={i} 
              cx={15 + (i % 5) * 15} 
              cy={15 + Math.floor(i / 5) * 12} 
              r="0.5" 
              fill="#000000"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

export function TrashSelector({ trashTypes, selectedTrash, onSelect, language }: Props) {
  const t = useTranslations(language);
  
  return (
    <div className="space-y-4 w-full">
      {/* セクションタイトル */}
      <div className="tv-panel-title">
        <span className="text-2xl">🗑️</span>
        <span>{t.selectGomi}</span>
        <span className="badge-circle !text-xs !py-1 !px-2">{t.allTypes.replace('{count}', trashTypes.length.toString())}</span>
      </div>
      
      {/* ゴミグリッド */}
      <div className="grid grid-cols-2 gap-3 max-h-[280px] overflow-y-auto p-1 justify-items-center">
        {trashTypes.map((trash, index) => (
          <motion.button
            key={trash.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(trash)}
            className={`
              product-card text-center rarity-${trash.rarity}
              ${selectedTrash?.id === trash.id ? 'selected' : ''}
            `}
          >
            {/* レアリティラベル */}
            <div 
              className="absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded"
              style={{ 
                background: rarityColors[trash.rarity],
                color: trash.rarity === 'legendary' ? '#000' : '#fff',
              }}
            >
              {t.rarity[trash.rarity]}
            </div>

            {/* ゴミ絵文字 */}
            <div 
              className={`text-4xl mb-2 ${trash.id === 'golden_poop' ? 'golden-special' : ''}`}
            >
              {trash.emoji}
            </div>

            {/* ゴミ名 */}
            <p className="font-bold text-white text-sm truncate">
              {trash.name}
            </p>

            {/* 臭さゲージ */}
            <div className="stink-gauge mt-2 justify-center">
              {Array.from({ length: 5 }).map((_, i) => {
                const level = Math.ceil(trash.stinkLevel / 2);
                const isActive = i < level;
                const isDanger = trash.stinkLevel >= 8;
                const isWarning = trash.stinkLevel >= 5 && trash.stinkLevel < 8;
                return (
                  <div
                    key={i}
                    className={`stink-bar ${isActive ? 'active' : ''} ${
                      isActive && isDanger ? 'danger' : isActive && isWarning ? 'warning' : ''
                    }`}
                    style={{ width: 8, height: 14 }}
                  />
                );
              })}
            </div>
          </motion.button>
        ))}
      </div>

      {/* 選択したゴミの詳細 */}
      <AnimatePresence mode="wait">
        {selectedTrash && (
          <motion.div
            key={selectedTrash.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-black/50 rounded-xl p-4 border-2 border-yellow-500 w-full"
          >
            <div className="flex items-start gap-4">
              <div 
                className={`text-5xl ${selectedTrash.id === 'golden_poop' ? 'golden-special' : ''}`}
              >
                {selectedTrash.emoji}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span 
                    className="font-black text-lg"
                    style={{ color: rarityColors[selectedTrash.rarity] }}
                  >
                    {selectedTrash.name}
                  </span>
                </div>
                <p className="text-gray-300 text-sm mb-2">
                  {selectedTrash.description}
                </p>
                
                {/* 臭さレベル */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{t.stinkLevel}</span>
                  <div className="stink-gauge">
                    {Array.from({ length: 10 }).map((_, i) => {
                      const isActive = i < selectedTrash.stinkLevel;
                      const isDanger = selectedTrash.stinkLevel >= 8;
                      const isWarning = selectedTrash.stinkLevel >= 5 && selectedTrash.stinkLevel < 8;
                      return (
                        <div 
                          key={i} 
                          className={`stink-bar ${isActive ? 'active' : ''} ${
                            isActive && isDanger ? 'danger' : isActive && isWarning ? 'warning' : ''
                          }`}
                          style={{ width: 8, height: 16 }}
                        />
                      );
                    })}
                  </div>
                  <span className="countdown !text-lg">{selectedTrash.stinkLevel}/10</span>
                </div>
              </div>
            </div>

            {/* 価格風表示 */}
            <div className="mt-3 flex justify-between items-center">
              <div>
                <span className="price-original">{t.originalPrice}</span>
                <div className="price-sale">
                  {t.salePrice.split('¥0')[0]}<span className="text-3xl">¥0</span>
                  <span className="text-sm">{t.gasOnly}</span>
                </div>
              </div>
              <div 
                className="badge-circle"
                style={{ 
                  background: rarityColors[selectedTrash.rarity],
                  color: selectedTrash.rarity === 'legendary' ? '#000' : '#fff',
                }}
              >
                {t.rarity[selectedTrash.rarity]}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
