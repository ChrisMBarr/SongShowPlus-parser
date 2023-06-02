export interface ISongShowPlusSong {
  title: string;
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
