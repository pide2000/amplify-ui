import {
  useComponentRoute,
  useDisplayText,
} from '@aws-amplify/ui-react-core-auth';

export default function useHeading(): { headingText: string | undefined } {
  const { route } = useComponentRoute();
  const { getHeadingText } = useDisplayText();

  return { headingText: getHeadingText(route) };
}
