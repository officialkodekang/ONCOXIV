// app/api/proxy/route.ts

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Read the request body as an ArrayBuffer
    const requestBodyBuffer = Buffer.from(await request.arrayBuffer());

    // Forward the request body directly to the external API
    const externalResponse = await fetch('http://134.209.79.41:8000/predict', {
      method: 'POST',
      headers: {
        // Forward the Content-Type header
        'Content-Type': request.headers.get('Content-Type') || '',
      },
      body: requestBodyBuffer,
    });

    // Check if the external response is okay
    if (!externalResponse.ok) {
      const errorText = await externalResponse.text();
      console.error(`External API Error: ${externalResponse.status} - ${errorText}`);
      return NextResponse.json({ error: errorText }, { status: externalResponse.status });
    }

    // Get the response body as text
    const responseBody = await externalResponse.text();

    // Return the response to the client
    return new NextResponse(responseBody, {
      status: externalResponse.status,
      headers: {
        'Content-Type': externalResponse.headers.get('Content-Type') || '',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
