import { MatchSummaryDto } from '../dto/cricket.js';
import { CricketReadRepository } from '../../domain/repositories/CricketReadRepository.js';

export interface GetCricketMatchByIdUseCase {
  execute(id: string): Promise<MatchSummaryDto | null>;
}

export class GetCricketMatchById implements GetCricketMatchByIdUseCase {
  constructor(private readonly repo: CricketReadRepository) {}

  async execute(id: string): Promise<MatchSummaryDto | null> {
    return this.repo.getMatchById(id);
  }
}
