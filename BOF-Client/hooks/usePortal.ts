import { createPortal } from 'react-dom';
import { useEffect } from 'react';

const Portal = ({ children, isVisible, enableBodyScrollWhenActive }) => {
  useEffect(() => {
    if (enableBodyScrollWhenActive === true) {
      return;
    }

    if (isVisible) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = 'var(--scrollWidth)';
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  }, [isVisible]);

  return isVisible ? createPortal(children, document.querySelector('#portal')) : null;
};

export default Portal;
