import React from 'react';

import { TOKEN_TRANSFER_ERC_20 } from 'src/slices/token-transfer/stubs';

import * as crossChainConfigMock from 'src/features/cross-chain-txs/mocks/config';

import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import TokenValueInterchain from './TokenValueInterchain';

// cspell:ignore WDOS
const tokenHome = '0x68a29f1ea0d8c0eea2f5090d077fa9b843f8d994';
const wrappedDos = '0x1111111111111111111111111111111111111111';
const transactionHash = '0x3153c9a20ca4fb1458615b60e95ec863a19b2bc73030942e0ed13deac8386a4a';

test('links an ICTT TokenHome token to the underlying ERC-20 token', async({ render, mockEnvs, mockApiResponse }) => {
  await mockEnvs([
    ...ENVS_MAP.crossChainTxs,
    [ 'NEXT_PUBLIC_NETWORK_ID', crossChainConfigMock.config[1].id ],
  ]);
  await mockApiResponse('core:tx_token_transfers', {
    items: [
      {
        ...TOKEN_TRANSFER_ERC_20,
        from: {
          ...TOKEN_TRANSFER_ERC_20.from,
          hash: tokenHome,
        },
        token: {
          ...TOKEN_TRANSFER_ERC_20.token,
          address_hash: wrappedDos,
          name: 'Wrapped DOS',
          symbol: 'WDOS',
          decimals: '18',
        },
        total: {
          decimals: '18',
          value: '5000000000000000',
        },
      },
    ],
    next_page_params: null,
  }, {
    pathParams: { hash: transactionHash },
  });

  const component = await render(
    <TokenValueInterchain
      amount="5000000000000000"
      chain={ crossChainConfigMock.config[1] }
      token={{
        address_hash: tokenHome,
        name: 'Wrapped DOS',
        symbol: 'WDOS',
        decimals: '18',
      }}
      transactionHash={ transactionHash }
    />,
  );

  await expect(component.getByRole('link', { name: 'WDOS' })).toHaveAttribute('href', `/token/${ wrappedDos }`);
});

test('links an unresolved current-chain TokenHome token to its address page', async({ render, mockEnvs }) => {
  await mockEnvs([
    ...ENVS_MAP.crossChainTxs,
    [ 'NEXT_PUBLIC_NETWORK_ID', crossChainConfigMock.config[1].id ],
  ]);

  const component = await render(
    <TokenValueInterchain
      amount="5000000000000000"
      chain={ crossChainConfigMock.config[1] }
      token={{
        address_hash: tokenHome,
        name: 'Wrapped DOS',
        symbol: 'WDOS',
        decimals: '18',
      }}
    />,
  );

  await expect(component.getByRole('link', { name: 'WDOS' })).toHaveAttribute('href', `/address/${ tokenHome }`);
});
