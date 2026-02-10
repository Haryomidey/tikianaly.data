import {
  FixturesQuery,
  HomeFeedDto,
  HomeQuery,
  LiveMatchDto,
  LiveQuery,
  MatchCenterDto,
  MatchCenterQuery,
  MatchSummaryDto,
  PlayerProfileDto,
  SeriesDetailsDto,
  SeriesQuery,
  SeriesSummaryDto,
  StandingsQuery,
  StandingRowDto,
} from '../dto/cricket.js';

export interface CricketReadRepository {
  getHome(query: HomeQuery): Promise<HomeFeedDto>;
  getLive(query: LiveQuery): Promise<LiveMatchDto[]>;
  getSeries(query: SeriesQuery): Promise<SeriesSummaryDto[]>;
  getSeriesById(id: string): Promise<SeriesDetailsDto | null>;
  getSeriesFixtures(id: string, query: FixturesQuery): Promise<MatchSummaryDto[]>;
  getSeriesStandings(id: string, query: StandingsQuery): Promise<StandingRowDto[]>;
  getMatchById(id: string): Promise<MatchSummaryDto | null>;
  getMatchCenter(id: string, query: MatchCenterQuery): Promise<MatchCenterDto | null>;
  getPlayerById(id: string): Promise<PlayerProfileDto | null>;
}
