import React from 'react';

import { useAuthenticator } from '../../AuthenticatorContext';

import { FieldValues, OnSubmit, useFormHandleSubmit } from '../../../../Form';

export interface UseSubmit {
  isDisabled: boolean;
  // why is this optional?
  onSubmit?: OnSubmit;
}

const PREFIX = 'prefix:';
const PREFIX_END_INDEX = PREFIX.length;

const isPrefixKey = (value: string): boolean => value.startsWith(PREFIX);

/**
 *
 * @param values
 * @returns
 */
const getPrefixes = (
  values: Record<string, string>
): [Record<string, string>, Record<string, string>] => {
  const baseValues = {} as Record<string, string>;
  return [
    Object.entries(values).reduce((prefixes, [key, value]) => {
      if (isPrefixKey(key)) {
        return { ...prefixes, [key.slice(PREFIX_END_INDEX)]: value };
      }

      baseValues[key] = value;
      return prefixes;
    }, {} as Record<string, string>),
    baseValues,
  ];
};

const applyPrefixes = ([prefixes, baseValues]: [FieldValues, FieldValues]) =>
  Object.entries(baseValues).reduce((prev, [key, value]) => {
    const prefix = prefixes[key];
    return { ...prev, [key]: prefix ? `${prefix}${value}` : value };
  }, {});

const parseValues = (values: FieldValues): FieldValues => {
  const applyPrefixesz = applyPrefixes(getPrefixes(values));
  return applyPrefixesz;
};

export default function useSubmit(): UseSubmit {
  const { isPending, submitForm } = useAuthenticator(
    ({ isPending, submitForm }) => [isPending, submitForm]
  );

  const { handleSubmit, isValid } = useFormHandleSubmit();

  // @todo precedence
  const isDisabled = isPending || !isValid;

  const onSubmit: OnSubmit = React.useCallback(
    async (e) => {
      const handler = handleSubmit((values) => submitForm(parseValues(values)));
      await handler(e);
    },
    [handleSubmit, submitForm]
  );

  return { isDisabled, onSubmit };
}

// export default function useSubmit({
//   onSubmit: _onSubmit,
// }: {
//   onSubmit?: OnSubmit;
// } = {}): UseSubmit {
//   const { isPending, submitForm } = useAuthenticator(
//     ({ isPending, submitForm }) => [isPending, submitForm]
//   );

//   const { handleSubmit, isDisabled: _isDisabled } = useFormHandleSubmit();

//   // @todo precedence
//   const isDisabled = isPending || _isDisabled;

//   const onSubmit: OnSubmit = React.useCallback(
//     async (e) => {
//       // eslint-disable-next-line no-console
//       console.log('Hello??????');

//       const handler = handleSubmit((values) => {
//         // eslint-disable-next-line no-console
//         console.log('Hi????', values);

//         if (typeof _onSubmit === 'function') {
//           // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
//           return _onSubmit(values as any);
//         }

//         return submitForm(parseValues(values));
//       });
//       await handler(e);
//     },
//     [_onSubmit, handleSubmit, submitForm]
//   );

//   return { isDisabled, onSubmit };
// }
