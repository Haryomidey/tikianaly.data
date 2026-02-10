import { PlayerProfileDto } from '../dto/cricket.js';
import { CricketReadRepository } from '../../domain/repositories/CricketReadRepository.js';

export interface GetCricketPlayerByIdUseCase {
  execute(id: string): Promise<PlayerProfileDto | null>;
}

export class GetCricketPlayerById implements GetCricketPlayerByIdUseCase {
  constructor(private readonly repo: CricketReadRepository) {}

  async execute(id: string): Promise<PlayerProfileDto | null> {
    return this.repo.getPlayerById(id);
  }
}
