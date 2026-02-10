import { Request, Response } from 'express';
import { GetCricketSeriesFixturesUseCase } from '../../../app/usecases/GetCricketSeriesFixturesUseCase.js';
import { ValidationError } from '../../../shared/errors.js';
import { parseDate, parseLimit, requireParam } from '../../http/validation.js';

export class CricketSeriesFixturesController {
  constructor(private readonly useCase: GetCricketSeriesFixturesUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    const id = requireParam(req.params.id, 'seriesId');
    const query = {
      from: parseDate(req.query.from as string | undefined, 'from'),
      to: parseDate(req.query.to as string | undefined, 'to'),
      limit: parseLimit(req.query.limit as string | undefined, 100),
    };

    if (query.from && query.to && query.from > query.to) {
      throw new ValidationError('from must be before to');
    }

    const data = await this.useCase.execute(id, query);
    res.status(200).json(data);
  }
}
