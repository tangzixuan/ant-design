import { generate, presetPalettes, presetPrimaryColors } from '@ant-design/colors';

import type { MapToken, PresetColorType, SeedToken } from '../../interface';
import { defaultPresetColors } from '../seed';
import genColorMapToken from '../shared/genColorMapToken';
import genCommonMapToken from '../shared/genCommonMapToken';
import genControlHeight from '../shared/genControlHeight';
import genFontMapToken from '../shared/genFontMapToken';
import genSizeMapToken from '../shared/genSizeMapToken';
import { generateColorPalettes, generateNeutralColorPalettes } from './colors';

export default function derivative(token: SeedToken): MapToken {
  // pink is deprecated name of magenta, keep this for backwards compatibility
  presetPrimaryColors.pink = presetPrimaryColors.magenta;
  presetPalettes.pink = presetPalettes.magenta;
  const colorPalettes = Object.keys(defaultPresetColors)
    .map((colorKey) => {
      const colors =
        token[colorKey as keyof PresetColorType] === presetPrimaryColors[colorKey]
          ? presetPalettes[colorKey]
          : generate(token[colorKey as keyof PresetColorType]);
      return Array.from({ length: 10 }, () => 1).reduce<Record<string, string>>((prev, _, i) => {
        prev[`${colorKey}-${i + 1}`] = colors[i];
        prev[`${colorKey}${i + 1}`] = colors[i];
        return prev;
      }, {});
    })
    .reduce<MapToken>((prev, cur) => {
      prev = { ...prev, ...cur };
      return prev;
    }, {} as MapToken);

  return {
    ...token,
    ...colorPalettes,
    // Colors
    ...genColorMapToken(token, {
      generateColorPalettes,
      generateNeutralColorPalettes,
    }),
    // Font
    ...genFontMapToken(token.fontSize),
    // Size
    ...genSizeMapToken(token),
    // Height
    ...genControlHeight(token),
    // Others
    ...genCommonMapToken(token),
  };
}
