import { ImageResponse } from 'next/og';
import connectDB from '@/lib/db';
import Kit from '@/models/Kit';

export const runtime = 'nodejs';
export const contentType = 'image/png';
export const size = { width: 1200, height: 630 };

export default async function Image({ params }) {
  const { slug } = await params;
  await connectDB();
  const kit = await Kit.findOne({ slug }).lean();

  if (!kit) return new Response('Not Found', { status: 404 });

  const brandName = kit.brandNames?.[0]?.name || 'Brand Kit';
  const colors = kit.colors || [];

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
        {/* Color Bar at Top */}
        <div style={{ display: 'flex', position: 'absolute', top: 0, left: 0, right: 0, height: '20px' }}>
          {colors.map((c, i) => (
            <div key={i} style={{ flex: 1, height: '100%', background: c.hex }} />
          ))}
        </div>

        {/* Brand Content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 80px' }}>
          <h1 style={{ fontSize: '84px', fontWeight: 800, color: '#F9FAFB', marginBottom: '16px', letterSpacing: '-0.02em' }}>
            {brandName}
          </h1>
          <p style={{ fontSize: '32px', color: '#9CA3AF', maxWidth: '850px', lineHeight: 1.4 }}>
            {kit.tagline}
          </p>
        </div>

        {/* Watermark */}
        <div style={{ position: 'absolute', bottom: '40px', right: '40px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '24px', fontWeight: 700, color: '#F9FAFB' }}>Kit</span>
          <span style={{ fontSize: '24px', fontWeight: 700, color: '#4ADE80' }}>Mint</span>
        </div>
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
