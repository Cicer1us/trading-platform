import {
  LanguageCode,
  LibrarySymbolInfo,
  ResolutionString,
  ThemeName,
} from '@/public/static/tradingview/charting_library/charting_library';
import { CandleResolution } from '@dydxprotocol/v3-client';
import { isMobile } from 'react-device-detect';
import datafeed from './datafeed';

type DefaultSymbolParams = Omit<LibrarySymbolInfo, 'name' | 'full_name' | 'description'>;

export enum Resolutions {
  FIFTEEN_MINS = '15',
  THIRTY_MINS = '30',
  ONE_HOUR = '60',
  ONE_DAY = '1D',
}

export const overrides: Record<string, string | number | boolean> = {
  // volumePaneSize: 'tiny',
  priceScaleSelectionStrategyName: 'right',

  'paneProperties.backgroundType': 'solid',
  'paneProperties.background': 'rgba(62, 64, 78, 0)',
  'paneProperties.backgroundGradientStartColor': 'rgba(72, 71, 84, 1)',
  'paneProperties.backgroundGradientEndColor': 'rgba(35, 34, 53, 1)',
  'paneProperties.vertGridProperties.color': 'rgba(80,80,93, 1)',
  'paneProperties.horzGridProperties.color': 'rgba(80,80,93, 1)',
  'paneProperties.topMargin': 1,
  'paneProperties.bottomMargin': 1,
  'paneProperties.axisProperties.alignLabels': true,
  'paneProperties.crossHairProperties.color': 'rgba(255,255,255,1)',
  'paneProperties.legendProperties.showBackground': false,
  'paneProperties.legendProperties.backgroundTransparency': 100,

  'mainSeriesProperties.style': 1,
  'mainSeriesProperties.candleStyle.upColor': '#38D9C0',
  'mainSeriesProperties.candleStyle.downColor': '#FF6666',
  'mainSeriesProperties.candleStyle.borderUpColor': '#38D9C0',
  'mainSeriesProperties.candleStyle.borderDownColor': '#FF6666',
  'mainSeriesProperties.candleStyle.wickUpColor': '#38D9C0',
  'mainSeriesProperties.candleStyle.wickDownColor': '#FF6666',
  'mainSeriesProperties.showPriceLine': true,
  'mainSeriesProperties.priceLineWidth': 1,

  'scalesProperties.lineColor': 'rgba(126,126,137,1)',
  'scalesProperties.textColor': '#C5C5C9',
  'scalesProperties.fontSize': 14,
  'scalesProperties.seriesLastValueMode': 1,
};

export const disabledFeatures: string[] = [
  // 'volume_force_overlay',
  'legend_widget',
  'left_toolbar',
  'right_toolbar',
  'header_chart_type',
  'header_symbol_search',
  // 'header_widget',
  // 'header_indicators',
  'header_settings',
  isMobile ? 'header_fullscreen_button' : '',
  'header_screenshot',
  'header_undo_redo',
  'header_compare',
  'header_saveload',
  'timeframes_toolbar',
  'use_localstorage_for_settings',
];

export const configurationData = {
  supported_resolutions: [
    Resolutions.FIFTEEN_MINS,
    Resolutions.THIRTY_MINS,
    Resolutions.ONE_HOUR,
    Resolutions.ONE_DAY,
  ] as ResolutionString[],
  exchanges: [{ value: 'DyDx', name: 'DyDx', desc: 'DyDx' }],
  symbols_types: [{ name: 'crypto', value: 'crypto' }],
};

export const defaultSymbolParams: DefaultSymbolParams = {
  listed_exchange: 'DyDx',
  exchange: 'DyDx',
  supported_resolutions: configurationData.supported_resolutions as ResolutionString[],
  format: 'price',
  type: 'crypto',
  session: '24x7',
  timezone: 'Etc/UTC',
  minmov: 1,
  pricescale: 256,
  has_intraday: true,
  has_no_volume: false,
  has_weekly_and_monthly: false,
  volume_precision: 1,
  data_status: 'streaming',
};

export const container = 'tv_chart_container';

export const defaultWidgetParams = {
  debug: false,
  datafeed: datafeed,
  interval: Resolutions.THIRTY_MINS as ResolutionString,
  container,
  library_path: '/static/tradingview/charting_library/',
  autosize: true,
  theme: 'Dark' as ThemeName,
  locale: 'en' as LanguageCode,
  timeframe: Resolutions.ONE_DAY,
  disabled_features: disabledFeatures,
  overrides: overrides,
  custom_css_url: '/static/tradingview/css/style.css',
};

export const dyDxTradingViewResolution: Record<Resolutions, CandleResolution> = {
  [Resolutions.FIFTEEN_MINS]: CandleResolution.FIFTEEN_MINS,
  [Resolutions.THIRTY_MINS]: CandleResolution.THIRTY_MINS,
  [Resolutions.ONE_HOUR]: CandleResolution.ONE_HOUR,
  [Resolutions.ONE_DAY]: CandleResolution.ONE_DAY,
};

// [days, hours]
export const candlesVisibleRangeToShift = {
  [Resolutions.FIFTEEN_MINS]: [0, 16],
  [Resolutions.THIRTY_MINS]: [2, 0],
  [Resolutions.ONE_HOUR]: [3, 0],
  [Resolutions.ONE_DAY]: [60, 0],
};

export const MAX_CANDLES_PER_REQUEST = 100;
