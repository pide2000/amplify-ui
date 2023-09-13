import { StyleSheet } from 'react-native';

import { getLogger } from '@aws-amplify/ui';

import { StrictTheme } from '../../theme';
import { IconProps, IconStyles } from './types';
import { iconSizes } from './constants';

const logger = getLogger('Icon');

const getIconSize = (size: IconProps['size']): number => {
  if (!size) {
    return iconSizes.medium;
  }

  if (typeof size === 'number') {
    return size;
  }

  if (!iconSizes[size]) {
    logger.warn(
      `"${size}" is not a valid icon size. Available values are: ${Object.keys(
        iconSizes
      )}`
    );
    return iconSizes.medium;
  }
  return iconSizes[size];
};

export const getThemedStyles = (
  theme: StrictTheme,
  color?: IconProps['color'],
  size?: IconProps['size']
): Required<IconStyles> => {
  const { components } = theme;
  const iconSize = getIconSize(size);

  return StyleSheet.create({
    icon: {
      height: iconSize,
      resizeMode: 'contain',
      tintColor: color,
      width: iconSize,
      ...components?.icon,
    },
  });
};
