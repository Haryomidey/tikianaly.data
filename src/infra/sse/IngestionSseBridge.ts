import { Logger } from '../observability/types.js';
import { SseBroker } from '../../api/sse/SseBroker.js';

export type SseClient = {
  on: (event: string, handler: (payload: unknown) => void) => void;
  close: () => void;
};

export type SseClientFactory = (url: string, headers?: Record<string, string>) => SseClient;

export class IngestionSseBridge {
  private client: SseClient | null = null;

  constructor(
    private readonly broker: SseBroker,
    private readonly factory: SseClientFactory,
    private readonly logger?: Logger
  ) {}

  start(url: string, headers?: Record<string, string>): void {
    this.client = this.factory(url, headers);
    this.client.on('cricket.live.scoreboard', (payload) => {
      this.broker.publish('cricket.live.scoreboard', payload);
    });
    this.logger?.info('sse.ingestion.connected', { url });
  }

  subscribeMatch(matchId: string): void {
    if (!this.client) return;
    const topic = `cricket.live.match.${matchId}`;
    this.client.on(topic, (payload) => {
      this.broker.publish(topic, payload);
    });
  }

  stop(): void {
    this.client?.close();
    this.client = null;
    this.logger?.info('sse.ingestion.disconnected');
  }
}
