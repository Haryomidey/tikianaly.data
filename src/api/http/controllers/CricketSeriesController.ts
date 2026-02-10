import { Request, Response } from 'express';
import { GetCricketSeriesUseCase } from '../../../app/usecases/GetCricketSeriesUseCase.js';
import { parseLimit, parseSeriesStatus } from '../../http/validation.js';

export class CricketSeriesController {
  constructor(private readonly useCase: GetCricketSeriesUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    const query = {
      status: parseSeriesStatus(req.query.status as string | undefined),
      limit: parseLimit(req.query.limit as string | undefined, 50),
    };

    const data = await this.useCase.execute(query);
    res.status(200).json(data);
  }
}
