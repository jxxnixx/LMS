import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { createAuthSignup, createAuthSendCode, createAuthLogin, createAuthCheckCode } from './authAPI';
import {
  signup_Body,
  signup_Response,
  sendCode_Body,
  sendCode_Response,
  login_Body,
  login_Response,
  checkCode_Body,
  checkCode_Response
} from '@/types/lms/validated';

export const useCreateAuthSignupMutation = ()
: UseMutationResult<signup_Response, Error, signup_Body> => {
  return useMutation({
    mutationFn: (body) => createAuthSignup(body),
  });
};

export const useCreateAuthSendCodeMutation = ()
: UseMutationResult<sendCode_Response, Error, sendCode_Body> => {
  return useMutation({
    mutationFn: (body) => createAuthSendCode(body),
  });
};

export const useCreateAuthLoginMutation = ()
: UseMutationResult<login_Response, Error, login_Body> => {
  return useMutation({
    mutationFn: (body) => createAuthLogin(body),
  });
};

export const useCreateAuthCheckCodeMutation = ()
: UseMutationResult<checkCode_Response, Error, checkCode_Body> => {
  return useMutation({
    mutationFn: (body) => createAuthCheckCode(body),
  });
};
