import * as yt from './yt';
import { promises as fs } from 'fs';
import { getAllVideosFromChannelHtml } from './getAllVideosFromChannelHtml';

const htmlFile = './bernadette-banner.html';
const playlistTitle = 'Bernadette Banner - All videos - 2020-10-09';
const creator = 'Bernadette Banner';

(async () => {
  try {
    const auth = await yt.authorize();
    const client = yt.createYoutubeClient(auth);

    const playlist = await getOrCreatePlaylist(client, playlistTitle, 'private');
    const playlistId = playlist.id;

    if (!playlistId) {
      throw new Error('Playlist object does not contain id.');
    }

    const items = await getItems(client, playlistId);
    const existingItemIds = getItemIds(items);

    const html = await fs.readFile(htmlFile, 'utf-8');
    const videos = getAllVideosFromChannelHtml(html);

    for (const video of videos) {
      const isByCreator = video.ariaLabel.includes(creator);
      if (!isByCreator) {
        continue;
      }

      const videoId = video.id;

      if (existingItemIds.has(videoId)) {
        console.log(`Already exists: ${video.title} (id: ${video.id})`);
      } else {
        console.log(`Adding: ${video.title} (id: ${video.id})`);
        await yt.playlistItemsInsert(client, { playlistId, videoId });
      }
    }

    console.log('Finished!');
  } catch (error) {
    if (error.message == 'invalid_grant') {
      console.log('Insufficient permissions for given token/authorization code:');
    }

    if (error.errors) {
      console.log('Errors:');
      for (const e of error.errors) {
        const message = e.message;
        const domain = e.domain;
        const reason = e.reason;
        const location = e.location;
        const locationType = e.locationType;
        console.log(`- domain: ${domain}, reason: ${reason}, location: ${location}, locationType: ${locationType}, message: ${message}`);
      }
    }

    console.log(error);
  }
})();

async function getOrCreatePlaylist(client: yt.Youtube, title: string, privacy: yt.PlaylistPrivacy) {
  const existingPlaylists = await yt.playlistsList(client, {
    mine: true,
    maxResults: 50
  });

  const existingPlaylist = existingPlaylists.items?.find(p => p.snippet?.title == title);
  if (existingPlaylist) {
    console.log(`Found existing playlist: '${title}'`);
    return existingPlaylist;
  }

  console.log(`Creating new playlist: '${title}'`);
  const newPlaylist = await yt.playlistsInsert(client, {
    title: title,
    privacy
  });

  return newPlaylist;
}

async function getItems(client: yt.Youtube, playlistId: string): Promise<yt.PlaylistItem[]> {
  const result: yt.PlaylistItem[] = [];
  let nextPageToken: string | undefined;

  do {
    const response = await yt.playlistItemsList(client, {
      playlistId: playlistId,
      maxResults: 50,
      pageToken: nextPageToken
    });

    if (response.items) {
      result.push(...response.items);
    }

    nextPageToken = response.nextPageToken || undefined;
  } while (nextPageToken);

  if (result.length) {
    console.log(`Playlist already contains ${result.length} items`);
  } else {
    console.log('Playlist is empty');
  }

  return result;
}

function getItemIds(items: yt.PlaylistItem[]): Set<string> {
  const result = new Set<string>();

  for (const item of items) {
    const videoId = item.snippet?.resourceId?.videoId;
    if (videoId) {
      result.add(videoId);
    }
  }

  return result;
}
