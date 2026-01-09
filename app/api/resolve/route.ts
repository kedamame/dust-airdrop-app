import { NextRequest, NextResponse } from 'next/server';

// Farcasterユーザー名またはENSをウォレットアドレスに解決するAPI
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter required' }, { status: 400 });
  }

  try {
    // ウォレットアドレスの場合はそのまま返す
    if (query.startsWith('0x') && query.length === 42) {
      return NextResponse.json({
        address: query,
        type: 'address',
        displayName: `${query.slice(0, 6)}...${query.slice(-4)}`,
      });
    }

    // ENSドメインの場合
    if (query.endsWith('.eth')) {
      // 本来はENSリゾルバーを使用
      // ここではモック
      return NextResponse.json({
        address: null,
        type: 'ens',
        displayName: query,
        message: 'ENS resolution would happen here',
      });
    }

    // Farcasterユーザー名の場合
    const username = query.startsWith('@') ? query.slice(1) : query;
    
    // Neynar APIまたはFarcaster Hubを使用してユーザー情報を取得
    // ここではモック
    const mockUsers: Record<string, { fid: number; address: string }> = {
      'vitalik': { fid: 5650, address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' },
      'dwr': { fid: 3, address: '0x6b0bda3f2ffed5efc83fa8c024acff1dd45793f1' },
    };

    const user = mockUsers[username.toLowerCase()];
    
    if (user) {
      return NextResponse.json({
        address: user.address,
        fid: user.fid,
        type: 'farcaster',
        displayName: `@${username}`,
      });
    }

    return NextResponse.json({
      address: null,
      type: 'unknown',
      displayName: query,
      message: 'User not found (this is a demo)',
    });

  } catch (error) {
    console.error('Resolve error:', error);
    return NextResponse.json({ error: 'Resolution failed' }, { status: 500 });
  }
}







