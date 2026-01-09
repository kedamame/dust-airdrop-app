// 多言語対応

export type Language = 'ja' | 'en';

export const translations = {
  ja: {
    // タイトル
    title: '🗑️ ゴミNFT 🗑️',
    subtitle: '投げつけマシーン',
    catchphrase: '✨ 大切な(?)ゴミを誰かにプレゼント！ ✨',
    
    // バッジ
    webLimited: '🎉 WEB限定 🎉',
    danger: '⚠ DANGER',
    biohazard: '☠ BIOHAZARD',
    
    // ステータス
    guest: 'ゲスト',
    thrown: '投げた数',
    
    // セクション
    selectGomi: 'ゴミを選択',
    selectTarget: '犠牲者を入力',
    allTypes: '全{count}種',
    
    // ボタン
    throwGomi: 'ゴミを投げる！',
    throwing: '送信中...',
    pressToAttack: '▶ PRESS TO ATTACK ◀',
    selectGomiFirst: '▲ SELECT GOMI FIRST ▲',
    enterTarget: '▲ ENTER TARGET ▲',
    continue: 'CONTINUE ▶',
    throwMore: 'もっと投げる！',
    
    // ゴミの種類
    trash: {
      banana: '腐ったバナナ',
      diaper: '最終兵器',
      mystery: '謎の塊',
      egg: '腐った卵',
      poop: 'うんち',
      golden_poop: '輝くうんち',
    },
    
    // ゴミの説明
    descriptions: {
      banana: '3週間熟成！芳醇な香り',
      diaper: '微笑みながらこちらを見ている...',
      mystery: '正体不明...触るな危険',
      egg: '硫黄爆弾！一撃必殺',
      poop: 'ゴミの王様！不朽の名作',
      golden_poop: '伝説級！金運UP？',
    },
    
    // レアリティ
    rarity: {
      common: 'コモン',
      rare: 'レア',
      legendary: 'レジェンド',
      mythical: '神話級',
    },
    
    // メーター
    stinkLevel: '臭さLv.',
    stinkLevelFull: '臭さレベル',
    
    // 入力
    placeholder: '@ユーザー名 / ENS / ウォレットアドレス',
    targetLocked: 'TARGET LOCKED',
    waitingForInput: 'WAITING FOR INPUT...',
    inputHelp: '💡 入力できる形式:',
    inputExamples: {
      farcaster: '• Farcaster:',
      ens: '• ENS:',
      wallet: '• ウォレット:',
    },
    recentVictims: '最近の犠牲者:',
    
    // 価格表示
    originalPrice: '通常価格: ¥999,999',
    salePrice: '今だけ ¥0',
    gasOnly: '（ガス代のみ）',
    
    // 成功モーダル
    success: '🎉 送信完了！ 🎉',
    successMessage: 'ゴミが無事に届きました！',
    item: 'アイテム:',
    target: '犠牲者:',
    status: '状態:',
    onChainSaved: '✓ オンチェーン保存済み',
    goldenMessage: '✨ 黄金のうんちを受け取った人に幸運が訪れるかも!? ✨',
    diaperMessage: '何か臭いものを投げつけたようです...',
    defaultMessage: '受け取った人は永遠にこのゴミと付き合うことになります...',
    viewOnExplorer: 'エクスプローラーで確認',
    viewNFT: 'NFTを確認',
    
    // 注意書き
    warning: '※このゴミNFTは完全に無価値ですが、ブロックチェーン上に永遠に残ります',
    noReturns: '※返品・交換は一切お受けできません',
    individualResults: '※効果には個人差があります',
    cannotCancel: '※一度投げたゴミは取り消せません',
    
    // ウォレット接続
    connectWallet: 'ウォレットを接続',
    walletConnected: 'ウォレット接続済み',
    connecting: '接続中...',
    disconnect: '切断',
    
    // エラー
    walletNotConnected: 'ウォレットが接続されていません',
    contractNotDeployed: 'コントラクトがデプロイされていません',
    resolveFailed: '犠牲者のアドレスを解決できませんでした',
    transactionFailed: 'NFTの送信に失敗しました',
    
    // テロップ
    ticker: {
      limited: '🔥 期間限定！ゴミNFT投げ放題！ 🔥',
      freeShipping: '⚡ 今だけ送料無料（ガス代はかかります） ⚡',
      legendary: '💎 レジェンダリー級のゴミをGET！ 💎',
      gift: '🎁 友達にゴミを贈ろう！ 🎁',
    },
  },
  
  en: {
    // タイトル
    title: '🗑️ GOMI NFT 🗑️',
    subtitle: 'Throw Machine',
    catchphrase: '✨ Send your precious(?) trash to someone! ✨',
    
    // バッジ
    webLimited: '🎉 WEB EXCLUSIVE 🎉',
    danger: '⚠ DANGER',
    biohazard: '☠ BIOHAZARD',
    
    // ステータス
    guest: 'Guest',
    thrown: 'Thrown',
    
    // セクション
    selectGomi: 'Select GOMI',
    selectTarget: 'Enter Victim',
    allTypes: 'All {count} types',
    
    // ボタン
    throwGomi: 'Throw GOMI!',
    throwing: 'Sending...',
    pressToAttack: '▶ PRESS TO ATTACK ◀',
    selectGomiFirst: '▲ SELECT GOMI FIRST ▲',
    enterTarget: '▲ ENTER VICTIM ▲',
    continue: 'CONTINUE ▶',
    throwMore: 'Throw More!',
    
    // ゴミの種類
    trash: {
      banana: 'Rotten Banana',
      diaper: 'Final Weapon',
      mystery: 'Mystery Lump',
      egg: 'Rotten Egg',
      poop: 'Poop',
      golden_poop: 'Shining Poop',
    },
    
    // ゴミの説明
    descriptions: {
      banana: '3 weeks aged! Rich aroma',
      diaper: 'Smiling while looking at you...',
      mystery: 'Unknown... Do not touch',
      egg: 'Sulfur bomb! One-hit kill',
      poop: 'King of trash! Immortal masterpiece',
      golden_poop: 'Legendary! Fortune UP?',
    },
    
    // レアリティ
    rarity: {
      common: 'COMMON',
      rare: 'RARE',
      legendary: 'LEGENDARY',
      mythical: 'MYTHICAL',
    },
    
    // メーター
    stinkLevel: 'STINK LV.',
    stinkLevelFull: 'Stink Level',
    
    // 入力
    placeholder: '@username / ENS / Wallet address',
    targetLocked: 'TARGET LOCKED',
    waitingForInput: 'WAITING FOR INPUT...',
    inputHelp: '💡 Available formats:',
    inputExamples: {
      farcaster: '• Farcaster:',
      ens: '• ENS:',
      wallet: '• Wallet:',
    },
    recentVictims: 'Recent victims:',
    
    // 価格表示
    originalPrice: 'Regular price: ¥999,999',
    salePrice: 'Now only ¥0',
    gasOnly: '(Gas fee only)',
    
    // 成功モーダル
    success: '🎉 Success! 🎉',
    successMessage: 'Trash has been delivered!',
    item: 'Item:',
    target: 'Victim:',
    status: 'Status:',
    onChainSaved: '✓ Saved on-chain',
    goldenMessage: '✨ Fortune may come to those who receive the golden poop!? ✨',
    diaperMessage: 'Something smelly seems to have been thrown...',
    defaultMessage: 'The recipient will have to live with this trash forever...',
    viewOnExplorer: 'View on Explorer',
    viewNFT: 'View NFT',
    
    // 注意書き
    warning: '※This GOMI NFT is completely worthless but will remain on-chain forever',
    noReturns: '※No returns or exchanges accepted',
    individualResults: '※Results may vary',
    cannotCancel: '※Once thrown, trash cannot be canceled',
    
    // ウォレット接続
    connectWallet: 'Connect Wallet',
    walletConnected: 'Wallet Connected',
    connecting: 'Connecting...',
    disconnect: 'Disconnect',
    
    // エラー
    walletNotConnected: 'Wallet not connected',
    contractNotDeployed: 'Contract not deployed',
    resolveFailed: 'Failed to resolve victim address',
    transactionFailed: 'Failed to send NFT',
    
    // テロップ
    ticker: {
      limited: '🔥 Limited time! Unlimited GOMI NFT throwing! 🔥',
      freeShipping: '⚡ Free shipping now (gas fee applies) ⚡',
      legendary: '💎 Get legendary trash! 💎',
      gift: '🎁 Give trash to your friends! 🎁',
    },
  },
} as const;

export function useTranslations(lang: Language) {
  return translations[lang];
}

export function t(key: string, lang: Language, params?: Record<string, string | number>): string {
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  if (typeof value !== 'string') {
    return key;
  }
  
  // パラメータ置換
  if (params) {
    return value.replace(/\{(\w+)\}/g, (_, paramKey) => {
      return params[paramKey]?.toString() || '';
    });
  }
  
  return value;
}

