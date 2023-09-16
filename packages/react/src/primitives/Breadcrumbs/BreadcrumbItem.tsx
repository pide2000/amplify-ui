import * as React from 'react';
import classNames from 'classnames';

import { ComponentClassName } from '@aws-amplify/ui';

import {
  BaseBreadcrumbItemProps,
  BreadcrumbsItemProps,
  ForwardRefPrimitive,
  Primitive,
} from '../types';
import { View } from '../View';

const BreadcrumbItemPrimitive: Primitive<BreadcrumbsItemProps, 'li'> = (
  { className, children, as = 'li', ...rest },
  ref
) => {
  const componentClasses = classNames(
    ComponentClassName.BreadcrumbsItem,
    className
  );

  return (
    <View {...rest} as={as} className={componentClasses} ref={ref}>
      {children}
    </View>
  );
};

/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/breadcrumbs)
 */
export const BreadcrumbItem: ForwardRefPrimitive<
  BaseBreadcrumbItemProps,
  'span'
> = React.forwardRef(BreadcrumbItemPrimitive);

BreadcrumbItem.displayName = 'Breadcrumbs.Item';
