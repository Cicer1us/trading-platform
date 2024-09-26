export type CryptoPanicPostsResponse = CryptoPanicResponse<CryptoPanicPost[]>;

export interface CryptoPanicResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T;
}

export interface CryptoPanicPost {
  king: string;
  domain: string;
  votes: CryptoPanicVotes;
  source: CryptoPanicSource;
  title: string;
  slug: string;
  published_at: string;
  id: number;
  url: string;
  created_at: string;
  currencies?: CryptoPanicCurrency[];
}

interface CryptoPanicVotes {
  negative: number;
  positive: number;
  important: number;
  liked: number;
  disliked: number;
  lol: number;
  toxic: number;
  saved: number;
  comments: number;
}

interface CryptoPanicSource {
  title: string;
  region: string;
  domain: string;
  path: string | null;
}

interface CryptoPanicCurrency {
  code: string;
  title: string;
  slug: string;
  url: string;
}
