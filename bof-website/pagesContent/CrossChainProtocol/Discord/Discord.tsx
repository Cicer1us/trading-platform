// import Card from '@/ui-kit/Card/Card';
import Image from 'next/image';
import React from 'react';
import Card from '@/components/Card/Card';
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
            <Image height={72} width={72} src="/images/cross-chain-landing/Discord.svg" alt="discord" loading="lazy" />
          </a>
        </Card>
      </div>
    </>
  );
};

export default Discord;

{
  /* https://discord.gg/wfReEmmzrd */
}
