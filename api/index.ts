import '../server/src/db';

export default function handler(req: any, res: any) {
  res.json({ step: 'db-imported' });
}
