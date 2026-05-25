import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();

  // Add CORS headers if needed (for potential public API access)
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Log generation requests for monitoring/debugging
  if (request.nextUrl.pathname === '/api/generate-kit') {
    console.log(`[GENERATE] Request from ${request.ip || 'unknown IP'}`);
  }

  return response;
}

export const config = {
  matcher: '/api/generate-kit',
};
