import React from 'react';
import { Widget } from '../features/Widget';
import { WidgetOptions } from '../redux/customisationSlice';

interface WidgetPageProps {
  widgetOptions?: WidgetOptions;
}

export const WidgetPage: React.FC<WidgetPageProps> = ({ widgetOptions }) => {
  return <Widget widgetOptions={widgetOptions} />;
};
