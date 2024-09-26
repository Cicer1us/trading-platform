export type LoginParams = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type RegisterParams = {
  email: string;
  password: string;
};

export type User = {
  id: number;
  email: string;
  apiKey: string;
  walletAddress?: string;
  subscriptionSecret: string;
  subscriptionUrls: string[];
  createdAt: string;
  updatedAt: string;
  twoFactorAuthEnabled: boolean;
};

export type AuthValuesType = {
  user: User | null;
  setUser: (value: User | null) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  login: (accessToken: string) => void;
  logout: () => void;
};
