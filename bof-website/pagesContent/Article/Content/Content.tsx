import React from 'react';
import style from './Content.module.css';
import Markdown from 'markdown-to-jsx';

interface ContentProps {
  content: string;
}

const Content: React.FC<ContentProps> = ({ content }): JSX.Element => {
  const MySubtitleH2 = ({ children, ...props }) => <h2 {...props}>{children}</h2>;
  const MySubtitleH3 = ({ children, ...props }) => <h3 {...props}>{children}</h3>;
  const MySubtitleH4 = ({ children, ...props }) => <h4 {...props}>{children}</h4>;
  const MySubtitleH5 = ({ children, ...props }) => <h5 {...props}>{children}</h5>;
  const MySubtitleH6 = ({ children, ...props }) => <h6 {...props}>{children}</h6>;
  const MyParagraph = ({ children, ...props }) => <p {...props}>{children}</p>;
  const MyLink = ({ children, ...props }) => {
    const relAttributes = props.href?.includes('bitoftrade.com') ? '' : 'nofollow noopener noreferrer';
    return (
      <a rel={relAttributes} {...props}>
        {children}
      </a>
    );
  };
  const MyTable = ({ children }) => {
    return (
      <div className={`${style.table} scroll`}>
        <div className={style.tableContainer} style={{ minWidth: '700px' }}>
          <div className={style.tableGrid}>{children}</div>
        </div>
      </div>
    );
  };
  const MyRow = ({ children }) => <div className={style.tableRow}>{children}</div>;
  const MyCell = ({ children }) => <div className={style.tableCell}>{children}</div>;
  const My = ({ children }) => <>{children}</>;
  const MyList = ({ children, ...props }) => <ul {...props}>{children}</ul>;
  const MyListNumber = ({ children, ...props }) => <ol {...props}>{children}</ol>;
  const MyListItem = ({ children, ...props }) => <li {...props}>{children}</li>;
  const MyImage = ({ children, ...props }) => <img {...props}>{children}</img>;

  return (
    <div className={style.wrapper}>
      <Markdown
        options={{
          wrapper: 'article',
          overrides: {
            h2: { component: MySubtitleH2, props: { className: `${style.subtitle} ${style.subtitleH2}` } },
            h3: { component: MySubtitleH3, props: { className: `${style.subtitle} ${style.subtitleH3}` } },
            h4: { component: MySubtitleH4, props: { className: `${style.subtitle} ${style.subtitleH4}` } },
            h5: { component: MySubtitleH5, props: { className: `${style.subtitle} ${style.subtitleH5}` } },
            h6: { component: MySubtitleH6, props: { className: `${style.subtitle} ${style.subtitleH6}` } },
            p: { component: MyParagraph, props: { className: style.paragraph } },
            a: { component: MyLink, props: { className: style.link } },
            table: { component: MyTable, props: {} },
            thead: { component: My },
            tbody: { component: My },
            tr: { component: MyRow },
            th: { component: MyCell },
            td: { component: MyCell },
            ul: { component: MyList, props: { className: style.list } },
            ol: { component: MyListNumber, props: { className: style.list } },
            li: { component: MyListItem, props: { className: style.listItem } },
            img: { component: MyImage, props: { className: style.image } },
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  );
};

export default React.memo(Content);
