import { MAX_SLIPPAGE, MIN_SLIPPAGE } from 'src/pagesComponents/payment/walletMenu/utils';
import * as yup from 'yup';

export const yupLoginSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(5).required(),
  rememberMe: yup.bool()
});

export const yupRegisterSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(5).required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'passwords does not match')
    .required(),
  privacyPolicy: yup.bool().isTrue('privacy policy must be accepted').required()
});

export const yupForgotPasswordSchema = yup.object().shape({
  email: yup.string().email().required()
});

export const yupResetPasswordSchema = yup.object().shape({
  password: yup.string().min(5).required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'passwords does not match')
    .required()
});

export const yupAddSubscriptionUrlSchema = yup.object().shape({
  // TODO: change from .urp() to custom regex
  subscriptionUrl: yup.string().url().required()
});

export const yupWalletAddressSchema = yup.object().shape({
  walletAddress: yup
    .string()
    .matches(/^0x[a-fA-F0-9]{40}$/)
    .required()
});

export const slippageSchema = yup.object().shape({
  slippage: yup.number().min(MIN_SLIPPAGE).max(MAX_SLIPPAGE)
});
