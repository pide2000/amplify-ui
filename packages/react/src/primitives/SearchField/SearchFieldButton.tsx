import * as React from 'react';

import { ComponentClassNames, ComponentText } from '../shared/constants';
import { FieldGroupIconButton } from '../FieldGroupIcon';
import { IconSearch, useIcons } from '../Icon';
import {
  ForwardRefPrimitive,
  Primitive,
  BaseSearchFieldButtonProps,
  SearchFieldButtonProps,
} from '../types';

const ariaLabelText = ComponentText.SearchField.searchButtonLabel;

const SearchFieldButtonPrimitive: Primitive<SearchFieldButtonProps, 'button'> =
  ({ size, ...props }, ref) => {
    const icons = useIcons('searchField');
    return (
      <FieldGroupIconButton
        ariaLabel={ariaLabelText}
        className={ComponentClassNames.SearchFieldSearch}
        size={size}
        ref={ref}
        type="submit"
        {...props}
      >
        {icons?.search ?? <IconSearch />}
      </FieldGroupIconButton>
    );
  };

export const SearchFieldButton: ForwardRefPrimitive<
  BaseSearchFieldButtonProps,
  'button'
> = React.forwardRef(SearchFieldButtonPrimitive);

SearchFieldButton.displayName = 'SearchFieldButton';
