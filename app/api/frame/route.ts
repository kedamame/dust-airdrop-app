import { NextRequest, NextResponse } from 'next/server';

// Frame v2のAPIエンドポイント
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Farcasterからのフレームリクエストを処理
    const { untrustedData, trustedData } = body;

    // ユーザー情報を取得
    const fid = untrustedData?.fid;
    const buttonIndex = untrustedData?.buttonIndex;
    const inputText = untrustedData?.inputText;

    // レスポンスフレームを返す
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/frame/image?fid=${fid}" />
          <meta property="fc:frame:button:1" content="🗑️ ゴミを投げる" />
          <meta property="fc:frame:button:2" content="🎲 ランダムゴミ" />
          <meta property="fc:frame:input:text" content="@username または 0x..." />
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/frame" />
        </head>
      </html>
    `;

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Frame API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  // 初期フレームを返す
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>🗑️ ゴミNFT投げつけマシーン</title>
        <meta property="og:title" content="🗑️ ゴミNFT投げつけマシーン" />
        <meta property="og:description" content="あなたの大切な(?)ゴミを誰かに投げつけよう！" />
        <meta property="og:image" content="${baseUrl}/og-image.png" />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${baseUrl}/og-image.png" />
        <meta property="fc:frame:button:1" content="🗑️ アプリを開く" />
        <meta property="fc:frame:button:1:action" content="launch_frame" />
        <meta property="fc:frame:button:1:target" content="${baseUrl}" />
      </head>
      <body>
        <h1>🗑️ ゴミNFT投げつけマシーン</h1>
        <p>Farcasterでこのフレームを開いてください</p>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
    },
  });
}







