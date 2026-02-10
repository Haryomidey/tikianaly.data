import express, { Express } from 'express';
import { CricketReadRepository } from '../../domain/repositories/CricketReadRepository.js';
import { GetCricketHome } from '../../app/usecases/GetCricketHomeUseCase.js';
import { GetCricketLive } from '../../app/usecases/GetCricketLiveUseCase.js';
import { GetCricketMatchById } from '../../app/usecases/GetCricketMatchByIdUseCase.js';
import { GetCricketMatchCenter } from '../../app/usecases/GetCricketMatchCenterUseCase.js';
import { GetCricketPlayerById } from '../../app/usecases/GetCricketPlayerByIdUseCase.js';
import { GetCricketSeries } from '../../app/usecases/GetCricketSeriesUseCase.js';
import { GetCricketSeriesById } from '../../app/usecases/GetCricketSeriesByIdUseCase.js';
import { GetCricketSeriesFixtures } from '../../app/usecases/GetCricketSeriesFixturesUseCase.js';
import { GetCricketSeriesStandings } from '../../app/usecases/GetCricketSeriesStandingsUseCase.js';
import { CricketHomeController } from './controllers/CricketHomeController.js';
import { CricketLiveController } from './controllers/CricketLiveController.js';
import { CricketMatchCenterController } from './controllers/CricketMatchCenterController.js';
import { CricketMatchController } from './controllers/CricketMatchController.js';
import { CricketPlayerController } from './controllers/CricketPlayerController.js';
import { CricketSeriesByIdController } from './controllers/CricketSeriesByIdController.js';
import { CricketSeriesController } from './controllers/CricketSeriesController.js';
import { CricketSeriesFixturesController } from './controllers/CricketSeriesFixturesController.js';
import { CricketSeriesStandingsController } from './controllers/CricketSeriesStandingsController.js';
import { cricketRouter } from './routes/cricket.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { metricsMiddleware } from './middleware/metricsMiddleware.js';
import { requestLogger } from './middleware/requestLogger.js';
import { Logger, Metrics } from '../../infra/observability/types.js';
import { SseBroker } from '../sse/SseBroker.js';
import { cricketSseRouter } from '../sse/sse.routes.js';
import { CricketSseHandler } from '../sse/CricketSseHandler.js';
import { setupSwagger } from './swagger.js';

export type CricketAppDeps = {
  repo: CricketReadRepository;
  logger?: Logger;
  metrics?: Metrics;
  sseBroker?: SseBroker;
};

export const createCricketApp = ({ repo, logger, metrics, sseBroker }: CricketAppDeps): Express => {
  const app = express();
  app.use(express.json());
  app.use(requestLogger(logger));
  app.use(metricsMiddleware(metrics));
  setupSwagger(app);

  const controllers = {
    home: new CricketHomeController(new GetCricketHome(repo)),
    live: new CricketLiveController(new GetCricketLive(repo)),
    series: new CricketSeriesController(new GetCricketSeries(repo)),
    seriesById: new CricketSeriesByIdController(new GetCricketSeriesById(repo)),
    seriesFixtures: new CricketSeriesFixturesController(new GetCricketSeriesFixtures(repo)),
    seriesStandings: new CricketSeriesStandingsController(new GetCricketSeriesStandings(repo)),
    match: new CricketMatchController(new GetCricketMatchById(repo)),
    matchCenter: new CricketMatchCenterController(new GetCricketMatchCenter(repo)),
    player: new CricketPlayerController(new GetCricketPlayerById(repo)),
  };

  app.use(cricketRouter(controllers));

  if (sseBroker) {
    app.use(cricketSseRouter(new CricketSseHandler(sseBroker, metrics)));
  }

  app.use(errorHandler(logger));

  return app;
};