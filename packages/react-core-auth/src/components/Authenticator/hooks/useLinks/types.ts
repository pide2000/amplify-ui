import { WithContextProps } from '@aws-amplify/ui-react-core';
import { UseAuthenticator } from '../../AuthenticatorContext';

import { NavigableRoute } from '@aws-amplify/ui';

export interface LinksContextType {
  links?: NavigableRoute[] | undefined | null;
  setNavigableRoute?: UseAuthenticator['setNavigableRoute'];
}

export type withLinkViewProps<P> = WithContextProps<LinksContextType, P>;
