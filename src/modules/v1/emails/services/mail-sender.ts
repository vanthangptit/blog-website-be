import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import Mail from 'nodemailer/lib/mailer';

import conf from '../../../../config';
import {
  confirmMail,
  resetPassword
} from '../../../../domain/email-templates';
import {
  IMailOptions
} from '../../../../domain/interfaces';

const {
  googleClientId,
  googleClientSecret,
  googleRedirectUri,
  googleRefreshToken,
  googleUserVerified
} = conf;

const OAuth2Client = new google.auth.OAuth2(
  googleClientId,
  googleClientSecret,
  googleRedirectUri,
);

OAuth2Client.setCredentials({
  refresh_token: googleRefreshToken
});

const accessToken = async () => await OAuth2Client.getAccessToken();

const createTransporter = async () => {
  try {
    const transporter: Mail = nodemailer.createTransport({
      secure: true,
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: googleUserVerified,
        clientId: googleClientId,
        clientSecret: googleClientSecret,
        refreshToken: googleRefreshToken,
        accessToken: `${await accessToken()}`
      },
    });

    return transporter;
  } catch (err: any) {
    console.log('ERROR::createTransporter - ', err)
  }
};

const sendMail = async (mailOptions: IMailOptions) => {
  try {
    let emailTransporter = await createTransporter();

    return new Promise(resolve =>
      emailTransporter?.sendMail(mailOptions, async error => {
        if (error) {
          console.log('Mail sending failed, check your service credentials.');
          resolve(false);
        }
        resolve(true);
      })
    );
  } catch (err) {
    console.log('ERROR::sendMail - ', err)
  }
};

export const sendVerifyEmailMail = async (
  emailTo: string,
  fullName: string,
  token: string
) => {
  const subject: any = conf.email.subject.login
    .replace(new RegExp('--Username--', 'g'), fullName);
  const buttonLink = `${conf.email.mailVerificationUrl}?token=${token}`;

  const mail = confirmMail
    .replace(new RegExp('--PersonName--', 'g'), fullName)
    .replace(new RegExp('--ProjectName--', 'g'), conf.email.name)
    .replace(new RegExp('--ProjectColor--', 'g'), conf.email.color)
    .replace(new RegExp('--ButtonLink--', 'g'), buttonLink)
    .replace(new RegExp('--ClickTracking--', 'g'), conf.email.clickTrackingValue)
    .replace(new RegExp('--TermsOfServiceLink--', 'g'), conf.email.termsOfServiceUrl);

  const mailOptions = {
    from: conf.email.from,
    to: emailTo,
    subject,
    html: mail,
  };

  await sendMail(mailOptions);
};

// export const sendForgotPasswordEmailMail = async (emailTo, username, code) => {
//   const subject = conf.email.subject.resetPassword;
//   const buttonLink = conf.email.resetPasswordUrl;
//
//   const mail = resetPassword
//     .replace(new RegExp('--PersonName--', 'g'), username)
//     .replace(new RegExp('--ProjectColor--', 'g'), conf.email.color)
//     .replace(new RegExp('--ButtonLink--', 'g'), buttonLink)
//     .replace(new RegExp('--ClickTracking--', 'g'), conf.email.clickTrackingValue)
//     .replace(new RegExp('--TokenCode--', 'g'), code);
//
//   const mailOptions = {
//     from: conf.email.from,
//     to: emailTo,
//     subject,
//     html: mail,
//   };
//
//   await sendMail(mailOptions);
// };
