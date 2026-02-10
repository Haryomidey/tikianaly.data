import mongoose, { Schema } from 'mongoose';

export type PlayerDocument = {
  _id: string;
  name: string;
  role: string;
  country: string;
  battingStyle?: string;
  bowlingStyle?: string;
};

const PlayerSchema = new Schema<PlayerDocument>(
  {
    name: { type: String, required: true, index: true },
    role: { type: String, required: true, index: true },
    country: { type: String, required: true, index: true },
    battingStyle: { type: String },
    bowlingStyle: { type: String },
  },
  { collection: 'players', timestamps: false }
);

PlayerSchema.index({ country: 1, role: 1 });

export const PlayerModel = mongoose.model<PlayerDocument>('Player', PlayerSchema);
