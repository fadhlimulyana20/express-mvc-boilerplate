import { Response } from 'express';

export function jsonResponse({
  res,
  status = 'success',
  message = '',
  data = {},
  meta,
  code = 200,
  startTime
}: {
  res: Response;
  status?: 'success' | 'fail' | 'error';
  message?: string;
  data?: any;
  meta?: any;
  code?: number;
  startTime: number;
}) {
  const response_time = Date.now() - startTime;
  return res.status(code).json({ status, message, data, meta, response_time });
}
