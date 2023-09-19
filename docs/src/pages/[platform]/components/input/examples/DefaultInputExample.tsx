import { Input, Label, Flex } from '@aws-amplify/ui-react';

export const DefaultInputExample = () => (
  <Flex direction="column" gap="small">
    <Label htmlFor="first_name">First Name:</Label>
    <Input id="first_name" name="first_name" />
  </Flex>
);
