// Per-persona animated hero backgrounds, self-hosted (hashed into /_astro,
// cached immutably). They used to be Giphy URLs set as a CSS background
// image: the recruiter one alone was a 2.4 MB animated WebP that the browser
// only discovered after the CSS loaded, making it the page's LCP (16.7 s on
// PageSpeed's mobile run). Now each is a short muted video plus a tiny poster
// frame that is preloaded and paints immediately.
//
// Encoded from Giphy's MP4 renditions with ffmpeg:
//   webm:   -an -c:v libvpx-vp9 -b:v 0 -crf 40 -row-mt 1 -deadline good -cpu-used 1
//   mp4:    -an -c:v libopenh264 -b:v 250k -movflags +faststart   (Safari < 17.4 fallback)
//   poster: -vframes 1 -c:v libwebp -quality 75
import type { ImageMetadata } from 'astro';
import type { ProfileType } from './personas';

import recruiterWebm from 'images/backgrounds/recruiter.webm';
import recruiterMp4 from 'images/backgrounds/recruiter.mp4';
import recruiterPoster from 'images/backgrounds/recruiter-poster.webp';
import engineerWebm from 'images/backgrounds/engineer.webm';
import engineerMp4 from 'images/backgrounds/engineer.mp4';
import engineerPoster from 'images/backgrounds/engineer-poster.webp';
import collaboratorWebm from 'images/backgrounds/collaborator.webm';
import collaboratorMp4 from 'images/backgrounds/collaborator.mp4';
import collaboratorPoster from 'images/backgrounds/collaborator-poster.webp';
import explorerWebm from 'images/backgrounds/explorer.webm';
import explorerMp4 from 'images/backgrounds/explorer.mp4';
import explorerPoster from 'images/backgrounds/explorer-poster.webp';

export interface HeroBackground {
  webm: string;
  mp4: string;
  poster: ImageMetadata;
}

export const heroBackground: Record<ProfileType, HeroBackground> = {
  // Dwight (The Office) holding up his three résumés.
  recruiter: { webm: recruiterWebm, mp4: recruiterMp4, poster: recruiterPoster },
  // Pixel-art hooded ape coding at a desk in headphones.
  engineer: { webm: engineerWebm, mp4: engineerMp4, poster: engineerPoster },
  // Captain Planet — "by your powers combined".
  collaborator: { webm: collaboratorWebm, mp4: collaboratorMp4, poster: collaboratorPoster },
  // Snowboarder carving down a mountain (National Geographic).
  explorer: { webm: explorerWebm, mp4: explorerMp4, poster: explorerPoster },
};
