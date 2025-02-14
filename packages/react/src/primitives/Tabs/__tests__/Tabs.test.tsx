import { render, screen } from '@testing-library/react';
import * as React from 'react';

import { Tabs, TabItem } from '../Tabs';
import { Text } from '../../Text';
import { ComponentClassNames } from '../../shared';

describe('Tabs', () => {
  it('can render custom classnames', async () => {
    render(
      <Tabs className="custom-classname" testId="tabsId">
        <TabItem title="Tab 1">Tab 1</TabItem>
      </Tabs>
    );

    const tabs = await screen.findByTestId('tabsId');
    expect(tabs.className).toContain('custom-classname');
    expect(tabs.className).toContain(ComponentClassNames.Tabs);
  });

  it('can render any arbitrary data-* attribute', async () => {
    render(
      <Tabs data-demo="true" testId="tabsTest">
        <TabItem title="Tab 1">Tab 1</TabItem>
        <TabItem title="Tab 2">Tab 2</TabItem>
      </Tabs>
    );
    const tabs = await screen.findByTestId('tabsTest');
    expect(tabs.dataset['demo']).toBe('true');
  });

  it('should forward ref to Tabs DOM element', async () => {
    const ref = React.createRef<HTMLDivElement>();

    render(
      <Tabs ref={ref} testId="tabsId">
        <TabItem title="Tab 1">Tab 1</TabItem>
      </Tabs>
    );

    await screen.findByTestId('tabsId');
    expect(ref.current?.nodeName).toBe('DIV');
  });

  it('should skip over null children', async () => {
    render(
      <Tabs testId="tabsTest">
        <TabItem title="Tab 1">Tab 1</TabItem>
        {null}
      </Tabs>
    );
    const tabs = await screen.findByTestId('tabsTest');
    const panels = await screen.findAllByRole('tabpanel');
    expect(tabs.children).toHaveLength(1);
    expect(panels).toHaveLength(1);
  });

  it('should work with defaultIndex and null children', async () => {
    render(
      <Tabs testId="tabsTest" defaultIndex={1}>
        <TabItem title="Tab 1">Tab 1</TabItem>
        {null}
        {undefined}
        <TabItem title="Tab 2">Tab 2</TabItem>
      </Tabs>
    );
    const tabs = await screen.findAllByRole('tab');
    expect(tabs).toHaveLength(2);
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
  });

  describe('TabItem', () => {
    it('can render custom classnames', async () => {
      render(
        <Tabs>
          <TabItem className="custom-classname" title="Tab 1">
            Tab 1
          </TabItem>
        </Tabs>
      );

      const tab = await screen.findByRole('tab');
      expect(tab.className).toContain('custom-classname');
      expect(tab.className).toContain(ComponentClassNames.TabItems);
    });

    it('should handle React nodes in the title', async () => {
      render(
        <Tabs>
          <TabItem title={<Text testId="test">Test1234</Text>}>Tab 1</TabItem>
        </Tabs>
      );

      const tab = await screen.findByTestId('test');
      expect(tab.innerHTML).toContain('Test1234');
    });

    it('should render disabled button when disabled', async () => {
      render(
        <Tabs data-demo="true" testId="tabsTest">
          <TabItem title="Tab 1" isDisabled>
            Tab 1
          </TabItem>
        </Tabs>
      );

      const tab = await screen.findByRole('tab');
      expect(tab).toHaveAttribute('disabled');
    });

    it('should forward ref to TabItem Button DOM element', async () => {
      const ref = React.createRef<HTMLButtonElement>();

      render(
        <Tabs>
          <TabItem ref={ref} title="Tab 1">
            Tab 1
          </TabItem>
        </Tabs>
      );

      await screen.findByRole('tab');
      expect(ref.current?.nodeName).toBe('BUTTON');
    });
  });
});
