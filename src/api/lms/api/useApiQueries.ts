import { useQuery, useSuspenseQuery, UseQueryResult, UseSuspenseQueryResult } from '@tanstack/react-query';
import { fetchApiNaver } from './apiAPI';
import {
  proxy_Params,
  proxy_Response
} from '@/types/lms/validated';

export const useFetchApiNaverQuery = (params: proxy_Params, enabled?: boolean)
: UseQueryResult<proxy_Response, Error> => {
  return useQuery({
    queryKey: ['fetchApiNaver', params],
    queryFn: () => fetchApiNaver(params),
    enabled: enabled,
  });
};

export const useSuspenseFetchApiNaverQuery = (params: proxy_Params)
: UseSuspenseQueryResult<proxy_Response, Error> => {
  return useSuspenseQuery({
    queryKey: ['fetchApiNaver', params],
    queryFn: () => fetchApiNaver(params),
  });
};
