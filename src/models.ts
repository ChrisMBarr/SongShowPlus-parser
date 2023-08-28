export class SongShowPlusSong {
  id = ''; //not entirely sure what this number represents!
  title = '';
  author = '';
  copyright = '';
  ccli = '';
  key = '';
  comments = '';
  verseOrder = '';
  songBook = '';
  songNumber = '';
  topics: Array<string> = [];
  lyricSections: Array<ISongShowPlusLyricSection> = [];
}

export interface ISongShowPlusLyricSection {
  title: string;
  lyrics: string;
}

export const enum Block {
  TITLE = 1,
  AUTHOR = 2,
  COPYRIGHT = 3,
  CCLI_NO = 5,
  KEY = 11,
  VERSE = 12,
  CHORUS = 20,
  BRIDGE = 24,
  TOPIC = 29,
  COMMENTS = 30,
  VERSE_ORDER = 31,
  SONG_BOOK = 35,
  SONG_NUMBER = 36,
  CUSTOM_VERSE = 37,
  FILE_START = 38,
}

export interface ISongSectionBufferInfo {
  type: Block;
  nextBlockStart: number;
  blockLength: number;
  readFrom: number;
  readTo: number;
  newByteOffset: number;
}

export interface IBlockLength {
  startOffset: number;
  blockLength: number;
}

export interface ISongSection {
  bufferInfo: ISongSectionBufferInfo;
  content: string;
  lyrics?: string;
}
