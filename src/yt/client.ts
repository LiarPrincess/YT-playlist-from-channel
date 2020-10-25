import { youtube_v3 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export type Youtube = youtube_v3.Youtube;

export function createYoutubeClient(auth: OAuth2Client): Youtube {
  return new youtube_v3.Youtube({ auth });
}
