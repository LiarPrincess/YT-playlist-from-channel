import { youtube_v3 } from 'googleapis';

import { Youtube } from './client';
import { validateResponse } from './common';

export type PlaylistItem = youtube_v3.Schema$PlaylistItem;

/* ============ */
/* === List === */
/* ============ */

interface PlaylistItemsListParams {
  /**
   *
   */
  id?: string[];
  /**
   * The <code><strong>maxResults</strong></code> parameter specifies the maximum number of items that should be returned in the result set.
   */
  maxResults?: number;
  /**
   * The <code><strong>pageToken</strong></code> parameter identifies a specific page in the result set that should be returned. In an API response, the <code>nextPageToken</code> and <code>prevPageToken</code> properties identify other pages that could be retrieved.
   */
  pageToken?: string;
  /**
   * Return the playlist items within the given playlist.
   */
  playlistId?: string;
  /**
   * Return the playlist items associated with the given video ID.
   */
  videoId?: string;
}

export type PlaylistItemListResponse = youtube_v3.Schema$PlaylistItemListResponse;

export async function playlistItemsList(client: Youtube, params: PlaylistItemsListParams): Promise<PlaylistItemListResponse> {
  const response = await client.playlistItems.list({
    part: ['id', 'snippet', 'status'],
    ...params
  });

  validateResponse(response);
  return response.data;
}

/* ============== */
/* === Insert === */
/* ============== */

interface PlaylistItemsInsertParams {
  /**
   * The ID that YouTube uses to uniquely identify the playlist that the playlist item is in.
   */
  playlistId: string;
  /**
   * The ID that YouTube uses to uniquely identify the referred video.
   */
  videoId: string;
}

export async function playlistItemsInsert(client: Youtube, params: PlaylistItemsInsertParams): Promise<PlaylistItem> {
  const response = await client.playlistItems.insert({
    part: ['id', 'snippet', 'status'],
    requestBody: {
      snippet: {
        playlistId: params.playlistId,
        resourceId: {
          kind: 'youtube#video',
          videoId: params.videoId
        }
      }
    }
  });

  validateResponse(response);
  return response.data;
}

/* ============== */
/* === Delete === */
/* ============== */

export async function playlistItemsDelete(client: Youtube, itemId: string) {
  await client.playlistItems.delete({
    id: itemId
  });
}
