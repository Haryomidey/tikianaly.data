export type PageQuery = {
  limit?: number;
  cursor?: string;
};

export type HomeQuery = {
  locale?: string;
  tz?: string;
  liveOnly?: boolean;
  limit?: number;
};

export type LiveQuery = {
  seriesId?: string;
  limit?: number;
};

export type SeriesQuery = {
  status?: 'current' | 'upcoming' | 'completed';
  limit?: number;
};

export type FixturesQuery = {
  from?: string;
  to?: string;
  limit?: number;
};

export type StandingsQuery = {
  group?: string;
};

export type MatchCenterQuery = {
  includeCommentary?: boolean;
};

export type HomeFeedDto = {
  featuredSeries: SeriesSummaryDto[];
  liveMatches: LiveMatchDto[];
  upcomingMatches: MatchSummaryDto[];
};

export type LiveMatchDto = {
  id: string;
  seriesId: string;
  status: 'live' | 'stumps' | 'rain' | 'break';
  teams: TeamScoreDto[];
  startTime: string;
  venue?: string;
};

export type MatchSummaryDto = {
  id: string;
  seriesId: string;
  status: string;
  teams: TeamScoreDto[];
  startTime: string;
};

export type SeriesSummaryDto = {
  id: string;
  name: string;
  season: string;
  status: 'current' | 'upcoming' | 'completed';
};

export type SeriesDetailsDto = SeriesSummaryDto & {
  host?: string;
  matchesCount?: number;
};

export type StandingRowDto = {
  teamId: string;
  teamName: string;
  played: number;
  won: number;
  lost: number;
  points: number;
  nrr?: number;
};

export type PlayerProfileDto = {
  id: string;
  name: string;
  role: string;
  country: string;
  battingStyle?: string;
  bowlingStyle?: string;
};

export type TeamScoreDto = {
  teamId: string;
  name: string;
  score?: string;
  overs?: string;
};

export type MatchCenterDto = {
  match: MatchSummaryDto;
  scoreboard: TeamScoreDto[];
  lastWicket?: string;
  commentary?: Array<{ over: string; text: string }>;
};
