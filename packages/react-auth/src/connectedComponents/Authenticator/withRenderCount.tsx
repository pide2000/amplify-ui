import React from 'react';

import { isString, isTypedFunction, Prettify } from '@aws-amplify/ui';
import { AnyComponent } from '@aws-amplify/ui-react-core';

export type MergeProps<C, P> = Prettify<C & Omit<P, keyof C>>;

interface Options {
  displayName?: string;
  label?: ((count: number) => string) | string | null;
}

export default function withRenderCount<
  C extends AnyComponent,
  Props extends React.ComponentProps<C>,
  ReturnProps extends MergeProps<{ disableCount?: boolean }, Props>
>(Comp: C, options?: Options): React.ComponentType<ReturnProps> {
  const { displayName: _displayName, label } = options ?? {};

  const displayName = isString(_displayName)
    ? _displayName
    : isString(Comp.displayName)
    ? Comp.displayName
    : 'WithRenderCount';

  const stringLabel = isString(label) ? label : `${displayName} Render: `;

  let renderCount = 0;

  const WrappedWithRenderCount = ({ disableCount, ...props }: ReturnProps) => {
    renderCount++;

    if (!disableCount) {
      // eslint-disable-next-line no-console
      console.log(
        isTypedFunction(label)
          ? label(renderCount)
          : `${stringLabel}${renderCount}`
      );

      // eslint-disable-next-line no-console
      // console.count(resolvedLabel);
    }

    // reset count on dismount

    return <Comp {...(props as Props)} />;
  };

  WrappedWithRenderCount.displayName = displayName;
  return WrappedWithRenderCount;
}
