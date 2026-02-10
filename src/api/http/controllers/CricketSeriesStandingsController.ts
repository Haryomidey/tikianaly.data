import { Request, Response } from 'express';
import { GetCricketSeriesStandingsUseCase } from '../../../app/usecases/GetCricketSeriesStandingsUseCase.js';
import { requireParam } from '../../http/validation.js';

export class CricketSeriesStandingsController {
  constructor(private readonly useCase: GetCricketSeriesStandingsUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    const id = requireParam(req.params.id, 'seriesId');
    const query = {
      group: req.query.group as string | undefined,
    };

    const data = await this.useCase.execute(id, query);
    res.status(200).json(data);
  }
}
