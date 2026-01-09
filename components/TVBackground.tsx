'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type Star = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
};

export function TVBackground() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // 星を生成（パフォーマンス向上のため数を減らす）
    const newStars: Star[] = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 3,
      duration: 2 + Math.random() * 2,
      delay: Math.random() * 1,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* グラデーション背景 */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, #2a1a5a 0%, #0a0a2a 50%, #000 100%)',
        }}
      />

      {/* スポットライト */}
      <motion.div
        className="spotlight spotlight-1"
        animate={{
          x: [0, 50, 0],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="spotlight spotlight-2"
        animate={{
          x: [0, -50, 0],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />

      {/* キラキラ星 */}
      <div className="star-effect">
        {stars.map(star => (
          <motion.div
            key={star.id}
            className="star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* 放射状のライン */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: `
            repeating-conic-gradient(
              from 0deg at 50% 50%,
              transparent 0deg,
              rgba(255, 215, 0, 0.1) 1deg,
              transparent 2deg
            )
          `,
        }}
      />

      {/* 浮遊するゴミ */}
      {['🗑️', '💰', '⭐', '🎁'].map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-3xl opacity-20"
          style={{
            left: `${15 + i * 25}%`,
            bottom: '10%',
          }}
          animate={{
            y: [0, -40, 0],
            rotate: [-10, 10, -10],
          }}
          transition={{
            duration: 4 + i,
            delay: i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {emoji}
        </motion.div>
      ))}

      {/* コーナー装飾 */}
      <div className="absolute top-16 left-4 text-2xl opacity-50">✨</div>
      <div className="absolute top-16 right-4 text-2xl opacity-50">✨</div>
      <div className="absolute bottom-4 left-4 text-2xl opacity-50">⭐</div>
      <div className="absolute bottom-4 right-4 text-2xl opacity-50">⭐</div>
    </div>
  );
}


