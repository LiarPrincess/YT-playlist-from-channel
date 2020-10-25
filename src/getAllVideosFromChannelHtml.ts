import * as cheerio from 'cheerio';

interface YouTubeVideo {
  readonly id: string;
  readonly title: string;
  readonly ariaLabel: string;
}

export function getAllVideosFromChannelHtml(html: string): YouTubeVideo[] {
  const $ = cheerio.load(html);

  // <a id="video-title"
  //    class="yt-simple-endpoint style-scope ytd-grid-video-renderer"
  //    aria-label="My Victorian/Witchy/Dark Academia Wardrobe | Fighting Fast Fashion by Bernadette Banner 2 months ago 18 minutes 448,843 views"
  //    title="My Victorian/Witchy/Dark Academia Wardrobe | Fighting Fast Fashion"
  //    href="/watch?v=6HXhW6nTCuo" >
  // My Victorian/Witchy/Dark Academia Wardrobe | Fighting Fast Fashion
  // </a>

  const elements = $('#video-title');
  if (!elements.length) {
    throw new Error('Unable to find video nodes');
  }

  const result: YouTubeVideo[] = [];
  elements.each((index, element) => {
    // If you want nested: then cheerio.load(element)

    if (element.name != 'a') {
      return;
    }

    const href = element.attribs['href'];
    const title = element.attribs['title'];
    const ariaLabel = element.attribs['aria-label'];

    const id = href
      .replace('/watch?v=', '')
      .replace(/&t=\d*s/, '');

    result.push({ id, title, ariaLabel });
  });

  return result;
}
