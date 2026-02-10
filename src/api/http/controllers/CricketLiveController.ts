import { Request, Response } from 'express';
import { GetCricketLiveUseCase } from '../../../app/usecases/GetCricketLiveUseCase.js';
import { parseLimit } from '../../http/validation.js';

export class CricketLiveController {
  constructor(private readonly useCase: GetCricketLiveUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    const query = {
      seriesId: req.query.seriesId as string | undefined,
      limit: parseLimit(req.query.limit as string | undefined, 50),
    };

    const data = await this.useCase.execute(query);
    res.status(200).json(data);
  }
}
