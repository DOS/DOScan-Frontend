// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import config from 'src/config';
import { route } from 'src/shared/router/routes';
import TokenValueInterchainBase from 'src/shared/values/entity/TokenValueInterchain';

import resolveInterchainTokenAddress from './resolveInterchainTokenAddress';

type Props = React.ComponentProps<typeof TokenValueInterchainBase> & {
  transactionHash?: string;
};

const TokenValueInterchain = ({
  token,
  tokenEntityProps,
  chain,
  transactionHash,
  amount,
  ...rest
}: Props) => {
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
    return resolveInterchainTokenAddress(token, amount, tokenTransfersQuery.data?.items);
  }, [ amount, token, tokenTransfersQuery.data?.items ]);

  const localToken = React.useMemo(() => {
    return localTokenAddress ? { ...token, address_hash: localTokenAddress } : token;
  }, [ localTokenAddress, token ]);

  const fallbackHref = isCurrentChain && !localTokenAddress ?
    route({ pathname: '/address/[hash]', query: { hash: token.address_hash } }) :
    undefined;

  return (
    <TokenValueInterchainBase
      { ...rest }
      amount={ amount }
      chain={ chain }
      token={ localToken }
      tokenEntityProps={{
        ...tokenEntityProps,
        href: tokenEntityProps?.href ?? fallbackHref,
      }}
    />
  );
};

export default TokenValueInterchain;
