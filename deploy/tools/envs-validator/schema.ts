// SPDX-License-Identifier: LicenseRef-Blockscout

import * as v from 'valibot';

import type { TxExternalTxsConfig } from 'src/features/external-txs/types/client';
import type { GasRefuelProviderConfig } from 'src/features/get-gas-button/types/client';
import { PROVIDERS as TX_INTERPRETATION_PROVIDERS } from 'src/features/tx-interpretation/common/types/config';
import { VALIDATORS_CHAIN_TYPE } from 'src/features/validators/types/config';
import { SUPPORTED_WALLETS } from 'src/features/web3-wallet/types/config';
import { GAS_UNITS } from 'src/slices/gas/types/config';

import apisSchema from './schemas/apis';
import { appSchema, buildTimeSchema, proxySchema } from './schemas/app';
import chainSchema from './schemas/chain';
import * as featuresSchemas from './schemas/features';
import metaSchema from './schemas/meta';
import servicesSchema from './schemas/services';
import * as uiSchemas from './schemas/ui';
import { composeSchemas, envBoolean, envHtml, envJson, envUrl, requires } from './utils';

type AddressProfileAPIConfig = {
  api_url_template: string;
  tag_link_template?: string;
  tag_icon?: string;
  tag_bg_color?: string;
  tag_text_color?: string;
};

const gasRefuelProviderConfigSchema: v.GenericSchema<GasRefuelProviderConfig> = v.object({
  name: v.pipe(v.string(), v.nonEmpty()),
  url_template: v.pipe(v.string(), v.nonEmpty()),
  logo: v.optional(v.string()),
  dapp_id: v.optional(v.string()),
});

const addressProfileAPIConfigSchema: v.GenericSchema<AddressProfileAPIConfig> = v.object({
  api_url_template: v.pipe(v.string(), v.nonEmpty()),
  tag_link_template: v.optional(v.string()),
  tag_icon: v.optional(v.string()),
  tag_bg_color: v.optional(v.string()),
  tag_text_color: v.optional(v.string()),
});

const txExternalTxsConfigSchema: v.GenericSchema<TxExternalTxsConfig> = v.object({
  chain_name: v.pipe(v.string(), v.nonEmpty()),
  chain_logo_url: v.pipe(v.string(), v.nonEmpty()),
  explorer_url_template: v.pipe(v.string(), v.nonEmpty()),
});

const usercentricsConfigSchema = v.object({
  settingsId: v.optional(v.string()),
  rulesetId: v.optional(v.string()),
});

const singleVariableFeaturesSchema = v.pipe(
  v.looseObject({
    NEXT_PUBLIC_WEB3_WALLETS: v.optional(v.union([ v.literal('none'), envJson(v.array(v.picklist(SUPPORTED_WALLETS))) ])),
    NEXT_PUBLIC_WEB3_DISABLE_ADD_TOKEN_TO_WALLET: v.optional(envBoolean()),
    NEXT_PUBLIC_TRANSACTION_INTERPRETATION_PROVIDER: v.optional(v.picklist(TX_INTERPRETATION_PROVIDERS)),
    NEXT_PUBLIC_SAFE_TX_SERVICE_URL: v.optional(envUrl()),
    NEXT_PUBLIC_IS_SUAVE_CHAIN: v.optional(envBoolean()),
    NEXT_PUBLIC_METASUITES_ENABLED: v.optional(envBoolean()),
    NEXT_PUBLIC_GAS_REFUEL_PROVIDER_CONFIG: v.optional(envJson(gasRefuelProviderConfigSchema)),
    NEXT_PUBLIC_VALIDATORS_CHAIN_TYPE: v.optional(v.picklist(VALIDATORS_CHAIN_TYPE)),
    NEXT_PUBLIC_GAS_TRACKER_ENABLED: v.optional(envBoolean()),
    NEXT_PUBLIC_GAS_TRACKER_UNITS: v.optional(envJson(v.array(v.picklist(GAS_UNITS)))),
    NEXT_PUBLIC_DATA_AVAILABILITY_ENABLED: v.optional(envBoolean()),
    NEXT_PUBLIC_ADVANCED_FILTER_ENABLED: v.optional(envBoolean()),
    NEXT_PUBLIC_CELO_ENABLED: v.optional(envBoolean()),
    NEXT_PUBLIC_DEX_POOLS_ENABLED: v.optional(envBoolean()),
    NEXT_PUBLIC_ADDRESS_USERNAME_TAG: v.optional(envJson(addressProfileAPIConfigSchema)),
    NEXT_PUBLIC_XSTAR_SCORE_URL: v.optional(envUrl()),
    NEXT_PUBLIC_GAME_BADGE_CLAIM_LINK: v.optional(envUrl()),
    NEXT_PUBLIC_PUZZLE_GAME_BADGE_CLAIM_LINK: v.optional(envUrl()),
    NEXT_PUBLIC_TX_EXTERNAL_TRANSACTIONS_CONFIG: v.optional(envJson(txExternalTxsConfigSchema)),
    NEXT_PUBLIC_HOT_CONTRACTS_ENABLED: v.optional(envBoolean()),
    NEXT_PUBLIC_USERCENTRICS_CONFIG: v.optional(envJson(usercentricsConfigSchema)),
    NEXT_PUBLIC_USERCENTRICS_DRAFT: v.optional(envBoolean()),
  }),
  requires('NEXT_PUBLIC_DEX_POOLS_ENABLED', 'NEXT_PUBLIC_CONTRACT_INFO_API_HOST'),
  requires('NEXT_PUBLIC_USERCENTRICS_DRAFT', 'NEXT_PUBLIC_USERCENTRICS_CONFIG'),
);

