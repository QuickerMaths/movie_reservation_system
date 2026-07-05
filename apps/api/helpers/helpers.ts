import { SeatSnapshotItem } from '../src/reservations/reservations.service';
import { Prisma } from '../generated/prisma/client';

export function isJsonObject(value: Prisma.JsonValue): value is Prisma.JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function toSeatSnapshotItems(value: Prisma.JsonValue | null): SeatSnapshotItem[] {
  if (!Array.isArray(value)) return [];

  return value.filter(isJsonObject).map((item) => ({
    seat_id: Number(item.seat_id),
    row: typeof item.row === 'string' ? item.row : '',
    number: Number(item.number),
    type: typeof item.type === 'string' ? item.type : '',
    price: Number(item.price),
  }));
}

export const toOptionalNumber = ({ value }: { value: unknown }) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  return Number(value);
};

export const toTrimmedString = ({ value }: { value: unknown }) => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
};

export const toOptionalBoolean = ({ value }: { value: unknown }) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (value === true || value === false) {
    return value;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return value;
};
