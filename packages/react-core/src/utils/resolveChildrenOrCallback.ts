import { isTypedFunction } from '@aws-amplify/ui';

declare type Callback = (...params: any[]) => React.ReactNode;

export default function resolveChildrenOrCallback<
  ChildrenOrCallback extends Callback | React.ReactNode
>(
  children: ChildrenOrCallback,
  ...params: ChildrenOrCallback extends Callback
    ? Parameters<ChildrenOrCallback>[0][]
    : never
): React.ReactNode {
  return isTypedFunction<Callback>(children) ? children(...params) : children;
}
