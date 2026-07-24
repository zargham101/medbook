import { y } from './bar.js';
export default function handler(req: any, res: any) {
  res.json({ status: 'bar-imported', y });
}
