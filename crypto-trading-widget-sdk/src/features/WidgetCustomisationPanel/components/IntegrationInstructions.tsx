import React, { useEffect } from 'react';
import hljs from 'highlight.js';
import { marked } from 'marked';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { WidgetOptions, WidgetType } from 'redux/customisationSlice';
import { Chain } from 'utils/chains';
import { useAppSelector } from 'redux/hooks/reduxHooks';
import { CopyContentButton } from 'components/Buttons/CopyContentButton';
import { ON_SALE_NFT_ORDER_HASH, WIDGET_CDN_URL } from '../../../constants';
import { widgetColors, nftWidgetColors, notificationColors } from '../constants';

const chainOptionsDescription = (customisationOptions: WidgetOptions) => {
  const chainOptions = customisationOptions.chainOptions;
  let str = '';

  for (const chain in chainOptions) {
    const enabled = chainOptions[Number(chain) as Chain].enabled;
    const defaultToken = chainOptions[Number(chain) as Chain].defaultTokenAddress;

    if (enabled && !defaultToken) {
      str += `
        ${chain}: {
          enabled: ${enabled},
        },`;
    }
    if (enabled && defaultToken) {
      str += `
        ${chain}: {
          enabled: ${enabled},
          defaultTokenAddress: "${defaultToken}",
        },`;
    }
  }

  return `
      chainOptions: { ${str}
      }`;
};

const palletOverridesDescription = (customisationOptions: WidgetOptions, widgetType: WidgetType) => {
  let str = '';
  const colors = widgetType !== WidgetType.NFT ? widgetColors : nftWidgetColors;

  for (const color of [...colors, ...notificationColors]) {
    str += `
        "${color.key}": "${customisationOptions.paletteOverrides[color.key]}",`;
  }

  return str;
};

const swapWidgetInstructions = (customisationOptions: WidgetOptions, widgetType: WidgetType) => `
  <!-- 1. Place this script tag on the <body> of your page: -->
  <script src="${WIDGET_CDN_URL}"
  type="text/javascript"></script>

  <!-- 2. Create div tag where you want to locate the widget -->
  <div id="widget"></div>

  <!-- 3. To initialize widget add this to the script tag at the bottom of <body> -->
  <script>
    const configuration = {
      paletteOverrides: { ${palletOverridesDescription(customisationOptions, widgetType)}
      },${chainOptionsDescription(customisationOptions)},
      widgetType: "${widgetType}",
    };
    CryptoTradingWidget.tradingWidget('widget', configuration);
  </script>
  `;

const nftWidgetInstructions = (customisationOptions: WidgetOptions, widgetType: WidgetType) => `
  <!-- 1. Create div tag where you want to locate the widget -->
  <div id="widget"></div>

  <!-- 2. To initialize widget add this to the script tag at the bottom of <body> -->
  <script>
    const configuration = {
      paletteOverrides: { ${palletOverridesDescription(customisationOptions, widgetType)}
      },
      widgetType: "${widgetType}",
    };
    const script = document.createElement('script');

    script.src = "${WIDGET_CDN_URL}";
    document.head.appendChild(script);
    script.onload = () => {
      window.CryptoTradingWidget.initNftWidget('widget', configuration);
    };
  </script>

  <!-- 3. Create button and add 'onclick' event to open some order inside the widget -->
  <button id="orderButton">Open order</button>
  <script>
    const button = document.getElementById('orderButton');
    const openOrder = () => {
      const orderHash = "${ON_SALE_NFT_ORDER_HASH}";
      window.CryptoTradingWidget.openOrder(orderHash);
    }
    button.onclick = openOrder;
  </script>
`;

export const IntegrationInstructions: React.FC = () => {
  const widgetType = useAppSelector(({ customisation }) => customisation.options.widgetType);
  const customisationOptions = useAppSelector(({ customisation }) => customisation.options);

  const instructions =
    widgetType === WidgetType.NFT
      ? nftWidgetInstructions(customisationOptions, widgetType)
      : swapWidgetInstructions(customisationOptions, widgetType);
  const markdown = `\`\`\`html${instructions}\`\`\``;

  useEffect(() => {
    hljs.highlightAll();
  }, [markdown]);

  useEffect(() => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github-dark.min.css');
    document.head.appendChild(link);
  }, []);

  return (
    <>
      <Box display={'flex'} justifyContent={'space-between'}>
        <Typography variant={'h3'}>{'Integration'}</Typography>
        <CopyContentButton content={instructions} />
      </Box>

      <Box whiteSpace="pre" fontSize={14}>
        <Box dangerouslySetInnerHTML={{ __html: marked(markdown) }} />
      </Box>
    </>
  );
};
