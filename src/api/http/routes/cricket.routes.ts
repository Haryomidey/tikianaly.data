import { Router } from 'express';
import { CricketHomeController } from '../controllers/CricketHomeController.js';
import { CricketLiveController } from '../controllers/CricketLiveController.js';
import { CricketMatchCenterController } from '../controllers/CricketMatchCenterController.js';
import { CricketMatchController } from '../controllers/CricketMatchController.js';
import { CricketPlayerController } from '../controllers/CricketPlayerController.js';
import { CricketSeriesByIdController } from '../controllers/CricketSeriesByIdController.js';
import { CricketSeriesController } from '../controllers/CricketSeriesController.js';
import { CricketSeriesFixturesController } from '../controllers/CricketSeriesFixturesController.js';
import { CricketSeriesStandingsController } from '../controllers/CricketSeriesStandingsController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export type CricketControllers = {
  home: CricketHomeController;
  live: CricketLiveController;
  series: CricketSeriesController;
  seriesById: CricketSeriesByIdController;
  seriesFixtures: CricketSeriesFixturesController;
  seriesStandings: CricketSeriesStandingsController;
  match: CricketMatchController;
  matchCenter: CricketMatchCenterController;
  player: CricketPlayerController;
};

export const cricketRouter = (controllers: CricketControllers): Router => {
  const router = Router();

  router.get('/cricket/home', asyncHandler((req, res, next) => controllers.home.handle(req, res)));
  router.get('/cricket/live', asyncHandler((req, res, next) => controllers.live.handle(req, res)));
  router.get('/cricket/series', asyncHandler((req, res, next) => controllers.series.handle(req, res)));
  router.get('/cricket/series/:id', asyncHandler((req, res, next) => controllers.seriesById.handle(req, res)));
  router.get(
    '/cricket/series/:id/fixtures',
    asyncHandler((req, res, next) => controllers.seriesFixtures.handle(req, res))
  );
  router.get(
    '/cricket/series/:id/standings',
    asyncHandler((req, res, next) => controllers.seriesStandings.handle(req, res))
  );
  router.get(
    '/cricket/matches/:matchId',
    asyncHandler((req, res, next) => controllers.match.handle(req, res))
  );
  router.get(
    '/cricket/matches/:matchId/center',
    asyncHandler((req, res, next) => controllers.matchCenter.handle(req, res))
  );
  router.get('/cricket/players/:playerId', asyncHandler((req, res, next) => controllers.player.handle(req, res)));

  return router;
};
