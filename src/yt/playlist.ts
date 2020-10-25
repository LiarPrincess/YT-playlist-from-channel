import { youtube_v3 } from 'googleapis';

import { Youtube } from './client';
import { validateResponse } from './common';

export type Playlist = youtube_v3.Schema$Playlist;
export type PlaylistPrivacy = 'private' | 'public' | 'unlisted';

/* ============ */
/* === List === */
/* ============ */

interface PlaylistsListParams {
  /**
   * Return the playlists owned by the specified channel ID.
   */
  channelId?: string;
  /**
   * Return the playlists with the given IDs for Stubby or Apiary.
   */
  id?: string[];
  /**
   * The <code><strong>maxResults</strong></code> parameter specifies the maximum number of items that should be returned in the result set.
   * The default value is 5.
   */
  maxResults?: number;
  /**
   * Return the playlists owned by the authenticated user.
   */
  mine?: boolean;
  /**
   * The <code><strong>pageToken</strong></code> parameter identifies a specific page in the result set that should be returned. In an API response, the <code>nextPageToken</code> and <code>prevPageToken</code> properties identify other pages that could be retrieved.
   */
  pageToken?: string;
}

export type PlaylistListResponse = youtube_v3.Schema$PlaylistListResponse;

export async function playlistsList(client: Youtube, params: PlaylistsListParams): Promise<PlaylistListResponse> {
  const response = await client.playlists.list({
    part: ['id', 'snippet', 'status'],
    channelId: params.channelId,
    id: params.id,
    maxResults: params.maxResults,
    mine: params.mine,
    pageToken: params.pageToken
  });

  validateResponse(response);
  return response.data;
}

/* ============== */
/* === Insert === */
/* ============== */

interface PlaylistsInsertParams {
  /**
   * The playlist&#39;s title.
   */
  title: string;
  /**
   * The playlist&#39;s description.
   */
  description?: string;
  /**
   * The playlist&#39;s privacy status.
   */
  privacy?: PlaylistPrivacy;
}

export async function playlistsInsert(client: Youtube, params: PlaylistsInsertParams): Promise<Playlist> {
  const response = await client.playlists.insert({
    part: ['id', 'snippet', 'status'],
    requestBody: {
      kind: 'youtube#playlist',
      snippet: {
        title: params.title,
        description: params.description
      },
      status: {
        privacyStatus: params.privacy,
      }
    }
  });

  validateResponse(response);
  return response.data;
}
