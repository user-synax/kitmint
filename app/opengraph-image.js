import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const contentType = 'image/png';
export const size = { width: 1200, height: 630 };

export default async function Image() {
  // Load font
  const dmSansData = await fetch(
    new URL('https://fonts.gstatic.com/s/dmsans/v14/D7Aa9MmS-jtN505-S1mQfx0.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0A0A0A',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          fontFamily: 'DM Sans',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <span style={{ fontSize: '100px', fontWeight: 800, color: '#F9FAFB' }}>Kit</span>
            <span style={{ fontSize: '100px', fontWeight: 800, color: '#4ADE80' }}>Mint</span>
          </div>
          <p style={{ fontSize: '36px', color: '#9CA3AF', maxWidth: '800px' }}>
            Turn an idea into a brand in 60 seconds.
          </p>
        </div>
        
        <div style={{ position: 'absolute', bottom: '0', left: 0, right: 0, height: '12px', background: '#16A34A' }} />
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'DM Sans',
          data: dmSansData,
          style: 'normal',
          weight: 800,
        },
      ],
    }
  );
}
