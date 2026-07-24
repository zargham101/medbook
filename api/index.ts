import '../server/src/hello';

export default function handler(req: any, res: any) {
  res.json({ step: 'hello-imported' });
}
