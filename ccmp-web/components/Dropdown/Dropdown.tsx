import ArrowDropdownIcon from '@/assets/icons/ArrowDropdownIcon';
import { ArrowRight } from '@/assets/icons/ArrowRight';
import React from 'react';
import style from './Dropdown.module.css';

export enum DropMenuItemType {
  VIDEO = 'VIDEO',
  LINK = 'LINK',
  SUBMENU = 'SUBMENU',
  CATEGORY = 'CATEGORY',
}

type OnVideoClick = (videoId: string) => void;
type MenuItemProps = DropMenuItemConfig & { onVideoClick: OnVideoClick };

interface DropMenuItemData {
  title: string;
  videoId?: string;
  link?: string;
}
export interface DropMenuItemConfig {
  data: DropMenuItemData;
  type: DropMenuItemType;
  onClick?: any;
  submenu?: DropMenuItemConfig[];
}

interface DropdownMenuProps {
  onVideoClick: OnVideoClick;
  config: DropMenuItemConfig[];
}

interface DropdownProps {
  isOpen: boolean;
  toggle: () => void;
  config: DropMenuItemConfig[];
  title: string;
  onVideoClick?: OnVideoClick;
  className?: string;
  border?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  isOpen,
  toggle,
  title,
  config,
  onVideoClick,
  className = '',
  border = true,
}: DropdownProps) => {
  return (
    <div
      className={`${style.dropdown} ${isOpen ? style.open : ''} ${className} ${
        border ? style.greenBorder : style.transparentBorder
      }`}
      tabIndex={0}
      onBlur={(e): void => {
        if (isOpen) toggle();
      }}
      onClick={toggle}
    >
      <div className={style.title}>
        <div className={style.titleContent}>{title}</div>
        <div className={style.arrow}>
          <ArrowDropdownIcon />
        </div>
      </div>
      <DropdownMenu config={config} onVideoClick={onVideoClick} />
    </div>
  );
};

const DropdownMenu: React.FC<DropdownMenuProps> = ({ config, onVideoClick }: DropdownMenuProps) => {
  return (
    <ul className={`${style.menu}`}>
      {config?.map((item, index) => (
        <MenuItem
          key={`${item?.data?.title}-${index}`}
          type={item.type}
          data={item.data}
          submenu={item.submenu}
          onVideoClick={onVideoClick}
        />
      ))}
    </ul>
  );
};

const MenuItem: React.FC<MenuItemProps> = ({ data, type, submenu, onVideoClick }: MenuItemProps) => {
  return (
    <li className={type === DropMenuItemType.CATEGORY ? style.category : ''}>
      {type === DropMenuItemType.LINK && (
        <a href={data.link} target="_blank" rel="noopener noreferrer" className={style.content}>
          {data?.title}
        </a>
      )}

      {type === DropMenuItemType.CATEGORY && <div className={style.categoryTitle}>{data.title}</div>}

      {type === DropMenuItemType.VIDEO && (
        <div
          className={style.content}
          onClick={() => {
            onVideoClick(data.videoId);
          }}
        >
          {data.title}
        </div>
      )}

      {type === DropMenuItemType.SUBMENU && !!submenu?.length && (
        <>
          <div className={style.content}>
            {data.title} {!!submenu?.length && <ArrowRight />}
          </div>
          <DropdownMenu config={submenu} onVideoClick={onVideoClick} />
        </>
      )}
    </li>
  );
};

export default Dropdown;
