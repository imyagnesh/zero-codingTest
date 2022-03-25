import { Request, Response } from 'express';

const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404);
  return res.json({ success: false, data: { message: 'Invalid API call' } });
};

export default notFoundHandler;
