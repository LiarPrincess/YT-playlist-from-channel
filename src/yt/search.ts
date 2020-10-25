import { youtube_v3 } from 'googleapis';

import { Youtube } from './client';
import { validateResponse } from './common';

interface SearchListParams {
  /**
   * Textual search terms to match.
   */
  q?: string;
  /**
   * The <code><strong>maxResults</strong></code> parameter specifies the maximum number of items that should be returned in the result set.
   */
  maxResults?: number;
  /**
   * Sort order of the results.
   */
  order?: 'date' | 'rating' | 'relevance' | 'title' | 'videoCount' | 'viewCount';
  /**
   * The <code><strong>pageToken</strong></code> parameter identifies a specific page in the result set that should be returned. In an API response, the <code>nextPageToken</code> and <code>prevPageToken</code> properties identify other pages that could be retrieved.
   */
  pageToken?: string;
  /**
   * Restrict results to a particular set of resource types from One Platform.
   */
  type?: ('channel' | 'playlist' | 'video')[];
  /**
   * Indicates whether the search results should include restricted content as well as standard content.
   */
  safeSearch?: 'moderate' | 'none' | 'strict';
}

export type SearchListResponse = youtube_v3.Schema$SearchListResponse;

export async function searchList(client: Youtube, params: SearchListParams): Promise<SearchListResponse> {
  const response = await client.search.list({
    part: ['snippet'],
    ...params
  });

  validateResponse(response);
  return response.data;
}
