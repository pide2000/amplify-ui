import { useState, useEffect, useCallback } from 'react';
import * as Analytics from '@aws-amplify/analytics';
import { syncMessages } from 'aws-amplify/in-app-messaging';
// import {
//   // Message,
//   MessageAction,
//   MessageButton,
//   MessageLayout,
// } from '@aws-amplify/internal/ui-react-core-notifications';
import {
  Message,
  MessageAction,
  MessageButton,
  MessageLayout,
} from '@aws-amplify/ui-react-core-notifications/dist/types/InAppMessaging';
import { useInAppMessaging } from '@aws-amplify/ui-react-notifications';

type ImageOrientation = 'landscape' | 'portrait';

export interface GetDemoMessageParams {
  hasHeader: boolean;
  hasImage: boolean;
  hasMessage: boolean;
  hasPrimaryButton: boolean;
  hasSecondaryButton: boolean;
  imageOrientation: ImageOrientation;
  primaryButtonAction: MessageAction;
  secondaryButtonAction: MessageAction;
  layout: MessageLayout;
  useAnalyticEvents: boolean;
}

export const ACTIONS: MessageAction[] = ['CLOSE', 'DEEP_LINK', 'LINK'];
export const LAYOUTS: MessageLayout[] = [
  'BOTTOM_BANNER',
  'CAROUSEL',
  'FULL_SCREEN',
  'MIDDLE_BANNER',
  'MODAL',
  'TOP_BANNER',
];
export const ORIENTATIONS: ImageOrientation[] = ['landscape', 'portrait'];

const PORTRAIT_IMAGE =
  'https://images.unsplash.com/photo-1535392432937-a27c36ec07b5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80';
const LANDSCAPE_IMAGE =
  'https://images.unsplash.com/photo-1504858700536-882c978a3464?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80';
const URL = 'https://ui.docs.amplify.aws/';

const getButton = (
  action: MessageAction,
  type: 'primary' | 'secondary'
): MessageButton => ({
  title: `${type} - ${action.toLowerCase()} action`,
  action,
  url: action === 'LINK' || action === 'DEEP_LINK' ? URL : undefined,
});

function getDemoMessage({
  hasHeader,
  hasImage,
  hasMessage,
  hasPrimaryButton,
  hasSecondaryButton,
  imageOrientation,
  layout,
  primaryButtonAction,
  secondaryButtonAction,
}: GetDemoMessageParams): Message {
  return {
    layout,
    id: layout,
    content: [
      {
        header: hasHeader ? { content: 'Example Header' } : undefined,
        body: hasMessage ? { content: 'Example Body' } : undefined,
        image: hasImage
          ? {
              src:
                imageOrientation === 'portrait'
                  ? PORTRAIT_IMAGE
                  : LANDSCAPE_IMAGE,
            }
          : undefined,
        primaryButton: hasPrimaryButton
          ? getButton(primaryButtonAction, 'primary')
          : undefined,
        secondaryButton:
          hasPrimaryButton && hasSecondaryButton
            ? getButton(secondaryButtonAction, 'secondary')
            : undefined,
      },
    ],
  };
}

export function useInAppDemo() {
  const { displayMessage } = useInAppMessaging();

  const [layout, setLayout] =
    useState<GetDemoMessageParams['layout']>('TOP_BANNER');

  const [hasHeader, setHasHeader] =
    useState<GetDemoMessageParams['hasHeader']>(true);
  const [hasMessage, setHasMessage] =
    useState<GetDemoMessageParams['hasMessage']>(true);

  const [hasImage, setHasImage] =
    useState<GetDemoMessageParams['hasImage']>(true);
  const [imageOrientation, setImageOrientation] =
    useState<GetDemoMessageParams['imageOrientation']>('landscape');

  const [hasPrimaryButton, setHasPrimaryButton] =
    useState<GetDemoMessageParams['hasPrimaryButton']>(true);
  const [primaryButtonAction, setPrimaryButtonAction] =
    useState<GetDemoMessageParams['primaryButtonAction']>('LINK');

  const [hasSecondaryButton, setHasSecondaryButton] =
    useState<GetDemoMessageParams['hasSecondaryButton']>(true);
  const [secondaryButtonAction, setSecondaryButtonAction] =
    useState<GetDemoMessageParams['secondaryButtonAction']>('CLOSE');

  const [useAnalyticEvents, setUseAnalyticEvents] =
    useState<GetDemoMessageParams['useAnalyticEvents']>(false);
  const [shouldSyncMessages, setShouldSyncMessages] = useState<boolean>(false);

  const syncMessagesCallback = useCallback(async () => {
    await syncMessages();
  }, []);

  useEffect(() => {
    if (shouldSyncMessages) {
      syncMessagesCallback();
    }
  }, [shouldSyncMessages]);

  const handleAction = (
    type:
      | 'setHasHeader'
      | 'setHasMessage'
      | 'setHasImage'
      | 'setImageOrientation'
      | 'setLayout'
      | 'setHasPrimaryButton'
      | 'setPrimaryButtonAction'
      | 'setHasSecondaryButton'
      | 'setSecondaryButtonAction'
      | 'setUseAnalyticEvents'
  ) =>
    function handler(value) {
      switch (type) {
        case 'setLayout':
          setLayout(value);
          break;
        case 'setHasHeader':
          setHasHeader((prev) => !prev);
          break;
        case 'setHasMessage':
          setHasMessage((prev) => !prev);
          break;
        case 'setHasImage':
          setHasImage((prev) => !prev);
          break;
        case 'setImageOrientation':
          setImageOrientation(value);
          break;
        case 'setHasPrimaryButton':
          setHasPrimaryButton((prev) => !prev);
          break;
        case 'setPrimaryButtonAction':
          setPrimaryButtonAction(value);
          break;
        case 'setHasSecondaryButton':
          setHasSecondaryButton((prev) => !prev);
          break;
        case 'setSecondaryButtonAction':
          setSecondaryButtonAction(value);
          break;
        case 'setUseAnalyticEvents':
          setUseAnalyticEvents(value);
          if (!shouldSyncMessages) setShouldSyncMessages(true);
          break;
        default:
          return null;
      }
    };

  const demoMessage = getDemoMessage({
    hasHeader,
    hasImage,
    hasMessage,
    hasPrimaryButton,
    hasSecondaryButton: !hasPrimaryButton ? false : hasSecondaryButton,
    imageOrientation,
    layout,
    primaryButtonAction,
    secondaryButtonAction,
    useAnalyticEvents,
  });

  return {
    displayDemoMessage: () => {
      if (useAnalyticEvents) {
        Analytics.record({ name: layout });
        return;
      }
      displayMessage(demoMessage);
    },
    handleAction,
    hasHeader,
    hasMessage,
    hasImage,
    hasPrimaryButton,
    hasSecondaryButton,
    imageOrientation,
    layout,
    primaryButtonAction,
    secondaryButtonAction,
    useAnalyticEvents,
  };
}
