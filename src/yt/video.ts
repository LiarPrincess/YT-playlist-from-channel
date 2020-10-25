import { youtube_v3 } from 'googleapis';

import { Youtube } from './client';
import { validateResponse } from './common';

interface VideosListParams {
  /**
   * Return videos with the given ids.
   */
  id?: string[];
  /**
   * The <code><strong>maxResults</strong></code> parameter specifies the maximum number of items that should be returned in the result set.<br><br><strong>Note:</strong> This parameter is supported for use in conjunction with the <code><a href="#myRating">myRating</a></code> and <code><a href="#chart">chart</a></code> parameters, but it is not supported for use in conjunction with the <code><a href="#id">id</a></code> parameter.
   */
  maxResults?: number;
  /**
   * The <code><strong>pageToken</strong></code> parameter identifies a specific page in the result set that should be returned. In an API response, the <code>nextPageToken</code> and <code>prevPageToken</code> properties identify other pages that could be retrieved.<br><br><strong>Note:</strong> This parameter is supported for use in conjunction with the <code><a href="#myRating">myRating</a></code> and <code><a href="#chart">chart</a></code> parameters, but it is not supported for use in conjunction with the <code><a href="#id">id</a></code> parameter.
   */
  pageToken?: string;
}

export type VideoListResponse = youtube_v3.Schema$VideoListResponse;

export async function videosList(client: Youtube, params: VideosListParams): Promise<VideoListResponse> {
  const response = await client.videos.list({
    part: ['id', 'snippet'],
    id: params.id,
    maxResults: params.maxResults,
    pageToken: params.pageToken
  });

  validateResponse(response);
  return response.data;
}
