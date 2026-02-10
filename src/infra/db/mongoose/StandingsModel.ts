import mongoose, { Schema } from 'mongoose';

export type StandingsDocument = {
  _id: string;
  seriesId: string;
  group?: string;
  rows: Array<{
    teamId: string;
    teamName: string;
    played: number;
    won: number;
    lost: number;
    points: number;
    nrr?: number;
  }>;
};

const StandingsSchema = new Schema<StandingsDocument>(
  {
    seriesId: { type: String, required: true, index: true },
    group: { type: String, index: true },
    rows: [
      {
        teamId: { type: String, required: true },
        teamName: { type: String, required: true },
        played: { type: Number, required: true },
        won: { type: Number, required: true },
        lost: { type: Number, required: true },
        points: { type: Number, required: true },
        nrr: { type: Number },
      },
    ],
  },
  { collection: 'standings', timestamps: false }
);

StandingsSchema.index({ seriesId: 1, group: 1 });

export const StandingsModel = mongoose.model<StandingsDocument>('Standings', StandingsSchema);
