import { Response } from 'express';
import { randomUUID } from 'crypto';

type Listener = (topic: string, payload: unknown) => void;

export class SseBroker {
  private readonly clients = new Map<string, Response>();
  private readonly listeners = new Set<Listener>();

  register(res: Response): string {
    const id = randomUUID();
    this.clients.set(id, res);
    return id;
  }

  unregister(id: string): void {
    this.clients.delete(id);
  }

  getClientCount(): number {
    return this.clients.size;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  publish(topic: string, payload: unknown): void {
    const data = JSON.stringify({ topic, payload });
    for (const res of this.clients.values()) {
      res.write(`event: ${topic}\n`);
      res.write(`data: ${data}\n\n`);
    }
    for (const listener of this.listeners) {
      listener(topic, payload);
    }
  }
}
