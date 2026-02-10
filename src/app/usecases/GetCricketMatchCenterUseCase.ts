import { MatchCenterDto, MatchCenterQuery } from '../dto/cricket.js';
import { CricketReadRepository } from '../../domain/repositories/CricketReadRepository.js';

export interface GetCricketMatchCenterUseCase {
  execute(id: string, query: MatchCenterQuery): Promise<MatchCenterDto | null>;
}

export class GetCricketMatchCenter implements GetCricketMatchCenterUseCase {
  constructor(private readonly repo: CricketReadRepository) {}

  async execute(id: string, query: MatchCenterQuery): Promise<MatchCenterDto | null> {
    return this.repo.getMatchCenter(id, query);
  }
}
