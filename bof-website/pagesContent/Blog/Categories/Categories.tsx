import React, { useState } from 'react';
import style from './Categories.module.css';
import BlogCard from '../BlogCard/BlogCard';

interface CategoriesProps {
  categories: string[];
  articles: any;
}
const Categories = ({ categories, articles }: CategoriesProps): JSX.Element => {
  const [selectedCategory, setCategory] = useState('all');
  const categoryAsTitle = category => category?.toString().replace(/[-]+/g, ' '); // ex: category-name => category name
  const categoryAsPath = category => category?.toString().replace(/\s/g, '-').toLowerCase(); // ex: Category Name => category-name

  return (
    <div className={style.wrapper}>
      <div className={style.sectionHeader}>
        {!!categories?.length &&
          categories.map((category, index) => (
            <button
              key={`${category}-${index}`}
              onClick={() =>
                categoryAsPath(category) === selectedCategory
                  ? setCategory('all')
                  : setCategory(categoryAsPath(category))
              }
              className={`${style.button} ${
                categoryAsTitle(selectedCategory) === category.toLocaleLowerCase() ? style.active : ''
              }`}
              type="button"
            >
              <div>{category} </div>
            </button>
          ))}
      </div>
      <div className={style.sectionGrid}>
        {!!articles?.length &&
          articles.map(({ imgUrl, title, date, linkPath, categoryType, thumbnailImg }, index) => {
            if (selectedCategory === 'all' || categoryType === selectedCategory) {
              return (
                <BlogCard
                  key={index}
                  imgUrl={thumbnailImg}
                  title={title}
                  date={date}
                  linkPath={linkPath}
                  type={'standard'}
                />
              );
            }
          })}
        {!articles?.length && <span>{'List is empty'}</span>}
      </div>
    </div>
  );
};

export default React.memo(Categories);
