import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

function config() {
  const {
    NODE_ENV: envConf,
    APP_PORT: port,
    MONGO_DB: dbName,
    MONGO_USERNAME_DB: dbUsername,
    MONGO_PASSWORD_DB: dbPassword,
    ACCESS_TOKEN_SECRET: accessTokenKey,
    LENGTH_HASH_SALT: lengthHashSalt,
    // GOOGLE_CLIENT_ID: googleClientId,
    // GOOGLE_CLIENT_SECRET: googleClientSecret,
    // GOOGLE_REDIRECT_URI: googleRedirectUri,
    // GOOGLE_REFRESH_TOKEN: googleRefreshToken,
    // GOOGLE_USER_VERIFIED: googleUserVerified,
  } = process.env;

  const conf = JSON.parse(
    fs.readFileSync(`${__dirname}/../../conf/${envConf ?? 'development'}.json`).toString()
  );

  return {
    ...conf,
    port,
    dbName,
    dbUsername,
    dbPassword,
    accessTokenKey,
    lengthHashSalt,
    // googleClientId,
    // googleClientSecret,
    // googleRedirectUri,
    // googleRefreshToken,
    // googleUserVerified
  };
}

export default config();
