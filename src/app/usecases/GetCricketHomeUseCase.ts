import { HomeFeedDto, HomeQuery } from '../dto/cricket.js';
import { CricketReadRepository } from '../../domain/repositories/CricketReadRepository.js';

export interface GetCricketHomeUseCase {
  execute(query: HomeQuery): Promise<HomeFeedDto>;
}

export class GetCricketHome implements GetCricketHomeUseCase {
  constructor(private readonly repo: CricketReadRepository) {}

  async execute(query: HomeQuery): Promise<HomeFeedDto> {
    return this.repo.getHome(query);
  }
}
