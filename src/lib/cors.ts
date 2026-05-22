const LOCALHOST_ORIGIN = 'http://localhost:3020';
const CHIP1_HOST_PATTERN = /^https:\/\/[a-z0-9-]+\.chip1\.info$/i;

export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (origin === LOCALHOST_ORIGIN) return true;
  return CHIP1_HOST_PATTERN.test(origin);
}

export function corsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    Vary: 'Origin',
  };
  if (isAllowedOrigin(origin) && origin) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type';
    headers['Access-Control-Max-Age'] = '86400';
  }
  return headers;
}

export function handleCorsPreflight(req: Request): Response {
  const origin = req.headers.get('origin');
  return new Response(null, {
    status: isAllowedOrigin(origin) ? 204 : 403,
    headers: corsHeaders(origin),
  });
}
