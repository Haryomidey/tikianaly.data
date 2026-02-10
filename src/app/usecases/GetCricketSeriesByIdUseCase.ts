import { SeriesDetailsDto } from '../dto/cricket.js';
import { CricketReadRepository } from '../../domain/repositories/CricketReadRepository.js';

export interface GetCricketSeriesByIdUseCase {
  execute(id: string): Promise<SeriesDetailsDto | null>;
}

export class GetCricketSeriesById implements GetCricketSeriesByIdUseCase {
  constructor(private readonly repo: CricketReadRepository) {}

  async execute(id: string): Promise<SeriesDetailsDto | null> {
    return this.repo.getSeriesById(id);
  }
}
