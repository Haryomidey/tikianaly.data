import { Request, Response } from 'express';
import { SseBroker } from './SseBroker.js';
import { Metrics } from '../../infra/observability/types.js';

export class CricketSseHandler {
  constructor(private readonly broker: SseBroker, private readonly metrics?: Metrics) {}

  connect(req: Request, res: Response): void {
    res.status(200);
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const clientId = this.broker.register(res);
    this.metrics?.gauge('sse.connections', this.broker.getClientCount(), { channel: 'cricket' });

    req.on('close', () => {
      this.broker.unregister(clientId);
      this.metrics?.gauge('sse.connections', this.broker.getClientCount(), { channel: 'cricket' });
    });
  }
}
