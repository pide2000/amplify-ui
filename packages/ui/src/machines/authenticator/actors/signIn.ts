import * as Auth from '@aws-amplify/auth';
import get from 'lodash/get.js';
import { createMachine, sendUpdate } from 'xstate';

import {
  AuthChallengeName,
  AuthEvent,
  // AmplifyUser,
  SignInContext,
} from '../../../types';
import { runValidators } from '../../../validators';
import {
  clearAttributeToVerify,
  clearChallengeName,
  clearRequiredAttributes,
  clearError,
  clearFormValues,
  clearTouched,
  clearUnverifiedContactMethods,
  clearValidationError,
  handleInput,
  handleSubmit,
  handleBlur,
  parsePhoneNumber,
  setChallengeName,
  setConfirmResetPasswordIntent,
  setConfirmSignUpIntent,
  setCredentials,
  setFieldErrors,
  setRemoteError,
  setRequiredAttributes,
  setTotpSecretCode,
  setUnverifiedContactMethods,
  setUser,
  setUsernameAuthAttributes,
} from '../actions';
import { defaultServices } from '../defaultServices';
import { groupLog, isEmpty, noop } from '../../../utils';

export type SignInMachineOptions = {
  services?: Partial<typeof defaultServices>;
};

const MFA_CHALLENGE_NAMES: AuthChallengeName[] = [
  'SMS_MFA',
  'SOFTWARE_TOKEN_MFA',
];

const getChallengeName = (event: AuthEvent): AuthChallengeName =>
  get(event, 'data.challengeName');

const isExpectedChallengeName = (
  challengeName: AuthChallengeName,
  expectedChallengeName: AuthChallengeName
) => challengeName === expectedChallengeName;

const isMfaChallengeName = (challengeName: AuthChallengeName) =>
  MFA_CHALLENGE_NAMES.includes(challengeName);

