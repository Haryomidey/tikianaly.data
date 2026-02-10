import { Request, Response } from 'express';
import { GetCricketHomeUseCase } from '../../../app/usecases/GetCricketHomeUseCase.js';
import { parseBoolean, parseLimit } from '../../http/validation.js';

export class CricketHomeController {
  constructor(private readonly useCase: GetCricketHomeUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    const query = {
      locale: req.query.locale as string | undefined,
      tz: req.query.tz as string | undefined,
      liveOnly: parseBoolean(req.query.liveOnly as string | undefined) ?? false,
      limit: parseLimit(req.query.limit as string | undefined, 50),
    };

    const data = await this.useCase.execute(query);
    res.status(200).json(data);
  }
}
