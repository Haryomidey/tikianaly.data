import { StandingsQuery, StandingRowDto } from '../dto/cricket.js';
import { CricketReadRepository } from '../../domain/repositories/CricketReadRepository.js';

export interface GetCricketSeriesStandingsUseCase {
  execute(id: string, query: StandingsQuery): Promise<StandingRowDto[]>;
}

export class GetCricketSeriesStandings implements GetCricketSeriesStandingsUseCase {
  constructor(private readonly repo: CricketReadRepository) {}

  async execute(id: string, query: StandingsQuery): Promise<StandingRowDto[]> {
    return this.repo.getSeriesStandings(id, query);
  }
}
