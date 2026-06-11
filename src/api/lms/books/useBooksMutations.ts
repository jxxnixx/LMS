import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { createBooks, removeBooksId, modifyBooksId, modifyBooksIdLike } from './booksAPI';
import {
  createBook_Body,
  createBook_Response,
  deleteBook_Params,
  deleteBook_Response,
  updateBook_Params,
  updateBook_Body,
  updateBook_Response,
  toggleLike_Params,
  toggleLike_Response
} from '@/types/lms/validated';

export const useCreateBooksMutation = ()
: UseMutationResult<createBook_Response, Error, createBook_Body> => {
  return useMutation({
    mutationFn: (body) => createBooks(body),
  });
};

export const useRemoveBooksIdMutation = ()
: UseMutationResult<deleteBook_Response, Error, deleteBook_Params> => {
  return useMutation({
    mutationFn: (params) => removeBooksId(params),
  });
};

export const useModifyBooksIdMutation = ()
: UseMutationResult<updateBook_Response, Error, { params: updateBook_Params; body: updateBook_Body }> => {
  return useMutation({
    mutationFn: ({ params, body }) => modifyBooksId(params, body),
  });
};

export const useModifyBooksIdLikeMutation = ()
: UseMutationResult<toggleLike_Response, Error, toggleLike_Params> => {
  return useMutation({
    mutationFn: (params) => modifyBooksIdLike(params),
  });
};
