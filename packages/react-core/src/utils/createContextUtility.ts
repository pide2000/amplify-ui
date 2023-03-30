import { createContext, useContext } from 'react';

type CreateContextUtilityParams<Type> = {
  initialValue: Type;
  errorMessage?: string;
};

/**
 * Utility function for creating a React context and associated hook
 *
 * @param defaultValue default context value
 * @returns React context and hook
 */
export default function createContextUtility<
  Type,
  OverrideType extends Type = Type
>({
  errorMessage,
  initialValue,
}: CreateContextUtilityParams<Type>): [
  React.Context<Type>,
  () => OverrideType
] {
  const Context = createContext<Type>(initialValue);
  return [
    Context,
    () => {
      const context = useContext(Context);

      if (errorMessage && !context) {
        throw new Error(errorMessage);
      }

      // @todo make this configurable
      return context as OverrideType;
    },
  ];
}
