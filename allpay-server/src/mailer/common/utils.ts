import Handlebars from 'handlebars';
import * as fs from 'fs';

export enum LetterType {
  EmailVerification,
  ResetPassword,
}

const layout = fs.readFileSync(
  process.cwd() + '/src/mailer/templates/layout.html',
  'utf8',
);
const emailConfirmation = fs.readFileSync(
  process.cwd() + '/src/mailer/templates/email-confirmation.html',
  'utf8',
);
const resetPassword = fs.readFileSync(
  process.cwd() + '/src/mailer/templates/reset-password.html',
  'utf8',
);

Handlebars.registerPartial('layout', layout);
const compileLetter = (letter: string, params: Record<string, string>) => {
  return Handlebars.compile(letter)(params);
};
const compileEmailVerificationLetter = (params: {
  message: string;
  verificationUrl: string;
}) => ({
  subject: 'Email verification',
  html: compileLetter(emailConfirmation, params),
  text:
    `${params.message}` +
    `Click on the following link to finish registration: ${params.verificationUrl}`,
});

const compileResetPasswordLetter = (params: {
  message: string;
  verificationUrl: string;
}) => ({
  subject: 'Reset password',
  html: compileLetter(resetPassword, params),
  text:
    `${params.message}` +
    `To change your password, please click on the following link: ${params.verificationUrl}`,
});

export const LetterCompiler = {
  [LetterType.EmailVerification]: compileEmailVerificationLetter,
  [LetterType.ResetPassword]: compileResetPasswordLetter,
};
