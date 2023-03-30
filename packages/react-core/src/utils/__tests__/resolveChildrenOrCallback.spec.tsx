import React from 'react';
import resolveChildrenOrCallback from '../resolveChildrenOrCallback';

describe('resolveChildrenOrCallback', () => {
  it('handles React children as expected', () => {
    const children = <></>;
    const output = resolveChildrenOrCallback(children);

    expect(output).toStrictEqual(children);
  });

  it('handles an array of React children', () => {
    const children = [<></>, <></>];
    const output = resolveChildrenOrCallback(children);

    expect(output).toStrictEqual(children);
  });

  it('handles undefined children', () => {
    const children = undefined;
    const output = resolveChildrenOrCallback(children);

    expect(output).toStrictEqual(children);
  });

  it('handles a callback with a single param', () => {
    const param = 'PARAM';
    const callback = (value: string) => value;

    const output = resolveChildrenOrCallback(callback, param);

    expect(output).toBe(param);
  });

  it('handles a callback with multiple params', () => {
    const paramOne = 'PARAM_ONE';
    const paramTwo = 'PARAM_TWO';
    const callback = (firstParam: string, secondParam: string) =>
      `${firstParam}:${secondParam}`;

    const output = resolveChildrenOrCallback(callback, paramOne, paramTwo);

    expect(output).toBe(`${paramOne}:${paramTwo}`);
  });
});
