import { useAuthenticator } from '../../AuthenticatorContext';

/**
 * @internal
 * @returns
 */
export default function useCodeDeliveryDetails(): {
  deliveryMedium: string | undefined;
  destination: string | undefined;
  isMediumEmail: boolean;
  isMediumSMS: boolean;
} {
  const { codeDeliveryDetails } = useAuthenticator(
    ({ codeDeliveryDetails }) => [codeDeliveryDetails]
  );

  const { DeliveryMedium: deliveryMedium, Destination: destination } =
    codeDeliveryDetails ?? {};

  const isMediumEmail = deliveryMedium === 'EMAIL';
  const isMediumSMS = deliveryMedium === 'SMS';
  return { deliveryMedium, destination, isMediumEmail, isMediumSMS };
}
