<<<<<<< HEAD
import { replaceQuotes } from 'src/config/utils/envs';
import { TokenActionButtonColorState, TokenActionButtonConfig } from 'src/features/token-action-button/types/config';
import * as yup from 'yup';

import { getYupValidationErrorMessage, urlTest } from '../../utils';

const colorStateSchema: yup.ObjectSchema<TokenActionButtonColorState> = yup.object({
    bg: yup.array().max(2).of(yup.string()),
    text: yup.array().max(2).of(yup.string()),
});

const buttonSchema: yup.ObjectSchema<TokenActionButtonConfig> = yup
  .object()
  .transform(replaceQuotes)
  .json()
  .shape({
    text: yup.string().required(),
    url: yup.string().test(urlTest).required(),
    logo: yup.array().max(2).of(yup.string().test(urlTest)),
    colors: yup.object({
      _default: colorStateSchema,
    }),
  });

export const tokenActionButtonSchema = yup
  .object()
  .shape({
    NEXT_PUBLIC_TOKEN_ACTION_BUTTON_CONFIG: yup
      .mixed()
      .test(
        'shape',
        (ctx) => {
          try {
            buttonSchema.validateSync(ctx.originalValue);
            throw new Error('Unknown validation error');
          } catch (error: unknown) {
            const message = getYupValidationErrorMessage(error);
            return 'Invalid schema were provided for NEXT_PUBLIC_TOKEN_ACTION_BUTTON_CONFIG' + (message ? `: ${ message }` : '');
          }
        },
        (data) => {
          const isUndefined = data === undefined;
          return isUndefined || buttonSchema.isValidSync(data);
        }),
  });
=======
// SPDX-License-Identifier: LicenseRef-Blockscout

import * as v from 'valibot';

import type { TokenActionButtonConfig } from 'src/features/token-action-button/types/config';

import { envJson } from '../../utils';

const colorPairSchema = v.optional(v.pipe(v.array(v.string()), v.maxLength(2)));

const tokenActionButtonConfigSchema: v.GenericSchema<TokenActionButtonConfig> = v.object({
  text: v.pipe(v.string(), v.nonEmpty()),
  url: v.pipe(v.string(), v.url()),
  logo: v.optional(v.pipe(v.array(v.pipe(v.string(), v.url())), v.maxLength(2))),
  colors: v.optional(v.object({
    _default: v.optional(v.object({
      bg: colorPairSchema,
      text: colorPairSchema,
    })),
  })),
});

export const tokenActionButtonSchema = v.object({
  NEXT_PUBLIC_TOKEN_ACTION_BUTTON_CONFIG: v.optional(envJson(tokenActionButtonConfigSchema)),
});
>>>>>>> v2.13.0
