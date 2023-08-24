/* eslint-disable no-unused-vars */
import { ISongShowPlusLyricSection, ISongShowPlusSong } from './models';

enum Block {
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

interface ISongSectionBufferInfo {
  type: Block;
  nextBlockStart: number;
  numBytesFollows: number;
  thisBlockLength: number;
  newByteOffset: number;
}

interface ISongSection {
  type: Block;
  value: string;
  lyricContent?: string;
}

export class SongShowPlus {
  parse(fileBuffer: Buffer): ISongShowPlusSong {
    const sections = this.getSections(fileBuffer);

    let songNumber = '';
    let title = '';
    let artist = '';
    let copyright = '';
    let ccli = '';
    let key = '';
    const keywords: string[] = [];
    const lyricSections: ISongShowPlusLyricSection[] = [];

    const returnObj: ISongShowPlusSong = {
      songNumber,
      title,
      artist,
      copyright,
      ccli,
      key,
      keywords,
      lyricSections,
    };

    // console.log(returnObj);

    return returnObj;
  }

  //------------------------------------------
  //File Parsing
  /**
   * @description Splits up the file by the separators and returns each section as an array of character code numbers
   */
  private getSections(fileBuffer: Buffer): Array<ISongSection> {
    /*
    The SongShow Plus song file format is as follows:

    * Each piece of data in the song file has some information that precedes it.
    * The general format of this data is as follows:
        | 4 Bytes, forming a 32 bit number, a key if you will, this describes what the data is (see Block Enum)
        | 4 Bytes, forming a 32 bit number, which is the number of bytes until the next block starts
        | 1 Byte, which tells how many bytes follows
        | 1 or 4 Bytes, describes how long the string is, if its 1 byte, the string is less than 255
        | The next bytes are the actual data.
        | The next block of data follows on.
    */

    let byteOffset = 0;
    const sections: Array<ISongSection> = [];

    //Convert Node Buffer to an array buffer
    //https://stackoverflow.com/a/71211814/79677
    const arrayBuffer = fileBuffer.buffer.slice(
      fileBuffer.byteOffset,
      fileBuffer.byteOffset + fileBuffer.byteLength
    );
    const dataView = new DataView(arrayBuffer);

    console.log('===============================================================');
    // Loop through the buffer and read bytes based on the context
    while (byteOffset < fileBuffer.byteLength) {
      const sectionInfo = this.getSectionInfo(dataView.buffer, byteOffset);
      byteOffset = sectionInfo.newByteOffset;

      const dataArr = dataView.buffer.slice(byteOffset, byteOffset + sectionInfo.thisBlockLength);
      const sectionContent = this.processCharsAsString(dataArr);

      const thisSection: ISongSection = {
        type: sectionInfo.type,
        value: sectionContent,
      };

      if (
        sectionInfo.type === Block.BRIDGE ||
        sectionInfo.type === Block.CHORUS ||
        sectionInfo.type === Block.VERSE ||
        sectionInfo.type === Block.CUSTOM_VERSE
      ) {
        //extend parsing to look for lyric content
        thisSection.lyricContent = this.getLyrics(
          dataView.buffer,
          byteOffset + sectionInfo.thisBlockLength + 1
        );
      }

      sections.push(thisSection);
      // console.log(sectionInfo, Block[sectionInfo.type], sectionContent);
      byteOffset += sectionInfo.nextBlockStart;
    }

    // console.groupEnd();
    console.log(sections);
    return sections;
  }

  private getLyrics(buffer: ArrayBuffer, lyricStartOffset: number): string {
    const thisBlockLength = new Uint8Array(buffer.slice(lyricStartOffset, lyricStartOffset + 1))[0];
    lyricStartOffset++;

    const content = this.processCharsAsString(
      buffer.slice(lyricStartOffset, lyricStartOffset + thisBlockLength)
    );

    return content;
  }

  private getSectionInfo(buffer: ArrayBuffer, byteOffset: number): ISongSectionBufferInfo {
    const blockLength = 4;

    const type = new Uint32Array(buffer.slice(byteOffset, byteOffset + blockLength))[0];
    byteOffset += blockLength;

    //subtract 2 to get the next block start position relative to where the data ends, not relative to where the type byte and this byte begin
    const nextBlockStart =
      new Uint32Array(buffer.slice(byteOffset, byteOffset + blockLength))[0] - 2;
    byteOffset += blockLength;

    const numBytesFollows = new Uint8Array(buffer.slice(byteOffset, byteOffset + 1))[0];
    byteOffset++;

    //TODO: This might be 4 bytes in some cases!
    const thisBlockLength = new Uint8Array(buffer.slice(byteOffset, byteOffset + 1))[0];
    byteOffset++;

    return {
      type,
      nextBlockStart,
      numBytesFollows,
      thisBlockLength,
      newByteOffset: byteOffset,
    };
  }

