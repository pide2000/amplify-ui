import React from 'react';

import {
  Button as ButtonBase,
  ButtonProps,
  Flex,
  FlexProps,
  Image as ImageBase,
  ImageProps,
  Loader as LoaderBase,
  LoaderProps,
} from '@aws-amplify/ui-react';

function Button(props: ButtonProps): JSX.Element {
  return <ButtonBase {...props} />;
}

function View({
  alignItems = 'center',
  direction = 'column',
  ...props
}: FlexProps): JSX.Element {
  return <Flex alignItems={alignItems} direction={direction} {...props} />;
}

function Image({
  alt = 'qr code',
  height = '228',
  src,
  width = '228',
  ...props
}: Partial<ImageProps>): JSX.Element | null {
  if (!src) {
    return null;
  }
  return (
    <ImageBase
      {...props}
      data-amplify-qrcode
      alt={alt}
      width={width}
      height={height}
      src={src}
    />
  );
}

function Loader({ size = 'large', ...props }: LoaderProps) {
  return <LoaderBase {...props} size={size} />;
}

const TOTP = () => null;
export default Object.assign(TOTP, { Button, Image, Loader, View });
