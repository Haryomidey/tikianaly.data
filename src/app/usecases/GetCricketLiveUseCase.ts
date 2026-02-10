import { LiveMatchDto, LiveQuery } from '../dto/cricket.js';
import { CricketReadRepository } from '../../domain/repositories/CricketReadRepository.js';

export interface GetCricketLiveUseCase {
  execute(query: LiveQuery): Promise<LiveMatchDto[]>;
}

export class GetCricketLive implements GetCricketLiveUseCase {
  constructor(private readonly repo: CricketReadRepository) {}

  async execute(query: LiveQuery): Promise<LiveMatchDto[]> {
    return this.repo.getLive(query);
  }
}
