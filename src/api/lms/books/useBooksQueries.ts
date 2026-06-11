import { useQuery, useSuspenseQuery, UseQueryResult, UseSuspenseQueryResult } from '@tanstack/react-query';
import { fetchBooks, fetchBooksId } from './booksAPI';
import {
  getBooks_Params,
  getBooks_Response,
  getBook_Params,
  getBook_Response
} from '@/types/lms/validated';

export const useFetchBooksQuery = (params: getBooks_Params, enabled?: boolean)
: UseQueryResult<getBooks_Response, Error> => {
  return useQuery({
    queryKey: ['fetchBooks', params],
    queryFn: () => fetchBooks(params),
    enabled: enabled,
  });
};

export const useSuspenseFetchBooksQuery = (params: getBooks_Params)
: UseSuspenseQueryResult<getBooks_Response, Error> => {
  return useSuspenseQuery({
    queryKey: ['fetchBooks', params],
    queryFn: () => fetchBooks(params),
  });
};

export const useFetchBooksIdQuery = (params: getBook_Params, enabled?: boolean)
: UseQueryResult<getBook_Response, Error> => {
  return useQuery({
    queryKey: ['fetchBooksId', params],
    queryFn: () => fetchBooksId(params),
    enabled: enabled,
  });
};

export const useSuspenseFetchBooksIdQuery = (params: getBook_Params)
: UseSuspenseQueryResult<getBook_Response, Error> => {
  return useSuspenseQuery({
    queryKey: ['fetchBooksId', params],
    queryFn: () => fetchBooksId(params),
  });
};
