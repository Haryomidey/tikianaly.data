import { Request, Response } from 'express';
import { GetCricketSeriesByIdUseCase } from '../../../app/usecases/GetCricketSeriesByIdUseCase.js';
import { NotFoundError } from '../../../shared/errors.js';
import { requireParam } from '../../http/validation.js';

export class CricketSeriesByIdController {
  constructor(private readonly useCase: GetCricketSeriesByIdUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    const id = requireParam(req.params.id, 'seriesId');
    const data = await this.useCase.execute(id);
    if (!data) throw new NotFoundError('Series not found');
    res.status(200).json(data);
  }
}
