import { countryDialCodes, LoginMechanism } from '@aws-amplify/ui';

import { CommonFieldOptions } from './types';

// @todo can "default fields" be shared across platforms
const USERNAME_BASE = {
  isRequired: true,
  name: 'username',
  key: 'username',
};

export const USERNAME_EMAIL: CommonFieldOptions = {
  ...USERNAME_BASE,
  label: 'Email',
  placeholder: 'Enter your Email',
  type: 'email',
  autoComplete: 'username',
  isRequired: true,
  validate: (value?: string) => (!value ? 'Username is required' : undefined),
};

export const USERNAME_TEXT: CommonFieldOptions = {
  ...USERNAME_BASE,
  label: 'Username',
  placeholder: 'Enter your Username',
  autoComplete: 'username',
  type: 'text',
  validate: (value?: string) => (!value ? 'Username is required' : undefined),
};

export const USERNAME_PHONE: CommonFieldOptions = {
  ...USERNAME_BASE,
  autoComplete: 'tel',
  label: 'Phone Number',
  placeholder: 'Enter your Phone Number',
  type: 'tel',
  validate: {
    required: (value?: string) =>
      !value ? 'Phone Number is required' : undefined,
  },
};

export const PASSWORD: CommonFieldOptions = {
  autoComplete: 'current-password',
  isRequired: true,
  label: 'Password',
  name: 'password',
  key: 'password',
  placeholder: 'Enter your Password',
  type: 'password',
  // @TODO: split fields to remove validation on sign in
  validate: {
    required: (value) => (!value ? 'Password is required' : undefined),
    includesNumber: (value) =>
      /\d+/.test(value) ? undefined : 'Password must contain a number',
    minLength: (value) =>
      value?.length >= 8
        ? undefined
        : 'Password length must exceed 8 characters',
  },
};

export const SIGN_UP_USERNAME: CommonFieldOptions = { ...USERNAME_TEXT };
export const SIGN_UP_EMAIL: CommonFieldOptions = {
  ...USERNAME_EMAIL,
  name: 'email',
};
// export const SIGN_UP_PASSWORD: CommonFieldOptions = { ...PASSWORD };

export const DIAL_CODE: CommonFieldOptions = {
  defaultValue: '+1',
  dialCodeList: countryDialCodes,
  label: 'Dial Code',
  key: 'dial_code',
  name: 'dial_code',
};

export const PRIMARY_ALIAS: Record<LoginMechanism, CommonFieldOptions> = {
  email: USERNAME_EMAIL,
  phone_number: USERNAME_PHONE,
  username: USERNAME_TEXT,
};

export const CONFIRM_PASSWORD: CommonFieldOptions = {
  autoComplete: 'new-password',
  label: 'Confirm Password',
  isRequired: true,
  key: 'confirmPassword',
  name: 'confirmPassword',
  placeholder: 'Please confirm your Password',
  type: 'password',
  validate: {
    confirm: (value, values) => {
      if (value !== values['password']) {
        return 'Passwords do not match';
      }
    },
  },
};

export const CONFIRMATION_CODE: CommonFieldOptions = {
  label: 'Confirmation Code',
  key: 'confirmation_code',
  name: 'confirmation_code',
  placeholder: 'Enter your Confirmation Code',
  type: 'text',
  autoComplete: 'one-time-code',
  isRequired: true,
  validate: {
    required: (value) => (!value ? 'Confirmation Code is required' : undefined),
    isNumbers: (values) =>
      isNaN(Number(values))
        ? 'Confirmation Code can only include numbers'
        : undefined,
  },
};

export const radioOptions: CommonFieldOptions = {
  label: 'Choose a cat',
  key: 'radio',
  name: 'radio',
  options: ['Calico', 'Russian Blue'],
  type: 'radio',
  validate: (value) => {
    return value ? undefined : 'Must select a cat';
  },
};

export const selectOptions: CommonFieldOptions = {
  label: 'Level of Excitement',
  name: 'excitement',
  key: 'excitement',
  options: ['High', 'Very High'],
  placeholder: 'Select a level',
  type: 'select',
};

export const checkboxOptions: CommonFieldOptions = {
  type: 'checkbox',
  label: 'Click to acknowledge',
  name: 'acknowledgement',
  key: 'acknowledgement',
  value: 'true',
  validate: (value) => (value ? undefined : 'Acknowledge me'),
};

// import { countryDialCodes, LoginMechanism } from '@aws-amplify/ui';
// import { FieldOptions } from '../../ui';

// const USERNAME_BASE = {
//   isRequired: true,
//   name: 'username',
// };

// export const USERNAME_EMAIL: FieldOptions = {
//   ...USERNAME_BASE,
//   label: 'Email',
//   placeholder: 'Enter your Email',
//   type: 'email',
//   autoComplete: 'username',
//   isRequired: true,
// };

// export const USERNAME_TEXT: FieldOptions = {
//   ...USERNAME_BASE,
//   // label: (label: string) => srring | string
//   label: 'Username',
//   placeholder: 'Enter your Username',
//   autoComplete: 'username',
//   type: 'text',
//   validate: (value?: string) => (!value ? 'Username is required' : undefined),
// };

// export const USERNAME_PHONE: FieldOptions = {
//   ...USERNAME_BASE,
//   autoComplete: 'tel',
//   defaultDialCode: '+1',
//   dialCodeList: countryDialCodes,
//   isRequired: true,
//   label: 'Phone Number',
//   placeholder: 'Enter your Phone Number',
//   type: 'tel',
//   validate: (value?: string) =>
//     !value ? 'Phone Number is required' : undefined,
// };

// export const PASSWORD: FieldOptions = {
//   autoComplete: 'current-password',
//   isRequired: true,
//   label: 'Password',
//   name: 'password',
//   placeholder: 'Enter your Password',
//   type: 'password',
//   validate: {
//     required: (value) => (!value ? 'Password is required' : undefined),
//     includesNumber: (value) =>
//       /\d+/.test(value) ? undefined : 'Password must contain a number',
//     minLength: (value) =>
//       value?.length >= 8
//         ? undefined
//         : 'Password length must exceed 8 characters',
//   },
// };

// export const PRIMARY_ALIAS: Record<LoginMechanism, FieldOptions> = {
//   email: USERNAME_EMAIL,
//   phone_number: USERNAME_PHONE,
//   username: USERNAME_TEXT,
// };

// export const CONFIRM_PASSWORD: FieldOptions = {
//   autoComplete: 'new-password',
//   label: 'Confirm Password',
//   isRequired: true,
//   name: 'confirmPassword',
//   placeholder: 'Please confirm your Password',
//   type: 'password',
//   validate: {
//     confirm: (value, values) => {
//       if (value !== values['password']) {
//         return 'Passwords do not match';
//       }
//     },
//   },
// };

// export const radioOptions: FieldOptions = {
//   label: 'Choose a cat',
//   name: 'radio',
//   options: ['Calico', 'Russian Blue'],
//   type: 'radio',
//   validate: (value) => {
//     return value ? undefined : 'Must select a cat';
//   },
// };

// export const selectOptions: FieldOptions = {
//   label: 'Level of Excitement',
//   name: 'excitement',
//   options: ['High', 'Very High'],
//   placeholder: 'Select a level',
//   type: 'select',
// };

// export const checkboxOptions: FieldOptions = {
//   type: 'checkbox',
//   label: 'Click to acknowledge',
//   name: 'acknowledgement',
//   value: 'true',
//   validate: (value) => (value ? undefined : 'Acknowledge me'),
// };
