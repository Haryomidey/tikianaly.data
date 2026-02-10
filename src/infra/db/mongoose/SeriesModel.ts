import mongoose, { Schema } from 'mongoose';

export type SeriesDocument = {
  _id: string;
  name: string;
  season: string;
  status: 'current' | 'upcoming' | 'completed';
  host?: string;
  startDate?: Date;
  endDate?: Date;
  matchesCount?: number;
};

const SeriesSchema = new Schema<SeriesDocument>(
  {
    name: { type: String, required: true },
    season: { type: String, required: true, index: true },
    status: { type: String, required: true, index: true },
    host: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    matchesCount: { type: Number },
  },
  { collection: 'series', timestamps: false }
);

SeriesSchema.index({ status: 1, startDate: 1 });
SeriesSchema.index({ startDate: -1 });

export const SeriesModel = mongoose.model<SeriesDocument>('Series', SeriesSchema);
