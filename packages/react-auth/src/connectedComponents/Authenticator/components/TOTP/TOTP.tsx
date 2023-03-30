import React from 'react';

import { useComponents } from '@aws-amplify/ui-react-core-auth';
import { useTOTP } from './TOTPProvider';

function View(props: { children?: React.ReactNode }): JSX.Element | null {
  const {
    TOTP: { View: Component },
  } = useComponents();

  const { totpCodeUrl } = useTOTP();

  if (!totpCodeUrl) {
    return null;
  }

  return <Component {...props} />;
}

function Button({
  children,
  onClick,
  ...props
}: {
  children?: React.ReactNode;
  onClick?: React.ReactNode;
}): JSX.Element | null {
  const {
    TOTP: { Button: Component },
  } = useComponents();
  const { copyButtonText, handleClick } = useTOTP();

  return (
    <Component {...props} onClick={onClick ?? handleClick}>
      {children ?? copyButtonText}
    </Component>
  );
}

function Image({
  src: _src,
  ...props
}: {
  children?: React.ReactNode;
  src?: string;
}): JSX.Element | null {
  const {
    TOTP: { Image: Component },
  } = useComponents();
  const { qrCodeDataUrl } = useTOTP();

  const src = _src ?? qrCodeDataUrl;

  if (!src) {
    return null;
  }

  return <Component {...props} src={src} />;
}

function Loader(props: { children?: React.ReactNode }): JSX.Element | null {
  const {
    TOTP: { Loader: Component },
  } = useComponents();
  const { qrCodeDataUrl, totpCodeUrl } = useTOTP();

  if (!totpCodeUrl || qrCodeDataUrl) {
    return null;
  }

  return <Component {...props} />;
}

function TOTP(): JSX.Element | null {
  return (
    <View>
      <Loader />
      <Image />
      <Button />
    </View>
  );
}

export default Object.assign(TOTP, { Button, Image, Loader, View });