const miscSchema = v.object({
  NEXT_PUBLIC_PRO_API_SUPPORTED: v.optional(envBoolean()),
  NEXT_PUBLIC_API_KEYS_ALERT_MESSAGE: v.optional(envHtml()),
  NEXT_PUBLIC_API_DOCS_ALERT_MESSAGE: v.optional(v.string()),
});

<<<<<<< HEAD
        return isUndefined || valueSchema.isValidSync(data);
      }),
    NEXT_PUBLIC_VALIDATORS_CHAIN_TYPE: yup.string<ValidatorsChainType>().oneOf(VALIDATORS_CHAIN_TYPE),
    NEXT_PUBLIC_GAS_TRACKER_ENABLED: yup.boolean(),
    NEXT_PUBLIC_GAS_TRACKER_UNITS: yup.array().transform(replaceQuotes).json().of(yup.string<GasUnit>().oneOf(GAS_UNITS)),
    NEXT_PUBLIC_DATA_AVAILABILITY_ENABLED: yup.boolean(),
    NEXT_PUBLIC_ADVANCED_FILTER_ENABLED: yup.boolean(),
    NEXT_PUBLIC_CELO_ENABLED: yup.boolean(),
    NEXT_PUBLIC_DEX_POOLS_ENABLED: yup.boolean()
      .when('NEXT_PUBLIC_CONTRACT_INFO_API_HOST', {
        is: (value: string) => Boolean(value),
        then: (schema) => schema,
        otherwise: (schema) => schema.test(
          'not-exist',
          'NEXT_PUBLIC_DEX_POOLS_ENABLED can only be used with NEXT_PUBLIC_CONTRACT_INFO_API_HOST',
          value => value === undefined,
        ),
      }),
    NEXT_PUBLIC_ADDRESS_USERNAME_TAG: yup
      .mixed()
      .test('shape', 'Invalid schema were provided for NEXT_PUBLIC_ADDRESS_USERNAME_TAG, it should have api_url_template', (data) => {
        const isUndefined = data === undefined;
        const valueSchema = yup.object<AddressProfileAPIConfig>().transform(replaceQuotes).json().shape({
          api_url_template: yup.string().required(),
          tag_link_template: yup.string(),
          tag_icon: yup.string(),
          tag_bg_color: yup.string(),
          tag_text_color: yup.string(),
        });

        return isUndefined || valueSchema.isValidSync(data);
      }),
    NEXT_PUBLIC_XSTAR_SCORE_URL: yup.string().test(urlTest),
    NEXT_PUBLIC_GAME_BADGE_CLAIM_LINK: yup.string().test(urlTest),
    NEXT_PUBLIC_PUZZLE_GAME_BADGE_CLAIM_LINK: yup.string().test(urlTest),
    NEXT_PUBLIC_TX_EXTERNAL_TRANSACTIONS_CONFIG: yup.mixed().test(
      'shape',
      'Invalid schema were provided for NEXT_PUBLIC_TX_EXTERNAL_TRANSACTIONS_CONFIG, it should have chain_name, chain_logo_url, and explorer_url_template',
      (data) => {
        const isUndefined = data === undefined;
        const valueSchema = yup.object<TxExternalTxsConfig>().transform(replaceQuotes).json().shape({
          chain_name: yup.string().required(),
          chain_logo_url: yup.string().required(),
          explorer_url_template: yup.string().required(),
        });

        return isUndefined || valueSchema.isValidSync(data);
      }),
    NEXT_PUBLIC_HOT_CONTRACTS_ENABLED: yup.boolean(),
    NEXT_PUBLIC_USERCENTRICS_CONFIG: yup
      .mixed()
      .test('shape', 'Invalid schema for NEXT_PUBLIC_USERCENTRICS_CONFIG, it should have settingsId or rulesetId', (data) => {
        const isUndefined = data === undefined;
        const valueSchema = yup.object().transform(replaceQuotes).json().shape({
          settingsId: yup.string(),
          rulesetId: yup.string(),
        });
        return isUndefined || valueSchema.isValidSync(data);
      }),
    NEXT_PUBLIC_USERCENTRICS_DRAFT: yup.boolean().when('NEXT_PUBLIC_USERCENTRICS_CONFIG', {
      is: (value: string) => Boolean(value),
      then: (schema) => schema,
      otherwise: (schema) => schema.test(
        'not-exist',
        'NEXT_PUBLIC_USERCENTRICS_DRAFT can only be used with NEXT_PUBLIC_USERCENTRICS_CONFIG',
        value => value === undefined,
      ),
    }),

    // Misc
    NEXT_PUBLIC_PRO_API_SUPPORTED: yup.boolean(),
    NEXT_PUBLIC_USE_NEXT_JS_PROXY: yup.boolean(),
    NEXT_PUBLIC_API_KEYS_ALERT_MESSAGE: yup.string(),
    NEXT_PUBLIC_API_DOCS_ALERT_MESSAGE: yup.string(),
  })
  .concat(apisSchema)
  .concat(chainSchema)
  .concat(metaSchema)
  .concat(uiSchemas.homepageSchema)
  .concat(uiSchemas.navigationSchema)
  .concat(uiSchemas.footerSchema)
  .concat(uiSchemas.miscSchema)
  .concat(uiSchemas.viewsSchema)
  .concat(featuresSchemas.accountSchema)
  .concat(featuresSchemas.address3rdPartyWidgetsConfigSchema)
  .concat(featuresSchemas.adsSchema)
  .concat(featuresSchemas.apiDocsSchema)
  .concat(featuresSchemas.beaconChainSchema)
  .concat(featuresSchemas.bridgedTokensSchema)
  .concat(featuresSchemas.crossChainTxsSchema)
  .concat(featuresSchemas.defiDropdownSchema)
  .concat(featuresSchemas.flashblocksSchema)
  .concat(featuresSchemas.highlightsConfigSchema)
  .concat(featuresSchemas.marketplaceSchema)
  .concat(featuresSchemas.megaEthSchema)
  .concat(featuresSchemas.multichainButtonSchema)
  .concat(featuresSchemas.nameServicesSchema)
  .concat(featuresSchemas.rollupSchema)
  .concat(featuresSchemas.tacSchema)
  .concat(featuresSchemas.tokenActionButtonSchema)
  .concat(featuresSchemas.userOpsSchema)
  .concat(featuresSchemas.zetaChainSchema)
  .concat(servicesSchema)
