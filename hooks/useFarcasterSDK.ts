'use client';

import { useEffect, useState, useCallback } from 'react';

// @farcaster/frame-sdkの型定義（オプショナル）
type FarcasterSDK = {
  context: Promise<{
    user?: {
      fid: number;
      username?: string;
      displayName?: string;
      pfpUrl?: string;
      custody?: string;
    };
    client?: {
      clientFid: number;
      added: boolean;
    };
  }>;
  actions: {
    ready: () => Promise<void>;
    openUrl: (url: string) => Promise<void>;
    close: () => Promise<void>;
  };
};

// SDKを動的にインポートする関数（ビルド時には実行されない）
async function loadSDK(): Promise<FarcasterSDK | null> {
  // クライアントサイドでのみ実行
  if (typeof window === 'undefined') {
    return null;
  }

  // 動的インポートを文字列として使用（ビルド時に解決されないようにする）
  try {
    // 文字列を変数に格納してから動的インポート（ビルド時に解決されないようにする）
    const sdkPath = '@farcaster/frame-sdk';
    // @ts-ignore - パッケージが存在しない可能性があるため
    const sdkModule = await import(/* webpackIgnore: true */ sdkPath);
    return sdkModule.default || sdkModule;
  } catch {
    // パッケージがインストールされていない場合はnullを返す
    return null;
  }
}

type FarcasterContext = {
  user?: {
    fid: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
    custody?: string;
  };
  client?: {
    clientFid: number;
    added: boolean;
  };
};

export function useFarcasterSDK() {
  const [isReady, setIsReady] = useState(false);
  const [context, setContext] = useState<FarcasterContext | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sdk, setSdk] = useState<FarcasterSDK | null>(null);

  useEffect(() => {
    const initSDK = async () => {
      // SDKを動的に読み込む
      const loadedSDK = await loadSDK();
      
      // SDKが利用できない場合はスキップ
      if (!loadedSDK) {
        setIsReady(true);
        return;
      }

      setSdk(loadedSDK);

      try {
        // Farcaster SDKの初期化
        const ctx = await loadedSDK.context;
        
        if (ctx) {
          setContext({
            user: ctx.user ? {
              fid: ctx.user.fid,
              username: ctx.user.username,
              displayName: ctx.user.displayName,
              pfpUrl: ctx.user.pfpUrl,
            } : undefined,
            client: ctx.client ? {
              clientFid: ctx.client.clientFid,
              added: ctx.client.added,
            } : undefined,
          });
        }

        // SDKの準備完了を通知
        await loadedSDK.actions.ready();
        setIsReady(true);
      } catch (err) {
        console.error('Failed to initialize Farcaster SDK:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize SDK');
        // フォールバック: SDKなしでも動作可能に
        setIsReady(true);
      }
    };

    initSDK();
  }, []);

  const openUrl = useCallback(async (url: string) => {
    if (!sdk) {
      // SDKが利用できない場合は新しいタブで開く
      window.open(url, '_blank');
      return;
    }

    try {
      await sdk.actions.openUrl(url);
    } catch (err) {
      // フォールバック: 新しいタブで開く
      window.open(url, '_blank');
    }
  }, []);

  const close = useCallback(async () => {
    if (!sdk) {
      return;
    }

    try {
      await sdk.actions.close();
    } catch (err) {
      console.error('Failed to close:', err);
    }
  }, []);

  return {
    isReady,
    context,
    error,
    openUrl,
    close,
    sdk,
  };
}







