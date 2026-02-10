import { FixturesQuery, MatchSummaryDto } from '../dto/cricket.js';
import { CricketReadRepository } from '../../domain/repositories/CricketReadRepository.js';

export interface GetCricketSeriesFixturesUseCase {
  execute(id: string, query: FixturesQuery): Promise<MatchSummaryDto[]>;
}

export class GetCricketSeriesFixtures implements GetCricketSeriesFixturesUseCase {
  constructor(private readonly repo: CricketReadRepository) {}

  async execute(id: string, query: FixturesQuery): Promise<MatchSummaryDto[]> {
    return this.repo.getSeriesFixtures(id, query);
  }
}
