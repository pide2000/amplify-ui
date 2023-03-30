import React from 'react';

import { Prettify } from '@aws-amplify/ui';
import { AnyComponent } from '@aws-amplify/ui-react-core';

import FormProvider from './FormProvider';
import { FormHandle, FormProps } from './types';

// C always wins
type MergeProps<C, P> = Prettify<C & Omit<P, keyof C>>;

export default function withForm<
  C extends AnyComponent,
  P extends React.ComponentPropsWithRef<C>,
  Props extends MergeProps<FormProps, P>
>(
  View: C
): React.ForwardRefExoticComponent<
  React.PropsWithoutRef<Props> & React.RefAttributes<FormHandle>
> {
  return React.forwardRef<FormHandle, Props>(function Form(
    { defaultValues, onReset, onSubmit, validationMode, ...rest },
    ref
  ) {
    return (
      <FormProvider
        defaultValues={defaultValues}
        onReset={onReset}
        onSubmit={onSubmit}
        validationMode={validationMode}
        ref={ref}
      >
        <View {...(rest as P)} />
      </FormProvider>
    );
  });
}

// export const Start = React.forwardRef<HTMLFormElement, { party?: string }>(
//   ({ party }, ref) => <form placeholder={party} ref={ref} />
// );

// Start.displayName = 'Start';

// const Whatever = withIdk(Start);

// type TellMe = React.ComponentPropsWithRef<typeof Whatever>['ref'];

// const Silly = () => {
//   const reffy = React.useRef<FormHandle>(null);

//   return <Whatever ref={reffy} party="haha" onReset={() => null} />;
// };

// NOTE: MOST LIKELY TO BE DELETED
// export default function withForm<
//   Comp extends React.JSXElementConstructor<any>,
//   CompProps extends GetProps<Comp>,
//   FormViewProps extends MergeProps<FormProps, CompProps>
// >(
//   Component: Comp
// ): React.ForwardRefExoticComponent<
//   React.PropsWithoutRef<FormViewProps> & React.RefAttributes<FormHandle>
// > {
//   // const FormView = React.forwardRef<FormHandle & React.ComponentRef<Comp>, FormViewProps>(
//   const FormView = React.forwardRef<FormHandle, FormViewProps>(
//     // @todo: potentially remove ref?
//     ({ defaultValues, onSubmit, onReset, validationMode, ...props }, ref) => {
//       return (
//         // the onSubmit prop here is not being passed down at all, should remove
//         <FormProvider
//           defaultValues={defaultValues}
//           onReset={onReset}
//           onSubmit={onSubmit}
//           ref={ref}
//           validationMode={validationMode}
//         >
//           {/* passng pnSubmit here will be problematic for RN */}
//           <Component {...(props as any)} />
//         </FormProvider>
//       );
//     }
//   );

//   FormView.displayName = 'FormView';

//   return FormView;
// }

// export default function withForm<
//   Comp extends ViewComponent<{
//     children?: React.ReactNode;
//     onSubmit?: (...args: any[]) => void;
//   }>,
//   CompProps extends React.ComponentProps<Comp>,
//   FormViewProps extends WithFormProps<CompProps> & {
//     View?: ViewComponent;
//   }
// >(Component: Comp): WithForm<FormViewProps> {
//   const FormView = React.forwardRef<FormHandle, FormViewProps>(
//     // @todo: potentially remove ref?
//     ({ onSubmit, View: OverrideView, ...props }, ref) => {
//       const View = isFunction(OverrideView) ? OverrideView : Component;

//       return (
//         // the onSubmit prop here is not being passed down at all, should remove
//         <Form onSubmit={onSubmit} ref={ref}>
//           {/* passng pnSubmit here will be problematic for RN */}
//           <View {...props} />
//         </Form>
//       );
//     }
//   );

//   FormView.displayName = 'FormView';

//   return FormView;
// }
