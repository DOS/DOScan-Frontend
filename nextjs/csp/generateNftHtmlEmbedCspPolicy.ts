<<<<<<< HEAD
=======
// SPDX-License-Identifier: LicenseRef-Blockscout

>>>>>>> v2.8.0-alpha.2
import { nftHtmlEmbed } from './policies/nftHtmlEmbed';
import { makePolicyString } from './utils';

export default function generateNftHtmlEmbedCspPolicy(): string {
  return makePolicyString(nftHtmlEmbed());
}
