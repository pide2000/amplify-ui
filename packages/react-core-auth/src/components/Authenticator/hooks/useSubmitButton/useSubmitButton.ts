import { isComponentRouteKey } from '../../AuthenticatorContext';

import { useComponentRoute } from '../../context/ComponentRoute';
import { useSubmit, UseSubmit } from '../useSubmit';
import { useDisplayText, DefaultDisplayText } from '../../DisplayText';

export interface UseSubmitButton extends UseSubmit {
  submitButtonText: ReturnType<DefaultDisplayText['getSubmitButtonText']>;
}

export default function useSubmitButton(): UseSubmitButton {
  const { route } = useComponentRoute();
  const { getSubmitButtonText } = useDisplayText();
  const { isDisabled, onSubmit } = useSubmit();

  const submitButtonText = getSubmitButtonText(
    isComponentRouteKey(route) ? route : undefined
  );

  return { isDisabled, onSubmit, submitButtonText };
}
