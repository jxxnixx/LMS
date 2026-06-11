import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { createAiImage, createAiChat } from './aiAPI';
import {
  image_Body,
  image_Response,
  chat_Body,
  chat_Response
} from '@/types/lms/validated';

export const useCreateAiImageMutation = ()
: UseMutationResult<image_Response, Error, image_Body> => {
  return useMutation({
    mutationFn: (body) => createAiImage(body),
  });
};

export const useCreateAiChatMutation = ()
: UseMutationResult<chat_Response, Error, chat_Body> => {
  return useMutation({
    mutationFn: (body) => createAiChat(body),
  });
};
