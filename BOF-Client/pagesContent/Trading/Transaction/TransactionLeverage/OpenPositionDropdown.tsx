import Clarification from '@/components/Clarification/Clarification';
import { getDateFromTimeStamp } from '@/components/Table/Cells';
import useMultilingual from '@/hooks/useMultilingual';
import NumberFormat from 'react-number-format';
import style from './TransactionLeverage.module.css';

const OpenPositionDropDown = ({ row }: { row: any }) => {
  const { t } = useMultilingual('leverageDropdown');
  const [tableType] = row?.subInfo[0];

  return (
    <div className={`${style.subInfo}}`}>
      <div className={`${style.container}`}>
        {!!row?.subInfo.length &&
          row?.subInfo.map((section, indexSection) => (
            <div
              className={`${style.infoSections}  ${tableType.type === 'Status' && style.crosschain}`}
              key={indexSection}
            >
              {!!section.length &&
                section.map(({ name, helperText, value, prefix, type, translateName }, index) => (
                  <div className={style.infoBlock} key={index}>
                    <span className={style.label}>{translateName ? t(translateName) : name}</span>
                    {helperText && (
                      <span className={style.wrapperClarification}>
                        <Clarification helperText={t(helperText)} />
                      </span>
                    )}
                    {type === 'Number' && (
                      <span className={style.wrapperNumberFormat}>
                        <NumberFormat value={value} prefix={prefix} displayType="text" thousandSeparator />
                      </span>
                    )}
                    {type === 'Data' && getDateFromTimeStamp(value)}
                  </div>
                ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export default OpenPositionDropDown;
