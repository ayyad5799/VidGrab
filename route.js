export const runtime = 'edge';

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return Response.json({ status: 'error', message: 'URL is required' }, { status: 400 });
    }

    const cobaltRes = await fetch('https://api.cobalt.tools/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    const data = await cobaltRes.json();

    if (!cobaltRes.ok) {
      return Response.json(
        { status: 'error', message: data?.error?.code || 'Failed to process URL' },
        { status: cobaltRes.status }
      );
    }

    return Response.json(data);
  } catch (err) {
    return Response.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
