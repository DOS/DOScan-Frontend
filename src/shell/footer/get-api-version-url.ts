// SPDX-License-Identifier: LicenseRef-Blockscout

type VersionLinkType = 'release' | 'tree';

export function getApiVersionUrl(
  version: string | undefined,
  repoUrl = 'https://github.com/blockscout/blockscout',
  linkType: VersionLinkType = 'tree',
): string | undefined {
  if (!version) {
    return;
  }

  const [ tag, commit ] = version.split('.+commit.');
  const normalizedRepoUrl = repoUrl.replace(/\/+$/, '');

  if (linkType === 'release') {
    return `${ normalizedRepoUrl }/releases/tag/${ tag }`;
  }

  if (commit) {
    return `${ normalizedRepoUrl }/commit/${ commit }`;
  }

  return `${ normalizedRepoUrl }/tree/${ tag }`;
}
