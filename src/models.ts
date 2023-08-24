export interface ISongShowPlusSong {
  songNumber: string;
  title: string;
  artist: string;
  copyright: string;
  ccli: string;
  key: string;
  keywords: string[];
  lyricSections: ISongShowPlusLyricSection[];
}
export interface ISongShowPlusLyricSection {
  title: string;
  lyrics: string;
}
