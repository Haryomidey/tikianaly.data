import { CricketReadRepository } from '../../../domain/repositories/CricketReadRepository.js';
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
} from '../../../app/dto/cricket.js';
import { MatchModel } from '../mongoose/MatchModel.js';
import { SeriesModel } from '../mongoose/SeriesModel.js';
import { StandingsModel } from '../mongoose/StandingsModel.js';
import { PlayerModel } from '../mongoose/PlayerModel.js';

const dateToIso = {
  $dateToString: { format: '%Y-%m-%dT%H:%M:%S.%LZ', date: '$startTime' },
};

export class MongoCricketReadRepository implements CricketReadRepository {
  async getHome(query: HomeQuery): Promise<HomeFeedDto> {
    const limit = query.limit ?? 20;

    const [liveMatches, featuredSeries, upcomingMatches] = await Promise.all([
      this.getLive({ limit: Math.min(limit, 10) }),
      this.getSeries({ status: 'current', limit: 5 }),
      query.liveOnly ? Promise.resolve([]) : this.getUpcomingMatches(Math.min(limit, 10)),
    ]);

    return { featuredSeries, liveMatches, upcomingMatches };
  }

  async getLive(query: LiveQuery): Promise<LiveMatchDto[]> {
    const match: Record<string, unknown> = { isLive: true };
    if (query.seriesId) match.seriesId = query.seriesId;

    const pipeline = [
      { $match: match },
      { $sort: { startTime: -1 } },
      { $limit: query.limit ?? 20 },
      {
        $project: {
          _id: 0,
          id: '$_id',
          seriesId: 1,
          status: 1,
          teams: 1,
          startTime: dateToIso,
          venue: 1,
        },
      },
    ];

    const rows = await MatchModel.aggregate<LiveMatchDto>(pipeline).exec();
    return rows;
  }

  async getSeries(query: SeriesQuery): Promise<SeriesSummaryDto[]> {
    const match: Record<string, unknown> = {};
    if (query.status) match.status = query.status;

    const sort = query.status === 'upcoming' ? { startDate: 1 } : { startDate: -1 };

    const pipeline = [
      { $match: match },
      { $sort: sort },
      { $limit: query.limit ?? 20 },
      {
        $project: {
          _id: 0,
          id: '$_id',
          name: 1,
          season: 1,
          status: 1,
        },
      },
    ];

    return SeriesModel.aggregate<SeriesSummaryDto>(pipeline).exec();
  }

  async getSeriesById(id: string): Promise<SeriesDetailsDto | null> {
    const pipeline = [
      { $match: { _id: id } },
      {
        $project: {
          _id: 0,
          id: '$_id',
          name: 1,
          season: 1,
          status: 1,
          host: 1,
          matchesCount: 1,
        },
      },
    ];

    const rows = await SeriesModel.aggregate<SeriesDetailsDto>(pipeline).exec();
    return rows[0] ?? null;
  }

  async getSeriesFixtures(id: string, query: FixturesQuery): Promise<MatchSummaryDto[]> {
    const match: Record<string, unknown> = { seriesId: id };
    const startTime: Record<string, unknown> = {};

    if (query.from) startTime.$gte = new Date(query.from);
    if (query.to) startTime.$lte = new Date(query.to);
    if (Object.keys(startTime).length > 0) match.startTime = startTime;

    const pipeline = [
      { $match: match },
      { $sort: { startTime: 1 } },
      { $limit: query.limit ?? 50 },
      {
        $project: {
          _id: 0,
          id: '$_id',
          seriesId: 1,
          status: 1,
          teams: 1,
          startTime: dateToIso,
        },
      },
    ];

    return MatchModel.aggregate<MatchSummaryDto>(pipeline).exec();
  }

  async getSeriesStandings(id: string, query: StandingsQuery): Promise<StandingRowDto[]> {
    const match: Record<string, unknown> = { seriesId: id };
    if (query.group) match.group = query.group;

    const pipeline = [
      { $match: match },
      { $project: { rows: 1 } },
      { $unwind: '$rows' },
      { $replaceRoot: { newRoot: '$rows' } },
      {
        $project: {
          _id: 0,
          teamId: 1,
          teamName: 1,
          played: 1,
          won: 1,
          lost: 1,
          points: 1,
          nrr: 1,
        },
      },
    ];

    return StandingsModel.aggregate<StandingRowDto>(pipeline).exec();
  }

  async getMatchById(id: string): Promise<MatchSummaryDto | null> {
    const pipeline = [
      { $match: { _id: id } },
      {
        $project: {
          _id: 0,
          id: '$_id',
          seriesId: 1,
          status: 1,
          teams: 1,
          startTime: dateToIso,
        },
      },
    ];

    const rows = await MatchModel.aggregate<MatchSummaryDto>(pipeline).exec();
    return rows[0] ?? null;
  }

  async getMatchCenter(id: string, query: MatchCenterQuery): Promise<MatchCenterDto | null> {
    const pipeline: Record<string, unknown>[] = [{ $match: { _id: id } }];

    if (query.includeCommentary) {
      pipeline.push({
        $lookup: {
          from: 'commentary',
          let: { matchId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$matchId', '$$matchId'] } } },
            { $sort: { createdAt: -1 } },
            { $limit: 50 },
            { $project: { _id: 0, over: 1, text: 1 } },
          ],
          as: 'commentary',
        },
      });
    }

    pipeline.push({
      $project: {
        _id: 0,
        match: {
          id: '$_id',
          seriesId: '$seriesId',
          status: '$status',
          teams: '$teams',
          startTime: dateToIso,
        },
        scoreboard: '$teams',
        lastWicket: 1,
        ...(query.includeCommentary ? { commentary: 1 } : {}),
      },
    });

    const rows = await MatchModel.aggregate<MatchCenterDto>(pipeline).exec();
    return rows[0] ?? null;
  }

  async getPlayerById(id: string): Promise<PlayerProfileDto | null> {
    const pipeline = [
      { $match: { _id: id } },
      {
        $project: {
          _id: 0,
          id: '$_id',
          name: 1,
          role: 1,
          country: 1,
          battingStyle: 1,
          bowlingStyle: 1,
        },
      },
    ];

    const rows = await PlayerModel.aggregate<PlayerProfileDto>(pipeline).exec();
    return rows[0] ?? null;
  }

  private async getUpcomingMatches(limit: number): Promise<MatchSummaryDto[]> {
    const pipeline = [
      { $match: { status: 'scheduled' } },
      { $sort: { startTime: 1 } },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          id: '$_id',
          seriesId: 1,
          status: 1,
          teams: 1,
          startTime: dateToIso,
        },
      },
    ];

    return MatchModel.aggregate<MatchSummaryDto>(pipeline).exec();
  }
}
