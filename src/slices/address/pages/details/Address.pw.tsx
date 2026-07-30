import React from 'react';
import { numberToHex } from 'viem';

import * as addressMock from 'src/slices/address/mocks/address';
import * as addressParamMock from 'src/slices/address/mocks/address-param';
import * as addressCountersMock from 'src/slices/address/mocks/counters';
import * as addressTabCountersMock from 'src/slices/address/mocks/tab-counters';

import { USER_OPS_ACCOUNT, USER_OPS_ITEM } from 'src/features/user-ops/stubs';

import config from 'src/config';

import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import * as socketServer from 'playwright/fixtures/socketServer';
import { test, expect } from 'playwright/lib';
import * as pwConfig from 'playwright/utils/config';

import Address from './Address';

const hooksConfig = {
  router: {
    query: { hash: addressParamMock.hash },
  },
};

test.beforeEach(async({ mockTextAd }) => {
  await mockTextAd();
});

test.describe('fetched bytecode', () => {
  test('should refetch address query', async({ render, mockApiResponse, createSocket, page }) => {
    const addressApiUrl = await mockApiResponse('core:address', addressMock.validator, { pathParams: { hash: addressParamMock.hash } });
    await mockApiResponse('core:address_counters', addressCountersMock.forValidator, { pathParams: { hash: addressParamMock.hash } });
    await mockApiResponse('core:address_tabs_counters', addressTabCountersMock.base, { pathParams: { hash: addressParamMock.hash } });
    await mockApiResponse('core:address_txs', { items: [], next_page_params: null }, { pathParams: { hash: addressParamMock.hash } });
    await render(<Address/>, { hooksConfig }, { withSocket: true });

    const socket = await createSocket();
    const channel = await socketServer.joinChannel(socket, `addresses:${ addressParamMock.hash.toLowerCase() }`);
    socketServer.sendMessage(socket, channel, 'fetched_bytecode', { fetched_bytecode: '0x0123' });

    const request = await page.waitForRequest(addressApiUrl);

    expect(request).toBeTruthy();
  });
});

test('degradation view', async({ render, page, mockRpcResponse, mockApiResponse }) => {
  await mockApiResponse('core:address', null as never, { pathParams: { hash: addressParamMock.hash }, status: 500 });
  await mockApiResponse('core:address_counters', addressCountersMock.forValidator, { pathParams: { hash: addressParamMock.hash } });
  await mockApiResponse('core:address_tabs_counters', null as never, { pathParams: { hash: addressParamMock.hash }, status: 500 });
  await mockApiResponse('core:address_txs', null as never, { pathParams: { hash: addressParamMock.hash }, status: 500 });
  await mockRpcResponse([ {
    Method: 'eth_getBalance',
    Parameters: [ addressParamMock.hash, 'latest' ],
    ReturnType: numberToHex(1234567890123456),
  } ]);

  const component = await render(<Address/>, { hooksConfig });
  await page.waitForResponse(config.chain.rpcUrls[0]);

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(pwConfig.adsBannerSelector) ],
    maskColor: pwConfig.maskColor,
  });
});

test.describe('user operations account detection', () => {
  test.beforeEach(async({ mockEnvs, mockApiResponse }) => {
    await mockEnvs(ENVS_MAP.userOps);
    await mockApiResponse('core:address', addressMock.validator, { pathParams: { hash: addressParamMock.hash } });
    await mockApiResponse('core:address_counters', addressCountersMock.forValidator, { pathParams: { hash: addressParamMock.hash } });
    await mockApiResponse('core:address_tabs_counters', addressTabCountersMock.base, { pathParams: { hash: addressParamMock.hash } });
    await mockApiResponse('core:address_txs', { items: [], next_page_params: null }, { pathParams: { hash: addressParamMock.hash } });
  });

  test('does not request account details when the address has no user operations', async({ render, mockApiResponse, page }) => {
    const accountRequests: Array<string> = [];
    page.on('request', (request) => {
      if (request.url().includes(`/api/v2/proxy/account-abstraction/accounts/${ addressParamMock.hash }`)) {
        accountRequests.push(request.url());
      }
    });

    const presenceApiUrl = await mockApiResponse(
      'core:user_ops',
      { items: [], next_page_params: null },
      { queryParams: { sender: addressParamMock.hash, page_size: 1 } },
    );

    const presenceResponse = page.waitForResponse(presenceApiUrl);
    const component = await render(<Address/>, { hooksConfig });
    await presenceResponse;

    await expect(component.getByRole('tab', { name: 'User operations' })).toHaveCount(0);
    await expect(component.getByText('Smart contract wallet')).toHaveCount(0);
    expect(accountRequests).toEqual([]);
  });

  test('loads account details when the address has user operations', async({ render, mockApiResponse, page }) => {
    const presenceApiUrl = await mockApiResponse(
      'core:user_ops',
      { items: [ USER_OPS_ITEM ], next_page_params: null },
      { queryParams: { sender: addressParamMock.hash, page_size: 1 } },
    );
    const accountApiUrl = await mockApiResponse(
      'core:user_ops_account',
      USER_OPS_ACCOUNT,
      { pathParams: { hash: addressParamMock.hash } },
    );

    const presenceResponse = page.waitForResponse(presenceApiUrl);
    const accountResponse = page.waitForResponse(accountApiUrl);
    const component = await render(<Address/>, { hooksConfig });
    await presenceResponse;
    await accountResponse;

    await expect(component.getByRole('tab', { name: /User operations/ })).toBeVisible();
    await expect(component.getByText('Smart contract wallet')).toBeVisible();
  });
});
