// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { getApiVersionUrl } from './get-api-version-url';

describe('getApiVersionUrl', () => {
  it('keeps the upstream commit link behavior by default', () => {
    expect(getApiVersionUrl('v11.2.3.+commit.f64bbacb')).toBe(
      'https://github.com/blockscout/blockscout/commit/f64bbacb',
    );
  });

  it('keeps the upstream tree link behavior by default', () => {
    expect(getApiVersionUrl('v11.2.3')).toBe(
      'https://github.com/blockscout/blockscout/tree/v11.2.3',
    );
  });

  it('builds a release link for a custom repository and strips commit metadata', () => {
    expect(getApiVersionUrl(
      'v11.2.3.+commit.f64bbacb',
      'https://github.com/DOS/DOScan/',
      'release',
    )).toBe('https://github.com/DOS/DOScan/releases/tag/v11.2.3');
  });

  it('returns undefined when the version is missing', () => {
    expect(getApiVersionUrl(undefined)).toBeUndefined();
  });
});
