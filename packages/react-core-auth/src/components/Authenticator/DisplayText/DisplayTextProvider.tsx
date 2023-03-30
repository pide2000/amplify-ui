import React from 'react';

import { DEFAULT_AUTHENTICATOR_DISPLAY_TEXT } from './displayText';
import { DisplayTextContext } from './DisplayTextContext';
import { DisplayTextProviderProps } from './types';

const DisplayTextProvider = ({
  children,
  displayText,
}: DisplayTextProviderProps): JSX.Element => {
  const value = React.useMemo(
    () => ({ ...DEFAULT_AUTHENTICATOR_DISPLAY_TEXT, ...displayText }),
    [displayText]
  );

  return (
    <DisplayTextContext.Provider value={value}>
      {children}
    </DisplayTextContext.Provider>
  );
};

export default DisplayTextProvider;
