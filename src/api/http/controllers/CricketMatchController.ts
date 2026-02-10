import { Request, Response } from 'express';
import { GetCricketMatchByIdUseCase } from '../../../app/usecases/GetCricketMatchByIdUseCase.js';
import { NotFoundError } from '../../../shared/errors.js';
import { requireParam } from '../../http/validation.js';

export class CricketMatchController {
  constructor(private readonly useCase: GetCricketMatchByIdUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    const id = requireParam(req.params.matchId, 'matchId');
    const data = await this.useCase.execute(id);
    if (!data) throw new NotFoundError('Match not found');
    res.status(200).json(data);
  }
}
