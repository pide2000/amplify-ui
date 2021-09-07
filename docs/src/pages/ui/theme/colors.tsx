import { Flex, theme, View } from '@aws-amplify/ui-react';
import React from 'react';

const baseColors = [
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'blue',
  'purple',
  'pink',
];

export const Colors = () => {
  return (
    <>
      {baseColors.map((baseColor) => (
        <Flex direction="row" style={{ marginBottom: theme.space.large }}>
          {Object.values(theme.colors[baseColor]).map(({ name, value }) => (
            <View
              key={name}
              width="5rem"
              height="5rem"
              backgroundColor={value}
            />
          ))}
        </Flex>
      ))}
    </>
  );
};
