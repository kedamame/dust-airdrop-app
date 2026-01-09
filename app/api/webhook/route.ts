import { NextRequest, NextResponse } from 'next/server';

// Farcaster Mini Appのウェブフック
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Webhook received:', JSON.stringify(body, null, 2));

    // ウェブフックイベントの処理
    const { event, data } = body;

    switch (event) {
      case 'frame_added':
        console.log('User added the frame:', data);
        break;
      case 'frame_removed':
        console.log('User removed the frame:', data);
        break;
      case 'notifications_enabled':
        console.log('User enabled notifications:', data);
        break;
      case 'notifications_disabled':
        console.log('User disabled notifications:', data);
        break;
      default:
        console.log('Unknown event:', event);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}







