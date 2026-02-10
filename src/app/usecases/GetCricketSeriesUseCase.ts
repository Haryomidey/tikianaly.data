import { SeriesQuery, SeriesSummaryDto } from '../dto/cricket.js';
import { CricketReadRepository } from '../../domain/repositories/CricketReadRepository.js';

export interface GetCricketSeriesUseCase {
  execute(query: SeriesQuery): Promise<SeriesSummaryDto[]>;
}

export class GetCricketSeries implements GetCricketSeriesUseCase {
  constructor(private readonly repo: CricketReadRepository) {}

  async execute(query: SeriesQuery): Promise<SeriesSummaryDto[]> {
    return this.repo.getSeries(query);
  }
}
