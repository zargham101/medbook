export default async function handler(req: any, res: any) {
  try {
    const mod = await import('../server/src/index');
    res.json({ hasApp: !!mod.app, hasDefault: !!mod.default });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || String(e), stack: e?.stack });
  }
}
