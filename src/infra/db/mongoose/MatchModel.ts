import mongoose, { Schema } from 'mongoose';

export type MatchDocument = {
  _id: string;
  seriesId: string;
  status: string;
  startTime: Date;
  venue?: string;
  teams: Array<{
    teamId: string;
    name: string;
    score?: string;
    overs?: string;
  }>;
  lastWicket?: string;
  isLive: boolean;
  isFeatured: boolean;
};

const MatchSchema = new Schema<MatchDocument>(
  {
    seriesId: { type: String, required: true, index: true },
    status: { type: String, required: true, index: true },
    startTime: { type: Date, required: true, index: true },
    venue: { type: String },
    teams: [
      {
        teamId: { type: String, required: true },
        name: { type: String, required: true },
        score: { type: String },
        overs: { type: String },
      },
    ],
    lastWicket: { type: String },
    isLive: { type: Boolean, required: true, index: true },
    isFeatured: { type: Boolean, required: true, index: true },
  },
  { collection: 'matches', timestamps: false }
);

MatchSchema.index({ seriesId: 1, startTime: 1 });
MatchSchema.index({ isLive: 1, startTime: -1 });
MatchSchema.index({ isFeatured: 1, startTime: -1 });

export const MatchModel = mongoose.model<MatchDocument>('Match', MatchSchema);
