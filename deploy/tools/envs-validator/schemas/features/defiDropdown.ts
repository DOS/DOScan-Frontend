<<<<<<< HEAD
import * as yup from 'yup';
import type { DeFiDropdownButtonText, DeFiDropdownItem } from 'src/features/defi-dropdown/types/client';
import type { IconName } from 'public/icons/name';
import { urlTest } from '../../utils';
import { replaceQuotes } from 'src/config/utils/envs';

const MIN_ITEMS_FOR_DROPDOWN = 2;

const deFiDropdownItemSchema: yup.ObjectSchema<DeFiDropdownItem> = yup
  .object({
    text: yup.string().required(),
    icon: yup.string<IconName>(),
    dappId: yup.string(),
    isEssentialDapp: yup.boolean(),
    url: yup.string().test(urlTest),
  })
  .test('oneOfRequired', 'NEXT_PUBLIC_DEFI_DROPDOWN_ITEMS: Either dappId or url is required', function(value) {
    return Boolean(value.dappId) || Boolean(value.url);
  }) as yup.ObjectSchema<DeFiDropdownItem>;

const deFiDropdownButtonTextSchema = yup
  .object<DeFiDropdownButtonText>()
  .transform(replaceQuotes)
  .json()
  .shape({
    desktop: yup.string().required(),
    mobile: yup.string(),
  });

export const defiDropdownSchema = yup.object({
    NEXT_PUBLIC_DEFI_DROPDOWN_ITEMS: yup
    .array()
    .transform(replaceQuotes)
    .json()
    .of(deFiDropdownItemSchema),
  NEXT_PUBLIC_DEFI_DROPDOWN_BUTTON_TEXT: yup
    .mixed()
    .when('NEXT_PUBLIC_DEFI_DROPDOWN_ITEMS', {
      is: (items: unknown) => Array.isArray(items) && items.length >= MIN_ITEMS_FOR_DROPDOWN,
      then: (schema) => schema.test(
        'shape',
        'Invalid schema were provided for NEXT_PUBLIC_DEFI_DROPDOWN_BUTTON_TEXT, it should have a required desktop and an optional mobile field',
        (data) => data === undefined || deFiDropdownButtonTextSchema.isValidSync(data),
      ),
      otherwise: (schema) => schema.test(
        'not-exist',
        `NEXT_PUBLIC_DEFI_DROPDOWN_BUTTON_TEXT can only be used when NEXT_PUBLIC_DEFI_DROPDOWN_ITEMS contains at least ${ MIN_ITEMS_FOR_DROPDOWN } items`,
        value => value === undefined,
      ),
    }),
=======
// SPDX-License-Identifier: LicenseRef-Blockscout

import * as v from 'valibot';

import { envJson, requires } from '../../utils';

const MIN_ITEMS_FOR_DROPDOWN = 2;

const deFiDropdownItemSchema = v.pipe(
  v.object({
    text: v.pipe(v.string(), v.nonEmpty()),
    icon: v.optional(v.string()),
    dappId: v.optional(v.string()),
    isEssentialDapp: v.optional(v.boolean()),
    url: v.optional(v.pipe(v.string(), v.url())),
  }),
  v.check((item) => Boolean(item.dappId) || Boolean(item.url), 'Either dappId or url is required'),
);

const deFiDropdownButtonTextSchema = v.object({
  desktop: v.pipe(v.string(), v.nonEmpty()),
  mobile: v.optional(v.string()),
>>>>>>> v2.13.0
});

export const defiDropdownSchema = v.pipe(
  v.object({
    NEXT_PUBLIC_DEFI_DROPDOWN_ITEMS: v.optional(envJson(v.array(deFiDropdownItemSchema))),
    NEXT_PUBLIC_DEFI_DROPDOWN_BUTTON_TEXT: v.optional(envJson(deFiDropdownButtonTextSchema)),
  }),
  requires('NEXT_PUBLIC_DEFI_DROPDOWN_BUTTON_TEXT', 'NEXT_PUBLIC_DEFI_DROPDOWN_ITEMS', {
    when: (items) => Array.isArray(items) && items.length >= MIN_ITEMS_FOR_DROPDOWN,
    message: `NEXT_PUBLIC_DEFI_DROPDOWN_BUTTON_TEXT can only be used when NEXT_PUBLIC_DEFI_DROPDOWN_ITEMS contains at least ${ MIN_ITEMS_FOR_DROPDOWN } items`,
  }),
);
