import { useState } from 'react';

export const filterByOrderOptions = ['All', 'With order', 'Without order'] as const;
export type FilterByOrder = typeof filterByOrderOptions[number];
export type NftsSearchFilters = {
  filterByOrderOption?: FilterByOrder;
  searchQuery?: string;
};

export const useNftSearchFilters = () => {
  const [nftsSearchFilters, setNftsSearchFilters] = useState<NftsSearchFilters>({ filterByOrderOption: 'All' });

  return {
    nftsSearchFilters,
    setNftsSearchFilters,
  };
};

export type ManageNftSearchFilters = ReturnType<typeof useNftSearchFilters>;
