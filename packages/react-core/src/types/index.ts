import { Prettify } from '@aws-amplify/ui';
import React from 'react';

export type WithContextProps<C extends React.ContextType<any>, P> = Prettify<
  C & Omit<P, keyof C>
>;

export type AnyComponent = React.ComponentType<any>;

export type SubComponent<C extends AnyComponent> = React.ComponentType<
  React.ComponentProps<C>
>;

export type ViewComponent<P = {}> = React.ComponentType<P>;

export type ViewSubComponents<
  Names extends string,
  Comps extends Record<Names, AnyComponent> = Record<Names, AnyComponent>
> = Record<Names, SubComponent<Comps[Names]>>;

export type ResolveDefaultOrSlotComponentsPropsType<
  ComponentName extends 'Button' | 'Form' | 'View',
  DefaultProps extends React.ComponentProps<any>,
  OverrideComponent extends React.ComponentType<DefaultProps> | undefined,
  Props = OverrideComponent extends React.ComponentType<DefaultProps>
    ? React.ComponentProps<OverrideComponent>
    : DefaultProps
> = Props & { [name in ComponentName]?: OverrideComponent };
