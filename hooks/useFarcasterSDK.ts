'use client';

import { useEffect, useState, useCallback } from 'react';
import sdk from '@farcaster/frame-sdk';

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

  useEffect(() => {
    const initSDK = async () => {
      try {
        // Farcaster SDKの初期化
        const ctx = await sdk.context;
        
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
        await sdk.actions.ready();
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
    try {
      await sdk.actions.openUrl(url);
    } catch (err) {
      // フォールバック: 新しいタブで開く
      window.open(url, '_blank');
    }
  }, []);

  const close = useCallback(async () => {
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







