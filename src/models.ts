export interface ISongShowPlusSong {
  title: string;
  artist: string;
  copyright: string;
  ccli: string;
  keywords: string[];
  sections: ISongShowPlusSection[];
}
export interface ISongShowPlusSection {
  title: string;
  lyrics: string;
}
