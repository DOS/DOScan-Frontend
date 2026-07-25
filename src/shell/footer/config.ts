// SPDX-License-Identifier: LicenseRef-Blockscout

import { getEnvValue, getExternalAssetFilePath } from 'src/config/utils/envs';

const config = Object.freeze({
  backendRepoUrl: getEnvValue('NEXT_PUBLIC_BACKEND_REPO_URL') || 'https://github.com/blockscout/blockscout',
  frontendRepoUrl: getEnvValue('NEXT_PUBLIC_FRONTEND_REPO_URL') || 'https://github.com/blockscout/frontend',
  links: getExternalAssetFilePath('NEXT_PUBLIC_FOOTER_LINKS'),
  frontendVersion: getEnvValue('NEXT_PUBLIC_GIT_TAG'),
  frontendCommit: getEnvValue('NEXT_PUBLIC_GIT_COMMIT_SHA'),
  versionLinkType: getEnvValue('NEXT_PUBLIC_VERSION_LINK_TYPE') === 'release' ? 'release' : 'tree',
});

export default config;
