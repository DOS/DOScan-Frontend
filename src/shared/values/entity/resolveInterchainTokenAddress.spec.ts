import type { TokenInfo } from '@blockscout/interchain-indexer-types';

import { describe, expect, it } from 'vitest';

import resolveInterchainTokenAddress from './resolveInterchainTokenAddress';

// cspell:ignore WDOS
const tokenHome = '0x68a29f1ea0d8c0eea2f5090d077fa9b843f8d994';
const wrappedDos = '0x1111111111111111111111111111111111111111';
const recipient = '0x99999363ab400cd557e7e008a89d1235f1e99999';

const interchainToken = {
  address_hash: tokenHome,
  name: 'Wrapped DOS',
  symbol: 'WDOS',
  decimals: '18',
} satisfies TokenInfo;

const localTransfer = {
  from: { hash: tokenHome },
  to: { hash: recipient },
  token: {
    address_hash: wrappedDos,
    symbol: 'WDOS',
    decimals: '18',
    type: 'ERC-20',
  },
  total: {
    value: '5000000000000000',
  },
};

describe('resolveInterchainTokenAddress', () => {
  it('resolves an ICTT TokenHome address to the ERC-20 token emitted by the local transaction', () => {
    expect(resolveInterchainTokenAddress(interchainToken, '5000000000000000', [ localTransfer ])).toBe(wrappedDos);
  });

  it('keeps a direct ERC-20 token address when the interchain indexer already returns it', () => {
    const directToken = { ...interchainToken, address_hash: wrappedDos };

    expect(resolveInterchainTokenAddress(directToken, '5000000000000000', [ localTransfer ])).toBe(wrappedDos);
  });

  it('does not resolve an unrelated transfer with a different amount', () => {
    expect(resolveInterchainTokenAddress(interchainToken, '1', [ localTransfer ])).toBeUndefined();
  });

  it('does not resolve an unrelated transfer that only shares token metadata and amount', () => {
    const unrelatedTransfer = {
      ...localTransfer,
      from: { hash: recipient },
      to: { hash: recipient },
    };

    expect(resolveInterchainTokenAddress(interchainToken, '5000000000000000', [ unrelatedTransfer ])).toBeUndefined();
  });
});
