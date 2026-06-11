import { useQuery, useSuspenseQuery, UseQueryResult, UseSuspenseQueryResult } from '@tanstack/react-query';
import { fetchGenres } from './genresAPI';
import {
  getGenres_Params,
  getGenres_Response
} from '@/types/lms/validated';

export const useFetchGenresQuery = (params: getGenres_Params, enabled?: boolean)
: UseQueryResult<getGenres_Response, Error> => {
  return useQuery({
    queryKey: ['fetchGenres', params],
    queryFn: () => fetchGenres(params),
    enabled: enabled,
  });
};

export const useSuspenseFetchGenresQuery = (params: getGenres_Params)
: UseSuspenseQueryResult<getGenres_Response, Error> => {
  return useSuspenseQuery({
    queryKey: ['fetchGenres', params],
    queryFn: () => fetchGenres(params),
  });
};
