import { useState } from 'react';
import { sliceTextAndAddDotsOnTheEnd } from '../utils/common';
import { ViewMoreButton } from 'components/Buttons/ViewMoreButton';

interface CustomDescriptionAccordionProps {
  description: string;
}

export const CustomDescriptionAccordion: React.FC<CustomDescriptionAccordionProps> = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {isExpanded ? description : sliceTextAndAddDotsOnTheEnd(description, 45)}
      <ViewMoreButton onClick={() => setIsExpanded(!isExpanded)} isExpanded={isExpanded} />
    </>
  );
};
