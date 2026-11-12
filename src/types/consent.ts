import type { ISO8601 } from './domain';

/**
 * A local record of the privacy contract the user accepted.
 * This is not an identity document and contains no facial data.
 */
export interface ConsentRecord {
  readonly acceptedAt: ISO8601;
  readonly version: string;
  readonly ageConfirmed: boolean;
}
