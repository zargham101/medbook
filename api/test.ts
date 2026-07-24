export default function handler(req: any, res: any) {
  res.json({ status: 'ok', from: 'test-function', method: req.method });
}
