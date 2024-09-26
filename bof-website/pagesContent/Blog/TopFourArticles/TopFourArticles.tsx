import React, { useState } from 'react';
import style from './TopFourArticles.module.css';
import BlogCard from '../BlogCard/BlogCard';
import Slider from 'react-slick';

interface TopFourArticlesProps {
  blogFourArticles: Array<any>;
}

const TopFourArticles: React.FC<TopFourArticlesProps> = ({ blogFourArticles }: TopFourArticlesProps): JSX.Element => {
  const [mousedownTrigger, setMouseDownTrigger] = useState(false);
  const [isClickCanceled, setClickCanceled] = useState(false);

  const secondaryArticles = blogFourArticles;
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: false,
    autoplaySpeed: 6000,
    dotsClass: `${style.dots} slick-dots`,
  };

  const handleClickSlider = e => {
    if (isClickCanceled) e.preventDefault();
    setClickCanceled(false);
  };
  return (
    <div
      className={style.wrapper}
      onMouseMove={() => {
        if (mousedownTrigger) {
          setClickCanceled(true);
          setMouseDownTrigger(false);
        }
      }}
      onMouseDownCapture={() => setMouseDownTrigger(true)}
    >
      <Slider {...settings}>
        {secondaryArticles?.map(({ imgUrl, title, date, linkPath, thumbnailImg }, index) => (
          <div key={index} onClickCapture={e => handleClickSlider(e)}>
            <BlogCard imgUrl={thumbnailImg} title={title} date={date} linkPath={linkPath} type={'carousel'} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default React.memo(TopFourArticles);
