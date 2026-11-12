import { hasCurrentConsent } from '@/utils';
import type { ConsentRecord } from '@/types';

const VALID_CONSENT: ConsentRecord = {
  acceptedAt: '2026-11-12T10:00:00.000Z',
  ageConfirmed: true,
  version: '2026-11-01',
};

describe('hasCurrentConsent', () => {
  it('accepts a current, adult-confirmed consent record', () => {
    expect(hasCurrentConsent(VALID_CONSENT, '2026-11-01')).toBe(true);
  });

  it('rejects a missing record', () => {
    expect(hasCurrentConsent(null, '2026-11-01')).toBe(false);
  });

  it('rejects an outdated consent version', () => {
    expect(hasCurrentConsent(VALID_CONSENT, '2027-01-01')).toBe(false);
  });

  it('rejects a record without adult confirmation', () => {
    expect(
      hasCurrentConsent({ ...VALID_CONSENT, ageConfirmed: false }, '2026-11-01'),
    ).toBe(false);
  });

  it('rejects an invalid acceptance date', () => {
    expect(
      hasCurrentConsent({ ...VALID_CONSENT, acceptedAt: 'not-a-date' }, '2026-11-01'),
    ).toBe(false);
  });
});
