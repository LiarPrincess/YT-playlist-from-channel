import { promises as fs } from 'fs';
import { Credentials, OAuth2Client } from 'google-auth-library';

/**
 * https://developers.google.com/youtube/v3/guides/auth/server-side-web-apps#identify-access-scopes
 */
enum AuthorizationScope {
  /** Manage your YouTube account */
  youtube = 'https://www.googleapis.com/auth/youtube',
  /** View your YouTube account */
  readonly = 'https://www.googleapis.com/auth/youtube.readonly'
}

/**
 * Path to 'client_secret' obtained from YouTube.
 * See: https://developers.google.com/youtube/v3/quickstart/nodejs.
 */
const clientSecretFile = './client_secret.json';
/**
 * Path to cached token.
 */
const tokenFile = './client_token.json';
/**
 * Code obtained from user used as proof that they allow us to use their data.
 * Used when requesting new token from YouTube.
 */
const authorizationCodeFile = './client_authorization_code.json';
/**
 * Scopes that we will request from user.
 */
const authorizationCodeScope = [AuthorizationScope.youtube];

export async function authorize(): Promise<OAuth2Client> {
  const secret = await readClientSecret(clientSecretFile);

  const clientSecret = secret.installed.client_secret;
  const clientId = secret.installed.client_id;
  const redirectUrl = secret.installed.redirect_uris[0];
  const client = new OAuth2Client(clientId, clientSecret, redirectUrl);

  // Do we have cached token?
  try {
    const token = await readToken(tokenFile);
    client.credentials = token;
    return client;
  } catch (error) { }

  // No token?
  // We will try to request a new one.
  let authorizationCode: string;
  try {
    authorizationCode = await readAuthorizationCode(authorizationCodeFile);
  } catch (error) {
    const authorizationLink = client.generateAuthUrl({
      access_type: 'offline',
      scope: authorizationCodeScope
    });

    throw new Error(`Unable to read authorization code from: '${authorizationCodeFile}'. You can obtain code at: '${authorizationLink}'.`);
  }

  const tokenResponse = await client.getToken(authorizationCode);
  const token = tokenResponse.tokens;

  await writeToken(tokenFile, token);

  client.credentials = token;
  return client;
}

/* ============== */
/* === Secret === */
/* ============== */

/** Client secret, so we know which app requests permissions. */
interface ClientSecret {
  installed: {
    client_id: string;
    project_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_secret: string;
    redirect_uris: string[];
  };
}

async function readClientSecret(path: string): Promise<ClientSecret> {
  try {
    const string = await fs.readFile(path, 'utf-8');
    const json = JSON.parse(string);
    return json as ClientSecret;
  } catch (error) {
    throw new Error(`Unable to read client secret from: '${path}'. You can learn how to obtain such file at: 'https://developers.google.com/youtube/v3/quickstart/nodejs'.`);
  }
}

/* ============= */
/* === Token === */
/* ============= */

async function readToken(path: string): Promise<Credentials> {
  try {
    const string = await fs.readFile(path, 'utf-8');
    const json = JSON.parse(string);
    return json as Credentials;
  } catch (error) {
    throw new Error(`Unable to read token from: '${path}'. To obtain new token call 'requestNewToken'.`);
  }
}

async function writeToken(path: string, token: Credentials) {
  const json = JSON.stringify(token);
  await fs.writeFile(path, json, 'utf-8');
}

/* ============ */
/* === Code === */
/* ============ */

/** User authorization code, so we can create new Token (if needed). */
type AuthorizationCode = string;

async function readAuthorizationCode(path: string): Promise<AuthorizationCode> {
  try {
    const string = await fs.readFile(path, 'utf-8');
    return string.trim();
  } catch (error) {
    throw new Error(`Unable to read authorization code from: '${path}'.`);
  }
}
