// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextRequest } from 'next/server';

import * as cookiesLib from 'client/shared/storage/cookies';

import appConfig from 'configs/app';
import * as essentialDappsChainsConfig from 'configs/essential-dapps-chains/config.nodejs';
import * as multichainConfig from 'configs/multichain/config.nodejs';

import generateCspPolicy from './generateCspPolicy';
import generateNftHtmlEmbedCspPolicy from './generateNftHtmlEmbedCspPolicy';

const marketplaceFeature = appConfig.features.marketplace;

const NFT_HTML_EMBED_PATH = '/nft-html-embed.html';

let cspPolicies: { 'private': string; 'default': string } | undefined = undefined;
let nftHtmlEmbedCsp: string | undefined = undefined;

async function initializeCspPolicies() {
  if (!cspPolicies) {
    appConfig.features.multichain.isEnabled && await multichainConfig.load();
    marketplaceFeature.isEnabled && marketplaceFeature.essentialDapps && await essentialDappsChainsConfig.load();

    // Generate and cache both policies upfront
    cspPolicies = {
      'private': generateCspPolicy(true),
      'default': generateCspPolicy(false),
    };
  }
}

export async function get(req?: NextRequest, nonce?: string): Promise<string> {
  await initializeCspPolicies();

  // Get appProfile from request (header, query param, or cookie)
  const appProfile = req ? (
    req.headers.get('x-app-profile') ||
    req.nextUrl.searchParams.get('app-profile') ||
    cookiesLib.getFromCookieString(req.headers.get('cookie') || '', cookiesLib.NAMES.APP_PROFILE)
  ) : undefined;

  const isPrivateMode = appProfile === 'private';

  if (req?.nextUrl.pathname === NFT_HTML_EMBED_PATH && !isPrivateMode) {
    if (!nftHtmlEmbedCsp) {
      nftHtmlEmbedCsp = generateNftHtmlEmbedCspPolicy();
    }

    return nftHtmlEmbedCsp;
  }

  if (nonce) {
    return generateCspPolicy(isPrivateMode, nonce);
  }

  return isPrivateMode ? cspPolicies?.private || '' : cspPolicies?.default || '';
}
