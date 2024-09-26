import Card from '@/ui-kit/Card/Card';
import Image from 'next/image';
import React from 'react';
import style from './Discord.module.css';

const Discord = (): JSX.Element => {
  return (
    <>
      <div className={style.wrap}>
        <Card className={style.card}>
          <h4 className={style.title}>
            Get more involved with <br /> our members in Discord
          </h4>
          <a target="_blank" rel="noopener noreferrer" href="https://discord.gg/jb7nnhsZUc" className={style.icon}>
            <Image height={72} width={72} src="/images/crosschain/Discord.svg" alt="discord" loading="lazy" />
          </a>
        </Card>
      </div>
    </>
  );
};

export default React.memo(Discord);

{
  /* https://discord.gg/wfReEmmzrd */
}
