// SPDX-License-Identifier: LicenseRef-Blockscout

import type { TokenInfo } from '@blockscout/interchain-indexer-types';

interface LocalTokenTransfer {
  from?: { hash: string } | null;
  to?: { hash: string } | null;
  token?: {
    address_hash: string;
    symbol?: string | null;
    decimals?: string | null;
    type?: string | null;
  } | null;
  total?: unknown;
}

function isSameAddress(left: string | undefined, right: string) {
  return left?.toLowerCase() === right.toLowerCase();
}

function getTransferValue(total: unknown) {
  if (!total || typeof total !== 'object' || !('value' in total)) {
    return;
  }

  return typeof total.value === 'string' ? total.value : undefined;
}

function isMatchingToken(transfer: LocalTokenTransfer, token: TokenInfo, amount: string | null | undefined) {
  if (!transfer.token || transfer.token.type !== 'ERC-20') {
    return false;
  }

  const transferValue = getTransferValue(transfer.total);
  if (amount && transferValue !== amount) {
    return false;
  }

  if (token.symbol && token.symbol.toLowerCase() !== transfer.token.symbol?.toLowerCase()) {
    return false;
  }

  if (token.decimals && token.decimals !== transfer.token.decimals) {
    return false;
  }

  return true;
}

export default function resolveInterchainTokenAddress(
  token: TokenInfo,
  amount: string | null | undefined,
  transfers: Array<LocalTokenTransfer> | undefined,
) {
  if (!transfers?.length) {
    return;
  }

  const candidates = transfers.filter((transfer) => isMatchingToken(transfer, token, amount));

  const directTokenMatch = candidates.find((transfer) => isSameAddress(transfer.token?.address_hash, token.address_hash));
  if (directTokenMatch?.token) {
    return directTokenMatch.token.address_hash;
  }

  const tokenHomeMatch = candidates.find((transfer) => {
    return isSameAddress(transfer.from?.hash, token.address_hash) || isSameAddress(transfer.to?.hash, token.address_hash);
  });
  if (tokenHomeMatch?.token) {
    return tokenHomeMatch.token.address_hash;
  }
}
