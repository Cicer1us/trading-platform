import { Asset } from 'contentful';

export interface CmsArticle {
  seoTitle: string;
  seoDescription: string;
  title: string;
  slug: string;
  body: string;
  cover: Asset;
  thumbnailImage: Asset;
  label: string[];
}
