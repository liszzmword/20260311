/**
 * Vercel Serverless API: Supabase 설정을 환경 변수에서 읽어 클라이언트에 전달합니다.
 * Vercel 대시보드에서 SUPABASE_URL, SUPABASE_ANON_KEY 환경 변수를 설정하세요.
 */
module.exports = function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const url = process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_ANON_KEY || '';

  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
  return res.status(200).json({
    SUPABASE_URL: url,
    SUPABASE_ANON_KEY: key
  });
};
