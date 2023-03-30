import React from 'react';

import { getTotpCodeURL, isString } from '@aws-amplify/ui';
import { createContextUtility, useTimeout } from '@aws-amplify/ui-react-core';
import {
  useAuthenticator,
  useDisplayText,
} from '@aws-amplify/ui-react-core-auth';
import { useQRCodeDataUrl } from '../../../../hooks';

export interface TOTPProviderProps {
  children?: React.ReactNode;
  totpIssuer?: string;
  totpUsername?: string;
}

interface TOTPContextType {
  copyButtonText: string | undefined;
  handleClick: () => void;
  qrCodeDataUrl: string | undefined;
  totpCodeUrl: string | undefined;
  totpSecretCode: string | undefined;
}

const DEFAULT_COPY_DELAY = 2000;
const DEFAULT_TOTP_ISSUER = 'AWSCognito';

function useCopy({
  delay = DEFAULT_COPY_DELAY,
  target,
}: {
  delay?: number;
  target?: string;
}): {
  hasCopied: boolean;
  handleCopy: () => void;
} {
  const [hasCopied, setHasCopied] = React.useState(false);

  // assign `undefined` as the value of `callback` to prevent `useTimeout`
  // from running callback
  useTimeout({
    callback: hasCopied ? () => setHasCopied(false) : undefined,
    delay,
  });

  const handleCopy = React.useCallback(() => {
    if (isString(target)) {
      navigator.clipboard.writeText(target);
      setHasCopied(true);
    }
  }, [target]);

  return { handleCopy, hasCopied };
}

const [TOTPContext, useTOTP] = createContextUtility<
  TOTPContextType | null,
  TOTPContextType
>({
  errorMessage: 'Must be inside `TOTPProvider`',
  initialValue: null,
});

export { useTOTP };

export default function TOTPProvider({
  children,
  totpIssuer = DEFAULT_TOTP_ISSUER,
  totpUsername: _totpUserName,
}: TOTPProviderProps): JSX.Element {
  const { totpSecretCode, username } = useAuthenticator(
    ({ totpSecretCode, username }) => [totpSecretCode, username]
  );
  const { getCopyButtonText } = useDisplayText();

  const { handleCopy, hasCopied } = useCopy({ target: totpSecretCode });

  const totpUsername = _totpUserName ?? username;

  const copyButtonText = getCopyButtonText(hasCopied);

  // prevent QR code url generation if `false`
  const hasRequiredInputParams = totpIssuer && totpSecretCode && totpUsername;
  const totpCodeUrl = hasRequiredInputParams
    ? getTotpCodeURL(totpIssuer, totpUsername, totpSecretCode)
    : undefined;

  const { dataUrl } = useQRCodeDataUrl({ input: totpCodeUrl });

  const value = React.useMemo(
    () => ({
      handleClick: handleCopy,
      copyButtonText,
      totpCodeUrl,
      totpSecretCode,
      qrCodeDataUrl: dataUrl,
    }),
    [copyButtonText, dataUrl, handleCopy, totpCodeUrl, totpSecretCode]
  );

  return <TOTPContext.Provider value={value}>{children}</TOTPContext.Provider>;
}
