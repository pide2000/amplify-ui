// import React from 'react';

// import { isFunction } from '@aws-amplify/ui';
// import { AnyComponent, ViewComponent } from '@aws-amplify/ui-react-core';

// import Form from './Form';
// import { FormHandle, WithForm, WithFormProps } from './types';

// // NOTE: MOST LIKELY TO BE DELETED
// export default function withForm<
//   Comp extends AnyComponent,
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
//           <View {...props} onSubmit={onSubmit} />
//         </Form>
//       );
//     }
//   );

//   FormView.displayName = 'FormView';

//   return FormView;
// }
// import React from 'react';
