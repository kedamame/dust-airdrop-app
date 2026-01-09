// 送信履歴の型定義
export interface ThrowHistory {
  id: string; // 一意のID
  timestamp: number; // 送信日時（Unix timestamp）
  recipient: string; // 送信先（入力値、解決前の値も保存）
  recipientAddress: string; // 解決後のアドレス
  trashId: string; // ゴミのID
  trashName: string; // ゴミの名前
  trashEmoji: string; // ゴミの絵文字
  transactionHash: string; // トランザクションハッシュ
  tokenId?: number; // NFTのトークンID（取得できた場合）
  chainId?: number; // チェーンID
  isTestnet?: boolean; // テストネットかどうか
}

const HISTORY_STORAGE_KEY_TESTNET = 'trashNFT_history_testnet';
const HISTORY_STORAGE_KEY_MAINNET = 'trashNFT_history_mainnet';
const MAX_HISTORY_ITEMS = 100; // 最大保存件数

// 現在のネットワークモードを取得
function getNetworkMode(): 'testnet' | 'mainnet' {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_USE_TESTNET === 'true' ? 'testnet' : 'mainnet';
  }
  
  const saved = localStorage.getItem('gomi-nft-network-mode');
  if (saved === 'testnet') return 'testnet';
  if (saved === 'mainnet') return 'mainnet';
  
  return process.env.NEXT_PUBLIC_USE_TESTNET === 'true' ? 'testnet' : 'mainnet';
}

// ストレージキーを取得
function getStorageKey(isTestnet: boolean): string {
  return isTestnet ? HISTORY_STORAGE_KEY_TESTNET : HISTORY_STORAGE_KEY_MAINNET;
}

// 履歴をローカルストレージから読み込む
export function loadHistory(isTestnet?: boolean): ThrowHistory[] {
  if (typeof window === 'undefined') return [];
  
  const networkMode = isTestnet !== undefined 
    ? (isTestnet ? 'testnet' : 'mainnet')
    : getNetworkMode();
  const storageKey = getStorageKey(networkMode === 'testnet');
  
  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return [];
    
    const history = JSON.parse(stored) as ThrowHistory[];
    // 日付順（新しい順）にソート
    return history.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
}

// 履歴をローカルストレージに保存
export function saveHistory(history: ThrowHistory[], isTestnet?: boolean): void {
  if (typeof window === 'undefined') return;
  
  const networkMode = isTestnet !== undefined 
    ? (isTestnet ? 'testnet' : 'mainnet')
    : getNetworkMode();
  const storageKey = getStorageKey(networkMode === 'testnet');
  
  try {
    // 最大件数を超える場合は古いものを削除
    const trimmed = history.slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(storageKey, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Failed to save history:', error);
  }
}

// 新しい履歴を追加
export function addHistoryItem(item: Omit<ThrowHistory, 'id' | 'timestamp'>, isTestnet?: boolean): void {
  const networkMode = isTestnet !== undefined 
    ? (isTestnet ? 'testnet' : 'mainnet')
    : getNetworkMode();
  const history = loadHistory(networkMode === 'testnet');
  const newItem: ThrowHistory = {
    ...item,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    isTestnet: networkMode === 'testnet',
  };
  
  history.unshift(newItem); // 先頭に追加
  saveHistory(history, networkMode === 'testnet');
}

// 履歴をクリア
export function clearHistory(isTestnet?: boolean): void {
  if (typeof window === 'undefined') return;
  
  if (isTestnet !== undefined) {
    const storageKey = getStorageKey(isTestnet);
    localStorage.removeItem(storageKey);
  } else {
    // 両方をクリア
    localStorage.removeItem(HISTORY_STORAGE_KEY_TESTNET);
    localStorage.removeItem(HISTORY_STORAGE_KEY_MAINNET);
  }
}

