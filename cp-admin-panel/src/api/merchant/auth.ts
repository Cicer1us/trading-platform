import axios from 'axios';
import { ALLPAY_SERVER_BASE_URL } from 'src/common/constants';
import { User, LoginParams, RegisterParams } from 'src/common/types';

export const getUser = async (storedAccessToken: string): Promise<User> => {
  const { data } = await axios.get(`${ALLPAY_SERVER_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${storedAccessToken}` }
  });

  return data;
};

export type LoginResponse = {
  accessToken: string;
  requiresOtp: boolean;
};

export const loginUser = async (params: LoginParams): Promise<LoginResponse> => {
  const { data } = await axios.post<LoginResponse>(`${ALLPAY_SERVER_BASE_URL}/auth/login`, params);

  return data;
};

export const registerUser = async (params: RegisterParams): Promise<User> => {
  const { data } = await axios.post(`${ALLPAY_SERVER_BASE_URL}/auth/register`, params);

  return data;
};

export const forgotPassword = (email: string): Promise<void> => {
  return axios.post(`${ALLPAY_SERVER_BASE_URL}/auth/forgot-password`, { email });
};

export const resetPassword = (password: string, token: string): Promise<void> => {
  return axios.post(`${ALLPAY_SERVER_BASE_URL}/auth/reset-password`, { password, token });
};

export const verifyEmail = async (token: string): Promise<void> => {
  return await axios.post(`${ALLPAY_SERVER_BASE_URL}/auth/verify-email`, { token });
};

export type OtpAuthGenerateRes = {
  url: string;
  secret: string;
};
export const otpAuthGenerate = async (): Promise<OtpAuthGenerateRes> => {
  const { data } = await axios.post<OtpAuthGenerateRes>(`${ALLPAY_SERVER_BASE_URL}/auth/otp/generate`);

  return data;
};

export type OtpAuthVerifyRequestBody = {
  token: string;
  secret: string;
};
export type OtpAuthSuccessResponse = {
  accessToken: string;
  requiresOtp: boolean;
};
export const otpAuthVerify = async (reqBody: OtpAuthVerifyRequestBody): Promise<OtpAuthSuccessResponse> => {
  const { data } = await axios.post<OtpAuthSuccessResponse>(`${ALLPAY_SERVER_BASE_URL}/auth/otp/verify`, reqBody);

  return data;
};

export type OtpAuthValidateRequestBody = {
  token: string;
};
export const otpAuthValidate = async (reqBody: OtpAuthValidateRequestBody): Promise<OtpAuthSuccessResponse> => {
  const { data } = await axios.post<OtpAuthSuccessResponse>(`${ALLPAY_SERVER_BASE_URL}/auth/otp/validate`, reqBody);

  return data;
};

export const outAuthDisable = async (): Promise<void> => {
  const { data } = await axios.post(`${ALLPAY_SERVER_BASE_URL}/auth/otp/disable`);

  return data;
};
