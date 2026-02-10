import { Request, Response } from 'express';
import { GetCricketMatchCenterUseCase } from '../../../app/usecases/GetCricketMatchCenterUseCase.js';
import { NotFoundError } from '../../../shared/errors.js';
import { parseBoolean, requireParam } from '../../http/validation.js';

export class CricketMatchCenterController {
  constructor(private readonly useCase: GetCricketMatchCenterUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    const id = requireParam(req.params.matchId, 'matchId');
    const query = {
      includeCommentary: parseBoolean(req.query.includeCommentary as string | undefined) ?? false,
    };

    const data = await this.useCase.execute(id, query);
    if (!data) throw new NotFoundError('Match center not found');
    res.status(200).json(data);
  }
}
