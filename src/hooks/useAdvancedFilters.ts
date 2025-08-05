import { useState, useCallback, useMemo } from 'react';

export interface FilterConfig {
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'gte' | 'lt' | 'lte' | 'between' | 'in' | 'notIn';
  value: any;
  type: 'string' | 'number' | 'date' | 'boolean' | 'select';
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface AdvancedFiltersState {
  filters: FilterConfig[];
  sort: SortConfig | null;
  search: string;
  page: number;
  limit: number;
}

const initialState: AdvancedFiltersState = {
  filters: [],
  sort: null,
  search: '',
  page: 1,
  limit: 10,
};

export const useAdvancedFilters = <T>(data: T[] = [], searchFields: (keyof T)[] = []) => {
  const [state, setState] = useState<AdvancedFiltersState>(initialState);

  const addFilter = useCallback((filter: FilterConfig) => {
    setState(prev => ({
      ...prev,
      filters: [...prev.filters.filter(f => f.field !== filter.field), filter],
      page: 1,
    }));
  }, []);

  const removeFilter = useCallback((field: string) => {
    setState(prev => ({
      ...prev,
      filters: prev.filters.filter(f => f.field !== field),
      page: 1,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      filters: [],
      page: 1,
    }));
  }, []);

  const setSort = useCallback((field: string, direction: 'asc' | 'desc') => {
    setState(prev => ({
      ...prev,
      sort: { field, direction },
      page: 1,
    }));
  }, []);

  const clearSort = useCallback(() => {
    setState(prev => ({
      ...prev,
      sort: null,
    }));
  }, []);

  const setSearch = useCallback((search: string) => {
    setState(prev => ({
      ...prev,
      search,
      page: 1,
    }));
  }, []);

  const setPage = useCallback((page: number) => {
    setState(prev => ({
      ...prev,
      page,
    }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setState(prev => ({
      ...prev,
      limit,
      page: 1,
    }));
  }, []);

  const applyFilters = useCallback((item: T): boolean => {
    // Filtre de recherche globale
    if (state.search && searchFields.length > 0) {
      const searchValue = state.search.toLowerCase();
      const matchesSearch = searchFields.some(field => {
        const value = item[field];
        return String(value).toLowerCase().includes(searchValue);
      });
      if (!matchesSearch) return false;
    }

    // Filtres spécifiques
    return state.filters.every(filter => {
      const value = (item as any)[filter.field];
      
      switch (filter.operator) {
        case 'equals':
          return value === filter.value;
        case 'contains':
          return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
        case 'startsWith':
          return String(value).toLowerCase().startsWith(String(filter.value).toLowerCase());
        case 'endsWith':
          return String(value).toLowerCase().endsWith(String(filter.value).toLowerCase());
        case 'gt':
          return Number(value) > Number(filter.value);
        case 'gte':
          return Number(value) >= Number(filter.value);
        case 'lt':
          return Number(value) < Number(filter.value);
        case 'lte':
          return Number(value) <= Number(filter.value);
        case 'between':
          return Number(value) >= Number(filter.value[0]) && Number(value) <= Number(filter.value[1]);
        case 'in':
          return Array.isArray(filter.value) && filter.value.includes(value);
        case 'notIn':
          return Array.isArray(filter.value) && !filter.value.includes(value);
        default:
          return true;
      }
    });
  }, [state.filters, state.search, searchFields]);

  const applySorting = useCallback((a: T, b: T): number => {
    if (!state.sort) return 0;

    const aValue = (a as any)[state.sort.field];
    const bValue = (b as any)[state.sort.field];

    let comparison = 0;
    
    if (aValue < bValue) comparison = -1;
    else if (aValue > bValue) comparison = 1;
    
    return state.sort.direction === 'desc' ? comparison * -1 : comparison;
  }, [state.sort]);

  const filteredAndSortedData = useMemo(() => {
    let result = data.filter(applyFilters);
    
    if (state.sort) {
      result = [...result].sort(applySorting);
    }
    
    return result;
  }, [data, applyFilters, applySorting, state.sort]);

  const paginatedData = useMemo(() => {
    const startIndex = (state.page - 1) * state.limit;
    const endIndex = startIndex + state.limit;
    return filteredAndSortedData.slice(startIndex, endIndex);
  }, [filteredAndSortedData, state.page, state.limit]);

  const totalPages = Math.ceil(filteredAndSortedData.length / state.limit);
  const totalItems = filteredAndSortedData.length;

  const exportFilters = useCallback(() => {
    return JSON.stringify(state);
  }, [state]);

  const importFilters = useCallback((filtersJson: string) => {
    try {
      const importedState = JSON.parse(filtersJson);
      setState(importedState);
    } catch (error) {
      console.error('Error importing filters:', error);
    }
  }, []);

  return {
    // État
    filters: state.filters,
    sort: state.sort,
    search: state.search,
    page: state.page,
    limit: state.limit,
    
    // Actions
    addFilter,
    removeFilter,
    clearFilters,
    setSort,
    clearSort,
    setSearch,
    setPage,
    setLimit,
    
    // Données filtrées
    filteredData: filteredAndSortedData,
    paginatedData,
    totalPages,
    totalItems,
    
    // Utilitaires
    exportFilters,
    importFilters,
    
    // État
    hasActiveFilters: state.filters.length > 0 || state.search.length > 0,
    hasActiveSort: state.sort !== null,
  };
};