export function signInActor({ services }: SignInMachineOptions) {
  return createMachine<SignInContext, AuthEvent>(
    {
      initial: 'init',
      id: 'signInActor',
      predictableActionArguments: true,
      states: {
        init: {
          always: [
            { target: 'autoSignIn.submit', cond: 'shouldAutoSubmit' },
            { target: 'autoSignIn', cond: 'shouldAutoSignIn' },
            { target: 'signIn' },
          ],
        },
        signIn: {
          initial: 'edit',
          exit: ['clearFormValues', 'clearTouched'],
          states: {
            edit: {
              entry: 'sendUpdate',
              on: {
                SUBMIT: { actions: 'handleSubmit', target: 'submit' },
                CHANGE: { actions: 'handleInput' },
                FEDERATED_SIGN_IN: 'federatedSignIn',
              },
            },
            federatedSignIn: {
              tags: ['pending'],
              entry: ['sendUpdate', 'clearError'],
              invoke: {
                src: 'federatedSignIn',
                onError: { actions: 'setRemoteError' },
              },
            },
            submit: {
              tags: ['pending'],
              entry: ['parsePhoneNumber', 'clearError', 'sendUpdate'],
              invoke: {
                /**
                 * @migration Auth.SignInOutput
                 */
                src: 'signIn',
                onDone: [
                  {
                    cond: 'shouldSetupTOTP',
                    // actions: ['setUser', 'setChallengeName'],
                    actions: ['setChallengeName'],
                    target: '#signInActor.setupTOTP',
                  },
                  {
                    cond: 'shouldConfirmSignIn',
                    actions: ['setUser', 'setChallengeName'],
                    target: '#signInActor.confirmSignIn',
                  },
                  {
                    cond: 'shouldForceChangePassword',
                    actions: [
                      'setUser',
                      'setChallengeName',
                      'setRequiredAttributes',
                    ],
                    target: '#signInActor.forceNewPassword',
                  },
                  {
                    actions: 'setUser',
                    target: 'verifying',
                  },
                ],
                onError: [
                  {
                    cond: 'shouldRedirectToConfirmSignUp',
                    actions: ['setCredentials', 'setConfirmSignUpIntent'],
                    target: 'rejected',
                  },
                  {
                    cond: 'shouldRedirectToConfirmResetPassword',
                    actions: [
                      'setUsernameAuthAttributes',
                      'setConfirmResetPasswordIntent',
                    ],
                    target: 'rejected',
                  },
                  {
                    actions: 'setRemoteError',
                    target: 'edit',
                  },
                ],
              },
            },
            verifying: {
              tags: ['pending'],
              entry: ['clearError', 'sendUpdate'],
              invoke: {
                /**
                 * @migration Auth.FetchUserAttributesOutput
                 */
                src: 'checkVerifiedContact',
                onDone: [
                  {
                    cond: 'shouldRequestVerification',
                    target: '#signInActor.verifyUser',
                    actions: 'setUnverifiedContactMethods',
                  },
                  {
                    target: 'resolved',
                  },
                ],
                onError: {
                  actions: 'setRemoteError',
                  target: 'edit',
                },
              },
            },
            resolved: { always: '#signInActor.resolved' },
            rejected: { always: '#signInActor.rejected' },
          },
        },
        autoSignIn: {
          initial: 'pending',
          states: {
            pending: {
              tags: ['pending'],
              entry: ['clearError', 'sendUpdate'],
              on: {
                AUTO_SIGN_IN: [
                  {
                    cond: 'shouldSetupTOTP',
                    actions: ['setUser', 'setChallengeName'],
                    target: '#signInActor.setupTOTP',
                  },
                  {
                    cond: 'shouldConfirmSignIn',
                    actions: ['setUser', 'setChallengeName'],
                    target: '#signInActor.confirmSignIn',
                  },
                  {
                    cond: 'shouldForceChangePassword',
                    actions: [
                      'setUser',
                      'setChallengeName',
                      'setRequiredAttributes',
                    ],
                    target: '#signInActor.forceNewPassword',
                  },
                  {
                    actions: 'setUser',
                    target: '#signInActor.resolved',
                  },
                ],
                AUTO_SIGN_IN_FAILURE: {
                  actions: 'setRemoteError',
                  target: 'pending',
                },
              },
            },
            submit: {
              tags: ['pending'],
              entry: ['clearError', 'sendUpdate'],
              invoke: {
                src: 'signIn',
                onDone: [
                  {
                    cond: 'shouldSetupTOTP',
                    actions: ['setUser', 'setChallengeName'],
                    target: '#signInActor.setupTOTP',
                  },
                  {
                    cond: 'shouldConfirmSignIn',
                    actions: ['setUser', 'setChallengeName'],
                    target: '#signInActor.confirmSignIn',
                  },
                  {
                    cond: 'shouldForceChangePassword',
                    actions: [
                      'setUser',
                      'setChallengeName',
                      'setRequiredAttributes',
                    ],
                    target: '#signInActor.forceNewPassword',
                  },
                  {
                    actions: 'setUser',
                    target: '#signInActor.resolved',
                  },
                ],
                onError: {
                  actions: 'setRemoteError',
                  target: '#signInActor.signIn',
                },
              },
            },
            resolved: { always: '#signInActor.resolved' },
            rejected: { always: '#signInActor.rejected' },
          },
        },
        confirmSignIn: {
          initial: 'edit',
          exit: ['clearFormValues', 'clearError', 'clearTouched'],
          states: {
            edit: {
              entry: 'sendUpdate',
              on: {
                SUBMIT: { actions: 'handleSubmit', target: 'submit' },
                SIGN_IN: '#signInActor.signIn',
                CHANGE: { actions: 'handleInput' },
              },
            },
            submit: {
              tags: ['pending'],
              entry: ['clearError', 'sendUpdate'],
              invoke: {
                src: 'confirmSignIn',
                onDone: {
                  target: '#signInActor.resolved',
                  actions: [
                    'setUser',
                    'clearChallengeName',
                    'clearRequiredAttributes',
                  ],
                },
                onError: {
                  target: 'edit',
                  actions: 'setRemoteError',
                },
              },
            },
          },
        },
        forceNewPassword: {
          type: 'parallel',
          exit: ['clearFormValues', 'clearError', 'clearTouched'],
          states: {
            validation: {
              initial: 'pending',
              states: {
                pending: {
                  invoke: {
                    src: 'validateFields',
                    onDone: {
                      target: 'valid',
                      actions: 'clearValidationError',
                    },
                    onError: {
                      target: 'invalid',
                      actions: 'setFieldErrors',
                    },
                  },
                },
                valid: { entry: 'sendUpdate' },
                invalid: { entry: 'sendUpdate' },
              },
              on: {
                SIGN_IN: '#signInActor.signIn',
                CHANGE: {
                  actions: 'handleInput',
                  target: '.pending',
                },
                BLUR: {
                  actions: 'handleBlur',
                  target: '.pending',
                },
              },
            },
            submit: {
              initial: 'idle',
              entry: 'clearError',
              states: {
                idle: {
                  entry: 'sendUpdate',
                  on: {
                    SUBMIT: { actions: 'handleSubmit', target: 'validate' },
                  },
                },
                validate: {
                  entry: 'sendUpdate',
                  invoke: {
                    src: 'validateFields',
                    onDone: {
                      target: 'pending',
                      actions: 'clearValidationError',
                    },
                    onError: {
                      target: 'idle',
                      actions: 'setFieldErrors',
                    },
                  },
                },
                pending: {
                  tags: ['pending'],
                  entry: ['sendUpdate', 'clearError'],
                  invoke: {
                    /**
                     * @migration is this recursive
                     */
                    src: 'forceNewPassword',
                    onDone: [
                      {
                        cond: 'shouldConfirmSignIn',
                        actions: ['setUser', 'setChallengeName'],
                        target: '#signInActor.confirmSignIn',
                      },
                      {
                        cond: 'shouldSetupTOTP',
                        actions: ['setUser', 'setChallengeName'],
                        target: '#signInActor.setupTOTP',
                      },
                      {
                        target: 'resolved',
                        actions: ['setUser', 'setCredentials'],
                      },
                    ],
                    onError: {
                      target: 'idle',
                      actions: 'setRemoteError',
                    },
                  },
                },
                resolved: { type: 'final', always: '#signInActor.resolved' },
              },
            },
          },
        },
        setupTOTP: {
          initial: 'getTotpSecretCode',
          exit: ['clearFormValues', 'clearError', 'clearTouched'],
          states: {
            getTotpSecretCode: {
              invoke: {
                src: 'getTotpSecretCode',
                onDone: {
                  target: 'edit',
                  actions: 'setTotpSecretCode',
                },
                onError: {
                  target: 'edit',
                  actions: 'setRemoteError',
                },
              },
            },
            edit: {
              entry: 'sendUpdate',
              on: {
                SUBMIT: { actions: 'handleSubmit', target: 'submit' },
                SIGN_IN: '#signInActor.signIn',
                CHANGE: { actions: 'handleInput' },
              },
            },
            submit: {
              tags: ['pending'],
              entry: ['sendUpdate', 'clearError'],
              invoke: {
                src: 'verifyTotpToken',
                onDone: {
                  actions: ['clearChallengeName', 'clearRequiredAttributes'],
                  target: '#signInActor.resolved',
                },
                onError: {
                  actions: 'setRemoteError',
                  target: 'edit',
                },
              },
            },
          },
        },
        verifyUser: {
          initial: 'edit',
          exit: ['clearFormValues', 'clearError', 'clearTouched'],
          states: {
            edit: {
              entry: 'sendUpdate',
              on: {
                SUBMIT: { actions: 'handleSubmit', target: 'submit' },
                SKIP: '#signInActor.resolved',
                CHANGE: { actions: 'handleInput' },
              },
            },
            submit: {
              tags: ['pending'],
              entry: 'clearError',
              invoke: {
                src: 'verifyUser',
                onDone: {
                  target: '#signInActor.confirmVerifyUser',
                },
                onError: {
                  actions: 'setRemoteError',
                  target: 'edit',
                },
              },
            },
          },
        },
        confirmVerifyUser: {
          initial: 'edit',
          exit: [
            'clearFormValues',
            'clearError',
            'clearUnverifiedContactMethods',
            'clearAttributeToVerify',
            'clearTouched',
          ],
          states: {
            edit: {
              entry: 'sendUpdate',
              on: {
                SUBMIT: { actions: 'handleSubmit', target: 'submit' },
                SKIP: '#signInActor.resolved',
                CHANGE: { actions: 'handleInput' },
              },
            },
            submit: {
              tags: ['pending'],
              entry: 'clearError',
              invoke: {
                src: 'confirmVerifyUser',
                onDone: {
                  target: '#signInActor.resolved',
                },
                onError: {
                  actions: 'setRemoteError',
                  target: 'edit',
                },
              },
            },
          },
        },
        resolved: {
          type: 'final',
          data: async () => {
            return await Auth.getCurrentUser();
          },
        },
        rejected: {
          type: 'final',
          data: (context, event) => {
            groupLog('+++signIn.rejected.final', context);

            return {
              intent: context.redirectIntent,
              authAttributes: context.authAttributes,
            };
          },
        },
      },
    },
    {
      actions: {
        clearAttributeToVerify,
        clearChallengeName,
        clearRequiredAttributes,
        clearError,
        clearFormValues,
        clearTouched,
        clearUnverifiedContactMethods,
        clearValidationError,
        handleInput,
        handleSubmit,
        handleBlur,
        parsePhoneNumber,
        setChallengeName,
        setConfirmResetPasswordIntent,
        setConfirmSignUpIntent,
        setRequiredAttributes,
        setCredentials,
        setFieldErrors,
        setRemoteError,
        setTotpSecretCode,
        setUnverifiedContactMethods,
        setUser,
        setUsernameAuthAttributes,
        sendUpdate: sendUpdate(), // sendUpdate is a HOC
      },
      guards: {
        shouldAutoSignIn: (context) => {
          groupLog('+++signIn.shouldAutoSignIn', 'context', context);
          return context?.intent === 'autoSignIn';
        },
        shouldAutoSubmit: (context) => {
          groupLog('+++signIn.shouldAutoSubmit', 'context', context);
          return context?.intent === 'autoSignInSubmit';
        },
        shouldConfirmSignIn: (_, event): boolean => {
          groupLog('+++shouldConfirmSignIn', 'event', event);
          return isMfaChallengeName(getChallengeName(event));
        },
        shouldForceChangePassword: (context, event): boolean => {
          groupLog('+++shouldForceChangePassword', 'event', event);
          return (
            event.data.nextStep?.signInStep ===
            'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED'
          );
        },

        shouldRedirectToConfirmResetPassword: (_, event): boolean => {
          groupLog('+++shouldRedirectToConfirmResetPassword', 'event', event);
          return event.data.code === 'PasswordResetRequiredException';
        },
        shouldRedirectToConfirmSignUp: (_, event): boolean => {
          groupLog('+++shouldRedirectToConfirmSignUp', 'event', event);
          return event.data.code === 'UserNotConfirmedException';
        },
        shouldRequestVerification: (_, event): boolean => {
          groupLog('+++shouldRequestVerification', 'event', event);
          const { unverified, verified } = event.data;

          return isEmpty(verified) && !isEmpty(unverified);
        },
        shouldSetupTOTP: (_, event): boolean => {
          //   event.data ={
          //     "isSignedIn": false,
          //     "nextStep": {
          //         "signInStep": "CONTINUE_SIGN_IN_WITH_TOTP_SETUP",
          //         "totpSetupDetails": {
          //             "sharedSecret": "xxxx"
          //         }
          //     }
          // }
          groupLog(
            '+++shouldSetupTOTP',
            `'event.data.nextStep.signInStep' ===
            'CONTINUE_SIGN_IN_WITH_TOTP_SETUP'`,
            event.data.nextStep?.signInStep ===
              'CONTINUE_SIGN_IN_WITH_TOTP_SETUP'
          );
          return (
            event.data.nextStep?.signInStep ===
            'CONTINUE_SIGN_IN_WITH_TOTP_SETUP'
          );
          // return isExpectedChallengeName(getChallengeName(event), 'MFA_SETUP');
        },
      },
      services: {
        async signIn(context) {
          /**
           * `authAttributes` are any username/password combo we remembered in
           * memory. This is used in autoSignIn flow usually to pass username/pw
           * from `confirmSignUp`.
           */
          const { authAttributes = {}, formValues = {} } = context;

          const credentials = { ...authAttributes, ...formValues };
          const { username, password } = credentials;

          groupLog('+++signIn', 'credentials', credentials);

          return await services.handleSignIn({
            username,
            password,
          });
        },
        // async confirmSignIn(context) {
        //   const { challengeName, user } = context;
        //   const { confirmation_code: code } = context.formValues;

        //   const mfaType = isMfaChallengeName(challengeName)
        //     ? challengeName
        //     : undefined;

        //   await services.handleConfirmSignIn({ user, code, mfaType });
        //   return await Auth.getCurrentUser();
        // },
        async confirmSignIn(context) {
          groupLog('+++confirmSignIn');

          const { confirmation_code: challengeResponse } = context.formValues;

          await services.handleConfirmSignIn({ challengeResponse });
          return await Auth.getCurrentUser();
        },
        // async forceNewPassword(context) {
        //   const { user, formValues } = context;
        //   let {
        //     password,
        //     confirm_password,
        //     phone_number,
        //     country_code,
        //     ...rest
        //   } = formValues;

        //   let phoneNumberWithCountryCode;
        //   if (phone_number) {
        //     phoneNumberWithCountryCode =
        //       `${country_code}${phone_number}`.replace(/[^A-Z0-9+]/gi, '');
        //     rest = { ...rest, phone_number: phoneNumberWithCountryCode };
        //   }

        //   try {
        //     // complete forceNewPassword flow and get updated CognitoUser
        //     const newUser: AmplifyUser = await Auth.completeNewPassword(
        //       user,
        //       password,
        //       rest
        //     );

        //     if (newUser.challengeName) {
        //       /**
        //        * User still needs to complete MFA challenge. Return back the
        //        * `completeNewPassword` result to start confirmSignIn flow.
        //        */
        //       return newUser;
        //     } else {
        //       /**
        //        * Else, user has signed in! Return up-to-date user with
        //        * `getCurrentUser`. Note that we're calling this extra
        //        * API because this gets all `user.attributes` as well.
        //        */
        //       return Auth.getCurrentUser();
        //     }
        //   } catch (err) {
        //     return Promise.reject(err);
        //   }
        // },
        async forceNewPassword(context) {
          groupLog('+++forceNewPassword');
          const { user, formValues } = context;
          let {
            password,
            confirm_password,
            phone_number,
            country_code,
            ...rest
          } = formValues;

          let phoneNumberWithCountryCode;
          if (phone_number) {
            phoneNumberWithCountryCode =
              `${country_code}${phone_number}`.replace(/[^A-Z0-9+]/gi, '');
            rest = { ...rest, phone_number: phoneNumberWithCountryCode };
          }

          try {
            // complete forceNewPassword flow and get updated CognitoUser
            const input: Auth.ConfirmSignInInput = {
              challengeResponse: password,
              options: { serviceOptions: { userAttributes: rest } },
            };

            const output = await Auth.confirmSignIn(input);
            const { signInStep } = output.nextStep;

            if (signInStep === 'DONE') {
              /**
               * Else, user has signed in! Return up-to-date user with
               * `getCurrentUser`. Note that we're calling this extra
               * API because this gets all `user.attributes` as well.
               */
              return Auth.getCurrentUser();
            } else {
              /**
               * User still needs to complete MFA challenge. Return back the
               * `completeNewPassword` result to start confirmSignIn flow.
               */
              return output;
            }
          } catch (err) {
            return Promise.reject(err);
          }
        },
        // async getTotpSecretCode(context) {
        //   const { user } = context;
        //   return Auth.setUpTOTP(user);
        // },
        async getTotpSecretCode(_, event) {
          //   event.data = {
          //     "isSignedIn": false,
          //     "nextStep": {
          //         "signInStep": "CONTINUE_SIGN_IN_WITH_TOTP_SETUP",
          //         "totpSetupDetails": {
          //             "sharedSecret": "xxxx"
          //         }
          //     }
          // }
          groupLog(
            '+++getTotpSecretCode',
            'event',
            event.data.nextStep.totpSetupDetails.sharedSecret
          );
          // const secretCode = await Auth.setUpTOTP();

          return event.data.nextStep.totpSetupDetails.sharedSecret;
        },
        // async verifyTotpToken(context) {
        //   const { formValues, user } = context;
        //   const { confirmation_code } = formValues;

        //   return Auth.verifyTotpToken(user, confirmation_code);
        // },
        async verifyTotpToken(context) {
          const { confirmation_code: code } = context.formValues;
          /**
           * @migration not sure if renaming makes sense vs explaining
           * confusing API interaction in comment
           */
          groupLog('+++verifyTotpToken', 'code', code);
          // const input: Auth.VerifyTOTPSetupInput = { code };
          // return Auth.verifyTOTPSetup(input);
          // return await Auth.verifyTOTPSetup(input);
          const input: Auth.ConfirmSignInInput = { challengeResponse: code };
          return await Auth.confirmSignIn(input);
        },
        // async federatedSignIn(_, event) {
        //   const { provider } = event.data;

        //   return await Auth.federatedSignIn({ provider });
        // },
        async federatedSignIn(_, event) {
          const { provider } = event.data;
          return noop({ provider });
        },
        // async checkVerifiedContact(context) {
        //   const { user } = context;
        //   const result = await Auth.verifiedContact(user);
        //   return result;
        // },
        async checkVerifiedContact() {
          groupLog('+++checkVerifiedContact');
          return await Auth.fetchUserAttributes();
        },
        // async verifyUser(context) {
        //   const { unverifiedAttr } = context.formValues;
        //   const result = await Auth.verifyCurrentUserAttribute(unverifiedAttr);

        //   context.attributeToVerify = unverifiedAttr;

        //   return result;
        // },
        async verifyUser(context) {
          groupLog('+++verifyUser');
          const { unverifiedAttr } = context.formValues;

          const input: Auth.UpdateUserAttributesInput = {
            userAttributes: { unverifiedAttr },
          };
          const result = await Auth.updateUserAttributes(input);

          context.attributeToVerify = unverifiedAttr as unknown as string;

          return result;
        },
        // async confirmVerifyUser(context) {
        //   const { attributeToVerify } = context;
        //   const { confirmation_code } = context.formValues;

        //   return await Auth.verifyCurrentUserAttributeSubmit(
        //     attributeToVerify,
        //     confirmation_code
        //   );
        // },
        async confirmVerifyUser(context) {
          groupLog('+++confirmVerifyUser');
          const { attributeToVerify } = context;
          const { confirmation_code } = context.formValues;

          const input: Auth.ConfirmUserAttributeInput = {
            confirmationCode: confirmation_code,
            userAttributeKey: attributeToVerify,
          };
          return await Auth.confirmUserAttribute(input);
        },
        async validateFields(context) {
          return runValidators(
            context.formValues,
            context.touched,
            context.passwordSettings,
            [
              defaultServices.validateFormPassword,
              defaultServices.validateConfirmPassword,
            ]
          );
        },
      },
    }
  );
}
