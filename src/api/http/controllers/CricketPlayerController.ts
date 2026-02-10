import { Request, Response } from 'express';
import { GetCricketPlayerByIdUseCase } from '../../../app/usecases/GetCricketPlayerByIdUseCase.js';
import { NotFoundError } from '../../../shared/errors.js';
import { requireParam } from '../../http/validation.js';

export class CricketPlayerController {
  constructor(private readonly useCase: GetCricketPlayerByIdUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    const id = requireParam(req.params.playerId, 'playerId');
    const data = await this.useCase.execute(id);
    if (!data) throw new NotFoundError('Player not found');
    res.status(200).json(data);
  }
}
