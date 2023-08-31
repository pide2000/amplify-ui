import * as React from 'react';
import classNames from 'classnames';

import { isFunction } from '@aws-amplify/ui';

import { Flex } from '../Flex';
import { IconCheck, IconIndeterminate, useIcons } from '../Icon';
import { Input } from '../Input';
import { Text } from '../Text';
import { BaseCheckboxProps, CheckboxProps } from '../types/checkbox';
import { ForwardRefPrimitive, Primitive } from '../types/view';
import { getTestId } from '../utils/getTestId';
import { useStableId } from '../utils/useStableId';
import { ComponentClassNames } from '../shared/constants';
import { splitPrimitiveProps } from '../utils/splitPrimitiveProps';
import { classNameModifierByFlag } from '../shared/utils';
import { View } from '../View';
import { useFieldset } from '../Fieldset/useFieldset';

const CheckboxPrimitive: Primitive<CheckboxProps, 'input'> = (
  {
    checked: controlledChecked,
    className,
    defaultChecked,
    hasError,
    isDisabled,
    isIndeterminate,
    label,
    labelHidden,
    labelPosition,
    onChange: _onChange,
    testId,
    inputStyles,
    ..._rest
  },
  ref
) => {
  const { styleProps, rest } = splitPrimitiveProps(_rest);

  const icons = useIcons('checkbox');
  const { isFieldsetDisabled } = useFieldset();
  const shouldBeDisabled = isFieldsetDisabled ? isFieldsetDisabled : isDisabled;

  const isControlled = controlledChecked !== undefined;
  const [localChecked, setLocalChecked] = React.useState(() =>
    // if controlled, initialize to `controlledChecked` else `defaultChecked`
    isControlled ? controlledChecked : defaultChecked
  );

  const checked = isControlled ? controlledChecked : localChecked;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFunction(_onChange)) {
      _onChange(e);
    }

    // in controlled mode, `controlledChecked` determines checked state
    if (!isControlled) {
      setLocalChecked(e.target.checked);
    }
  };

  const dataId = useStableId();
  React.useEffect(() => {
    const input = document.querySelector(`[data-id="${dataId}"]`);
    if (input && typeof isIndeterminate === 'boolean') {
      // HTMLInputElement does not have an `indeterminate` attribute
      (input as HTMLInputElement & { indeterminate: boolean }).indeterminate =
        isIndeterminate;
    }
  }, [dataId, isIndeterminate]);

  const buttonTestId = getTestId(testId, ComponentClassNames.CheckboxButton);
  const iconTestId = getTestId(testId, ComponentClassNames.CheckboxIcon);
  const labelTestId = getTestId(testId, ComponentClassNames.CheckboxLabel);
  const flexClasses = classNames(
    ComponentClassNames.CheckboxButton,
    classNameModifierByFlag(
      ComponentClassNames.CheckboxButton,
      'disabled',
      shouldBeDisabled
    ),
    classNameModifierByFlag(
      ComponentClassNames.CheckboxButton,
      'error',
      hasError
    )
  );
  const iconClasses = classNames(
    ComponentClassNames.CheckboxIcon,
    classNameModifierByFlag(
      ComponentClassNames.CheckboxIcon,
      'checked',
      checked
    ),
    classNameModifierByFlag(
      ComponentClassNames.CheckboxIcon,
      'disabled',
      shouldBeDisabled
    ),
    classNameModifierByFlag(
      ComponentClassNames.CheckboxIcon,
      'indeterminate',
      isIndeterminate
    )
  );
  const labelClasses = classNames(
    ComponentClassNames.CheckboxLabel,
    { [ComponentClassNames.VisuallyHidden]: labelHidden },
    classNameModifierByFlag(
      ComponentClassNames.CheckboxLabel,
      'disabled',
      shouldBeDisabled
    )
  );
  const iconProps = {
    className: classNames(iconClasses),
    'data-testid': iconTestId,
  };

  const checkedIcon = icons?.checked ? (
    <View as="span" className={classNames(iconClasses)}>
      {icons.checked}
    </View>
  ) : (
    <IconCheck {...iconProps} />
  );
  const indeterminateIcon = icons?.indeterminate ? (
    <View as="span" className={classNames(iconClasses)}>
      {icons.indeterminate}
    </View>
  ) : (
    <IconIndeterminate {...iconProps} />
  );

  return (
    <Flex
      as="label"
      className={classNames(
        ComponentClassNames.Checkbox,
        classNameModifierByFlag(
          ComponentClassNames.Checkbox,
          'disabled',
          shouldBeDisabled
        ),
        className
      )}
      data-label-position={labelPosition}
      testId={testId}
      {...styleProps}
    >
      <Input
        checked={controlledChecked}
        className={classNames(
          ComponentClassNames.CheckboxInput,
          ComponentClassNames.VisuallyHidden
        )}
        data-id={dataId}
        defaultChecked={defaultChecked}
        isDisabled={shouldBeDisabled}
        onChange={onChange}
        ref={ref}
        type="checkbox"
        {...rest}
      />

      <Flex
        aria-hidden="true"
        as="span"
        className={flexClasses}
        testId={buttonTestId}
        {...inputStyles}
      >
        {isIndeterminate ? indeterminateIcon : checkedIcon}
      </Flex>

      {label && (
        <Text as="span" className={labelClasses} testId={labelTestId}>
          {label}
        </Text>
      )}
    </Flex>
  );
};

export const Checkbox: ForwardRefPrimitive<BaseCheckboxProps, 'input'> =
  React.forwardRef(CheckboxPrimitive);

Checkbox.displayName = 'Checkbox';
