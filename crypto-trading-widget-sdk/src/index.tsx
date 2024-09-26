import React from 'react';
import { App, ProvidersWrapper } from 'App';
import { createRoot } from 'react-dom/client';
import { WidgetOptions } from './redux/customisationSlice';
import { WidgetPage } from './pages/Widget';
import { WidgetNftPage } from './pages/WidgetNftPage';
import { WidgetCustomization } from 'pages/WidgetCustomisation/WidgetCustomisation';

// TODO: configure dev sandboxes for all features
if (process.env.NODE_ENV === 'development') {
  const testRoot = document.getElementById('root');
  if (testRoot) {
    const root = createRoot(testRoot);
    root.render(<App />);
  }
}

export const tradingWidget = (elementId: string, widgetOptions: WidgetOptions) => {
  const rootElement = document.getElementById(elementId);

  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
      <ProvidersWrapper>
        <WidgetPage widgetOptions={widgetOptions} />
      </ProvidersWrapper>
    );
  }
};

export const widgetCustomisationPanel = (elementId: string) => {
  const rootElement = document.getElementById(elementId);

  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
      <ProvidersWrapper>
        <WidgetCustomization />
      </ProvidersWrapper>
    );
  }
};

export const initNftWidget = (elementId: string, widgetOptions: WidgetOptions) => {
  const rootElement = document.getElementById(elementId);

  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
      <ProvidersWrapper>
        <WidgetNftPage widgetOptions={widgetOptions} />
      </ProvidersWrapper>
    );
  }
};

declare global {
  interface Window {
    CryptoTradingWidget: {
      tradingWidget: (elementId: string, widgetOptions: WidgetOptions) => void;
      widgetCustomisationPanel: (elementId: string) => void;
      initNftWidget: (elementId: string, widgetOptions: WidgetOptions) => void;
      openOrder: (orderHash: string) => void;
    };
  }
}

window.CryptoTradingWidget = {
  tradingWidget,
  widgetCustomisationPanel,
  initNftWidget,
  openOrder: () => {
    throw new Error('NFt Widget not initiated');
  },
};
