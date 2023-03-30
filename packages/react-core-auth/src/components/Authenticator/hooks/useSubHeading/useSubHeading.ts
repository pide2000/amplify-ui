import { useDisplayText } from '../../DisplayText';

import { useChallengeName } from '../useChallengeName';
import { useRoute } from '../useRoute';

export default function useSubHeading(): {
  subHeadingText: string | undefined;
} {
  const { route } = useRoute();
  const { challengeName } = useChallengeName();
  const { getChallengeText } = useDisplayText();

  return {
    subHeadingText:
      route === 'confirmSignIn' ? getChallengeText(challengeName) : undefined,
  };
}
