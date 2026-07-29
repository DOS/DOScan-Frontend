// SPDX-License-Identifier: LicenseRef-Blockscout

import type { BoxProps } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfo } from '@blockscout/interchain-indexer-types';
import type { ExternalChain } from 'src/shared/external-chains/types';

import useApiQuery from 'src/api/hooks/useApiQuery';

import type { EntityProps as TokenEntityProps } from 'src/slices/token/components/entity/TokenEntity';
import TokenEntityInterchain from 'src/slices/token/components/entity/TokenEntityInterchain';

import config from 'src/config';
import { route } from 'src/shared/router/routes';

import type { Props as AssetValueProps } from './AssetValue';
import AssetValue from './AssetValue';
import resolveInterchainTokenAddress from './resolveInterchainTokenAddress';

interface Props extends Omit<AssetValueProps, 'asset'> {
  token: TokenInfo;
  chain: ExternalChain | undefined;
  transactionHash?: string;
  tokenEntityProps?: Omit<TokenEntityProps, 'token'> & BoxProps;
}

const TokenValueInterchain = ({ token, tokenEntityProps, chain, transactionHash, ...rest }: Props) => {
  const isCurrentChain = chain?.id === config.chain.id;
  const tokenTransfersQuery = useApiQuery('core:tx_token_transfers', {
    pathParams: { hash: transactionHash },
    queryOptions: {
      enabled: isCurrentChain && Boolean(transactionHash),
      staleTime: Infinity,
    },
    logError: false,
  });

  const localTokenAddress = React.useMemo(() => {
    return resolveInterchainTokenAddress(token, rest.amount, tokenTransfersQuery.data?.items);
  }, [ rest.amount, token, tokenTransfersQuery.data?.items ]);

  const tokenInfo = React.useMemo(() => {
    return {
      symbol: token.symbol ?? null,
      address_hash: localTokenAddress ?? token.address_hash,
      icon_url: token.icon_url ?? null,
      name: token.name ?? null,
      type: 'ERC-20',
      reputation: null,
    };
  }, [ localTokenAddress, token.address_hash, token.icon_url, token.name, token.symbol ]);

  const fallbackHref = isCurrentChain && !localTokenAddress ?
    route({ pathname: '/address/[hash]', query: { hash: token.address_hash } }) :
    undefined;

  const asset = (
    <TokenEntityInterchain
      token={ tokenInfo }
      chain={ chain }
      noCopy
      onlySymbol
      flexShrink={ 0 }
      w="fit-content"
      ml={ 2 }
      icon={{ marginRight: 1 }}
      { ...tokenEntityProps }
      href={ tokenEntityProps?.href ?? fallbackHref }
    />
  );
  return (
    <AssetValue
      asset={ asset }
      decimals={ token.decimals }
      { ...rest }
    />
  );
};

export default React.memo(TokenValueInterchain);