  /**
   * @description Takes each section as an array of character code numbers and returns the ASCII characters
   */
  private processCharsAsString(sectionCharArr: ArrayBuffer): string {
    // console.groupCollapsed("string");

    let txt = '';
    let offset = 0;
    const charArr = new Uint8Array(sectionCharArr);
    while (offset < sectionCharArr.byteLength) {
      const char = charArr[offset];
      // console.log(char, String.fromCharCode(char));
      txt += this.charToAscii(char);
      offset++;
    }
    // console.groupEnd();

    return this.cleanString(txt);
  }

  /**
   * @description Takes each section as an array of character code numbers and returns the ASCII characters
   */
  private processCharsAsLyricSection(sectionCharArr: Array<number>): ISongShowPlusLyricSection {
    // console.groupCollapsed("lyrics");

    const lyricObj: ISongShowPlusLyricSection = {
      title: '',
      lyrics: '',
    };

    let separatorCount = 0;
    let offset = 0;
    while (offset < sectionCharArr.length) {
      const char = sectionCharArr[offset];
      // console.log(char, String.fromCharCode(char));

      if (char === 6) {
        //always a /x06 followed by another character
        offset += 2;
        separatorCount++;
      } else {
        offset++;

        if (separatorCount <= 1) {
          lyricObj.title += this.charToAscii(char);
        } else {
          lyricObj.lyrics += this.charToAscii(char);
        }
      }
    }
    // console.log("separator count: ", separatorCount);
    // console.groupEnd();

    //Don't add any if no separators were found
    if (separatorCount === 0) {
      lyricObj.title = '';
      lyricObj.lyrics = '';
    } else {
      //Remove ending percent symbols for some reason
      //Trim any trailing whitespace/newlines
      lyricObj.title = this.cleanString(lyricObj.title);
      lyricObj.lyrics = this.cleanString(lyricObj.lyrics);
    }

    return lyricObj;
  }

  private processStringAsLyricSection(str: string): ISongShowPlusLyricSection {
    console.log(str);

    return {
      title: '',
      lyrics: '',
    };
  }

  //------------------------------------------
  //Helpers
  private charToAscii(char: number): string {
    if (this.charIsPrintableCharacter(char)) {
      // If the char code is a printable ASCII character, append to output string
      return String.fromCharCode(char);
    } else if (char === 10) {
      // If the char code corresponds to a newline, add a newline character
      return '\n';
    }
    return '';
  }

  private isSectionSeparator(
    dataView: DataView,
    byteOffset: number,
    totalByteLength: number
  ): boolean {
    //\x00\x00\x00\x??\x00\x00\x00
    //3 null-byte chars, then 1 char, then 3 null-byte chars will separate the sections
    if (totalByteLength < byteOffset + 6) return false;
    return (
      dataView.getInt8(byteOffset) === 0 &&
      dataView.getInt8(byteOffset + 1) === 0 &&
      dataView.getInt8(byteOffset + 2) === 0 &&
      // // + 3 would be a random character
      dataView.getInt8(byteOffset + 4) === 0 &&
      dataView.getInt8(byteOffset + 5) === 0 &&
      dataView.getInt8(byteOffset + 6) === 0
    );
  }

  private cleanString(str: string): string {
    //Remove random ending characters and whitespace
    return str.replace(/[$%'"]$/, '').trim();
  }

  private charIsNumber(charCode: number): boolean {
    //0-9
    return charCode >= 48 && charCode <= 57;
  }

  private charIsEnglishLetter(charCode: number): boolean {
    //A-Za-z
    return (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122);
  }

  private charIsLetter(charCode: number): boolean {
    //English letters or other non-symbol letter characters
    return this.charIsEnglishLetter(charCode) || charCode > 192;
  }

  private charIsPrintableCharacter(char: number): boolean {
    //letters, numbers, symbols. No control characters or newlines
    return (
      this.charIsLetter(char) ||
      this.charIsNumber(char) ||
      (char >= 32 && char <= 47) ||
      (char >= 58 && char <= 64)
    );
  }
}
