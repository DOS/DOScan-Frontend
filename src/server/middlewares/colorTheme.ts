// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextRequest, NextResponse } from 'next/server';

<<<<<<< HEAD
import { getDefaultColorTheme, isColorThemeAvailable } from 'src/shell/top-bar/settings/color-theme/utils';
=======
import { isConcreteColorTheme } from 'src/shell/top-bar/settings/fields/color-theme/config';
import { getDefaultColorTheme, isColorThemeAvailable } from 'src/shell/top-bar/settings/fields/color-theme/utils';
>>>>>>> v2.13.0

import appConfig from 'src/config';
import * as cookiesLib from 'src/shared/storage/cookies';

import type { ColorMode } from 'src/toolkit/chakra/color-mode';

export default function colorThemeMiddleware(req: NextRequest, res: NextResponse) {
  const { themes, 'default': defaultTheme } = appConfig.shell.topBar.colorTheme;
  const colorModeCookie = req.cookies.get(cookiesLib.NAMES.COLOR_MODE);
  const colorThemeCookie = req.cookies.get(cookiesLib.NAMES.COLOR_THEME);

  const nextTheme = (() => {
    if (colorThemeCookie && !isColorThemeAvailable(colorThemeCookie.value)) {
      // a color mode the user already has outranks the configured default,
      // otherwise narrowing the theme list flips returning users to the other mode
      if (colorModeCookie) {
        const themeId = getDefaultColorTheme(colorModeCookie.value as ColorMode);
        return themes.find((theme) => theme.id === themeId);
      }

      return defaultTheme ?? themes[0];
    }

    return colorModeCookie ? undefined : defaultTheme;
  })();

  if (!nextTheme) {
    return;
  }

<<<<<<< HEAD
  res.cookies.set(cookiesLib.NAMES.COLOR_MODE, nextTheme.colorMode, cookiesLib.getDefaultAttributes());
=======
  // the server cannot see the OS color scheme, so a system theme leaves the color mode to the client
  if (isConcreteColorTheme(nextTheme)) {
    res.cookies.set(cookiesLib.NAMES.COLOR_MODE, nextTheme.colorMode, cookiesLib.getDefaultAttributes());
  }
>>>>>>> v2.13.0
  res.cookies.set(cookiesLib.NAMES.COLOR_THEME, nextTheme.id, cookiesLib.getDefaultAttributes());
}
