import { app } from '../server/src/index';

export default function handler(req: any, res: any) {
  const originalPath = req.query.path as string | undefined;
  if (originalPath) {
    req.url = '/api/' + originalPath;
  }
  return app(req, res);
}
