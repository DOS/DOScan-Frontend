import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type * as contractsInfo from '@blockscout/contracts-info-types';

import type { ResourceError } from 'src/api/resources';

import { tokenInfo } from 'src/slices/token/mocks/info';

<<<<<<< HEAD
=======
import { generateAddressMetadataInfo, hiddenProtocolTagWithMeta } from 'src/features/address-metadata/mocks/tags';

import config from 'src/config';

>>>>>>> v2.13.0
import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import TokenPageTitle from './TokenPageTitle';

<<<<<<< HEAD
test('with action button +@dark-mode +@mobile', async({ render, mockEnvs }) => {

  const tokenQuery = {
    data: tokenInfo,
  } as UseQueryResult<schemas['Token'], ResourceError<unknown>>;

  const verifiedInfoQuery = {
    data: {},
  } as UseQueryResult<contractsInfo.TokenInfo, ResourceError<unknown>>;

  const addressQuery = {} as UseQueryResult<schemas['Address'], ResourceError<unknown>>;

  await mockEnvs(ENVS_MAP.tokenActionButton);
=======
const hash = tokenInfo.address_hash;

const tokenQuery = {
  data: tokenInfo,
} as UseQueryResult<schemas['Token'], ResourceError<unknown>>;

const verifiedInfoQuery = {
  data: {},
} as UseQueryResult<contractsInfo.TokenInfo, ResourceError<unknown>>;

const addressQuery = {} as UseQueryResult<schemas['Address'], ResourceError<unknown>>;

const addressMetadataQueryParams = {
  addresses: [ hash ],
  chainId: config.chain.id,
  tagsLimit: '20',
};

test('with action button +@dark-mode +@mobile', async({ render, mockApiResponse, mockAssetResponse }) => {
  await mockApiResponse('metadata:info', generateAddressMetadataInfo(hash, hiddenProtocolTagWithMeta), { queryParams: addressMetadataQueryParams });
  await mockAssetResponse(hiddenProtocolTagWithMeta.meta?.appLogoURL as string, './playwright/mocks/image_s.jpg');
  await mockAssetResponse(tokenInfo.icon_url as string, './playwright/mocks/image_s.jpg');
>>>>>>> v2.13.0

  const component = await render(
    <TokenPageTitle
      tokenQuery={ tokenQuery }
<<<<<<< HEAD
      hash={ tokenInfo.address_hash }
=======
      hash={ hash }
>>>>>>> v2.13.0
      addressQuery={ addressQuery }
      verifiedInfoQuery={ verifiedInfoQuery }
    />);

<<<<<<< HEAD
=======
  await expect(component.getByRole('link', { name: /Buy on Duck portal/ })).toHaveAttribute(
    'href',
    `https://portal.duck.io/swap?chainId=${ config.chain.id }&token=${ hash.toLowerCase() }&utm_source=blockscout&utm_medium=token`,
  );
  await expect(component.getByText('Buy on Duck portal', { exact: true })).toHaveCount(1);
  await expect(component).toHaveScreenshot();
});

test('with env action button +@dark-mode +@mobile', async({ render, mockApiResponse, mockAssetResponse, mockEnvs }) => {
  await mockEnvs(ENVS_MAP.tokenActionButton);
  await mockApiResponse('metadata:info', generateAddressMetadataInfo(hash, hiddenProtocolTagWithMeta), { queryParams: addressMetadataQueryParams });
  await mockAssetResponse(tokenInfo.icon_url as string, './playwright/mocks/image_s.jpg');

  const component = await render(
    <TokenPageTitle
      tokenQuery={ tokenQuery }
      hash={ hash }
      addressQuery={ addressQuery }
      verifiedInfoQuery={ verifiedInfoQuery }
    />);

  await expect(component.getByRole('link', { name: /Buy on Duck Portal/ })).toHaveAttribute(
    'href',
    `https://portal.duck.io/swap?chainId=1&token=${ hash.toLowerCase() }&utm_source=blockscout&utm_medium=token`,
  );
  await expect(component.getByText('Buy on Duck portal', { exact: true })).toHaveCount(0);
>>>>>>> v2.13.0
  await expect(component).toHaveScreenshot();
});
