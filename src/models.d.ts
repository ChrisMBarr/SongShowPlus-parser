export interface ISongShowPlusSong {
  title: string;
  keywords: string[];
  attributes: ISongShowPlusAttribute[];
  sections: ISongShowPlusSection[];
}
export interface ISongShowPlusAttribute {
  name: string;
  value: string;
}
export interface ISongShowPlusSection {
  title: string;
  lyrics: string;
}