=======
const schema = composeSchemas([
  buildTimeSchema,
  appSchema,
  proxySchema,
  singleVariableFeaturesSchema,
  miscSchema,
  apisSchema,
  chainSchema,
  metaSchema,
  uiSchemas.homepageSchema,
  uiSchemas.navigationSchema,
  uiSchemas.footerSchema,
  uiSchemas.miscSchema,
  uiSchemas.viewsSchema,
  featuresSchemas.accountSchema,
  featuresSchemas.address3rdPartyWidgetsConfigSchema,
  featuresSchemas.adsSchema,
  featuresSchemas.apiDocsSchema,
  featuresSchemas.beaconChainSchema,
  featuresSchemas.bridgedTokensSchema,
  featuresSchemas.bubblemapsSchema,
  featuresSchemas.crossChainTxsSchema,
  featuresSchemas.defiDropdownSchema,
  featuresSchemas.flashblocksSchema,
  featuresSchemas.highlightsConfigSchema,
  featuresSchemas.marketplaceSchema,
  featuresSchemas.megaEthSchema,
  featuresSchemas.multichainButtonSchema,
  featuresSchemas.nameServicesSchema,
  featuresSchemas.rollupSchema,
  featuresSchemas.tacSchema,
  featuresSchemas.tokenActionButtonSchema,
  featuresSchemas.userOpsSchema,
  featuresSchemas.zetaChainSchema,
  servicesSchema,
]);
>>>>>>> v2.13.0

export default schema;
