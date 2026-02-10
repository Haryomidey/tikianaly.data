import { ValidationError } from '../../shared/errors.js';

export const parseLimit = (raw: string | undefined, max: number): number | undefined => {
  if (!raw) return undefined;
  const value = Number.parseInt(raw, 10);
  if (Number.isNaN(value) || value <= 0) {
    throw new ValidationError('limit must be a positive integer');
  }
  return Math.min(value, max);
};

export const parseBoolean = (raw: string | undefined): boolean | undefined => {
  if (raw === undefined) return undefined;
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  throw new ValidationError(`Invalid boolean value: ${raw}`);
};

export const parseDate = (raw: string | undefined, name: string): string | undefined => {
  if (!raw) return undefined;
  const value = new Date(raw);
  if (Number.isNaN(value.getTime())) {
    throw new ValidationError(`Invalid date for ${name}`);
  }
  return value.toISOString();
};

export const parseSeriesStatus = (
  raw: string | undefined
): 'current' | 'upcoming' | 'completed' | undefined => {
  if (!raw) return undefined;
  if (raw === 'current' || raw === 'upcoming' || raw === 'completed') return raw;
  throw new ValidationError('Invalid series status');
};

export const requireParam = (raw: string | undefined, name: string): string => {
  if (!raw) throw new ValidationError(`${name} is required`);
  return raw;
};
