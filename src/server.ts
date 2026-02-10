import mongoose from 'mongoose';
import { createCricketApp } from './api/http/createApp.js';
import { MongoCricketReadRepository } from './infra/db/repositories/MongoCricketReadRepository.js';
import { SseBroker } from './api/sse/SseBroker.js';
import dotenv from 'dotenv';
dotenv.config();

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception', err);
  process.exit(1);
});

const mongoUrl = process.env.MONGO_URL;
if (!mongoUrl) {
  throw new Error('MONGO_URL is required');
}

const port = Number(process.env.PORT ?? 3000);

const start = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(mongoUrl);
    console.log("Database connected successfully: " + conn.connection.host);
  } catch (error) {
    console.log("Failed to connect to database!");
    process.exit(1);
  }

  const repo = new MongoCricketReadRepository();
  const sseBroker = new SseBroker();

  const app = createCricketApp({ repo, sseBroker });

  app.listen(port, () => {
    console.log(`Cricket API listening on :${port}`);
  });
};

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});