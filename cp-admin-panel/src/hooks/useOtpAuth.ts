import { useQuery, useMutation } from '@tanstack/react-query';
import {
  OtpAuthValidateRequestBody,
  OtpAuthVerifyRequestBody,
  otpAuthGenerate,
  otpAuthValidate,
  otpAuthVerify,
  outAuthDisable
} from 'src/api/merchant/auth';

export const otpAuthQueryKey = 'otpAuthGenerate';

export const useOtpAuthGenerateCode = () => {
  return useQuery({
    queryKey: [otpAuthQueryKey],
    queryFn: () => otpAuthGenerate(),
    cacheTime: Infinity,
    staleTime: Infinity,
    refetchOnWindowFocus: false
  });
};

//send on 2fa setup
export const useMutateOtpAuthVerify = () => {
  return useMutation({
    mutationFn: (params: OtpAuthVerifyRequestBody) => otpAuthVerify(params)
  });
};

export const useMutateOtpAuthDisable = () => {
  return useMutation({
    mutationFn: () => outAuthDisable()
  });
};

//send on login
export const useMutateOtpAuthValidate = () => {
  return useMutation({
    mutationFn: (params: OtpAuthValidateRequestBody) => otpAuthValidate(params)
  });
};
