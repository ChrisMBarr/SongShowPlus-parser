import { CharHelpers } from './char-helpers';
import {
  Block,
  IBlockLength,
  ISongSection,
  ISongSectionBufferInfo,
  SongShowPlusSong,
} from './models';

export class SongShowPlus {
  private readonly charHelpers = new CharHelpers();
  private readonly byteLength = 4;

  public parse(fileBuffer: Buffer): SongShowPlusSong {
    // console.log('==========================================================');
    const sections = this.getSections(fileBuffer);
    // console.dir(sections, { depth: null });

    const formattedSong = this.getFormattedSong(sections);
    // console.dir(formattedSon, { depth: null });

    return formattedSong;
  }

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

    This description does differ for verses. Which includes extra bytes stating the verse type or number. In some
    cases a "custom" verse is used, in that case, this block will in include 2 strings, with the associated string
    length descriptors. The first string is the name of the verse, the second is the verse content.

    The file is ended with four null bytes.
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

    // Loop through the buffer and read bytes based on the context
    while (byteOffset < fileBuffer.byteLength) {
      //Get the info about the next section
      const sectionBufferInfo = this.getSectionBufferInfo(dataView.buffer, byteOffset);
      //Update the current offset to the end of the section we just read
      byteOffset = sectionBufferInfo.newByteOffset;

      //Using that info we can find the content
      const dataArr = dataView.buffer.slice(sectionBufferInfo.readFrom, sectionBufferInfo.readTo);
      const sectionContent = this.charHelpers.processCharsAsString(dataArr);

      //Create a new object to return with all the relevant info on it
      const thisSection: ISongSection = {
        bufferInfo: sectionBufferInfo,
        content: sectionContent,
      };

      if (
        sectionBufferInfo.type === Block.BRIDGE ||
        sectionBufferInfo.type === Block.CHORUS ||
        sectionBufferInfo.type === Block.VERSE
      ) {
        //Inside a built-in song section like these, the content found above is garbage data
        //we just need to provide meaningful labels here, similar to the ones a custom verse has in the data
        thisSection.content = this.getBuiltInVerseFriendlyName(sectionBufferInfo.type);
        thisSection.lyrics = this.getLyrics(dataView.buffer, byteOffset);
      } else if (sectionBufferInfo.type === Block.CUSTOM_VERSE) {
        //When a Custom Verse is found it only informs us of the location of the title
        //Right after that is a byte telling us how long the lyric content is,
        //and then the actual lyric data
        thisSection.lyrics = this.getLyrics(
          dataView.buffer,
          byteOffset + sectionBufferInfo.blockLength
        );
      }

      sections.push(thisSection);

      //Update the byte offset for the next iteration
      //NOTE: For lyric sections this returns the correct number
      //even though the content has to be manually found separately
      byteOffset += sectionBufferInfo.nextBlockStart;
    }

    return sections;
  }

  private getBuiltInVerseFriendlyName(type: Block): string {
    if (type === Block.BRIDGE) {
      return 'Bridge';
    }
    if (type === Block.CHORUS) {
      return 'Chorus';
    }
    //Default
    return 'Verse';
  }

  private getLyrics(buffer: ArrayBuffer, lyricStartOffset: number): string {
    const blockLengthInfo = this.getBlockLength(buffer, lyricStartOffset);

    //Get the actual content now that we have the start and end positions
    const content = this.charHelpers.processCharsAsString(
      buffer.slice(
        lyricStartOffset + blockLengthInfo.startOffset,
        lyricStartOffset + blockLengthInfo.startOffset + blockLengthInfo.blockLength
      )
    );

    return content;
  }

  private getSectionBufferInfo(buffer: ArrayBuffer, byteOffset: number): ISongSectionBufferInfo {
    //The first 4 bytes tells us the type. See the Block Enum above to see what they map to
    //Some data will be returned as unknown types and I have no idea what these are!
    const type = new Uint32Array(buffer.slice(byteOffset, byteOffset + this.byteLength))[0];
    byteOffset += this.byteLength;

    //The next byte tells us where the data for this section ends.
    // However it includes this and the previous byte in that length, so:
    // We subtract 2 to get the next block start position relative to where the data ends,
    // not relative to where the type byte and this byte begin
    let nextBlockStart =
      new Uint32Array(buffer.slice(byteOffset, byteOffset + this.byteLength))[0] - 2;
    byteOffset += this.byteLength;

    //The next byte tells us how many bytes follow this byte
    const numBytesFollows = new Uint8Array(buffer.slice(byteOffset, byteOffset + 1))[0];
    byteOffset++;

    // TODO: We might need to somehow use this here to determine how to get the length
    // const blockLengthInfo = this.getBlockLength(buffer, byteOffset);
    // byteOffset += blockLengthInfo.startOffset;

    // If the previous byte was null, the next byte is what actually contains the data we want
    if (numBytesFollows === 0) {
      nextBlockStart++;
      byteOffset++;
    }

    //
    let readFrom: number;
    let readTo: number;
    let blockLength: number;
    if (numBytesFollows === 20) {
      //This is the less common use case
      //I do not know what the value of 20 represents here
      //But when we encounter it, it's a full 4 bytes we must move past to get the start of the data
      //However, the byte offset should not be updated to match this for some reason.
      //This is why we must provide explicit readFrom and readTo values instead of just reading the offset + the length
      blockLength = new Uint32Array(buffer.slice(byteOffset, byteOffset + this.byteLength))[0];
      readFrom = byteOffset + this.byteLength;
      readTo = byteOffset + blockLength + this.byteLength;
      byteOffset++;
    } else {
      //This is the common use case.
      //1 byte of blocklength data, and we read from the current offset to the end of the byte length
      blockLength = new Uint8Array(buffer.slice(byteOffset, byteOffset + 1))[0];
      byteOffset++;
      readFrom = byteOffset;
      readTo = byteOffset + blockLength;
    }

    return {
      type,
      nextBlockStart,
      blockLength,
      readFrom,
      readTo,
      newByteOffset: byteOffset,
    };
  }

  private getBlockLength(buffer: ArrayBuffer, byteOffset: number): IBlockLength {
    //The first byte will tell us if the next content length is 1 or 4 bytes
    const byteCount = new Uint8Array(buffer.slice(byteOffset, byteOffset + 1));

    //move forward
    byteOffset++;

    const contentStartOffset = byteCount[0] === 6 ? 1 : this.byteLength;

    let nextBlockLength: number;
    if (contentStartOffset === 1) {
      //Get the value from the next byte as the content length
      nextBlockLength = new Uint8Array(
        buffer.slice(byteOffset, byteOffset + contentStartOffset)
      )[0];
    } else {
      //get the value from the next 4 bytes as the content length
      nextBlockLength = new Uint32Array(
        buffer.slice(byteOffset, byteOffset + contentStartOffset)
      )[0];
    }

    return {
      startOffset: contentStartOffset + 1,
      blockLength: nextBlockLength,
    };
  }

  // eslint-disable-next-line complexity
  private getFormattedSong(sections: Array<ISongSection>): SongShowPlusSong {
    //create a song with defaults
    const song = new SongShowPlusSong();

    for (const songSection of sections) {
      switch (songSection.bufferInfo.type) {
        case Block.FILE_START:
          song.id = songSection.content;
          break;
        case Block.TITLE:
          song.title = songSection.content;
          break;
        case Block.AUTHOR:
          song.author = songSection.content;
          break;
        case Block.COPYRIGHT:
          song.copyright = songSection.content;
          break;
        case Block.CCLI_NO:
          song.ccli = songSection.content;
          break;
        case Block.KEY:
          song.key = songSection.content;
          break;
        case Block.TOPIC:
          song.topics.push(songSection.content);
          break;
        case Block.COMMENTS:
          song.comments = songSection.content;
          break;
        case Block.VERSE_ORDER:
          song.verseOrder = songSection.content;
          break;
        case Block.SONG_BOOK:
          song.songBook = songSection.content;
          break;
        case Block.SONG_NUMBER:
          song.songNumber = songSection.content;
          break;
        case Block.CUSTOM_VERSE:
        case Block.VERSE:
        case Block.CHORUS:
        case Block.BRIDGE:
          song.lyricSections.push({ title: songSection.content, lyrics: songSection.lyrics! });
          break;
        default:
          break;
      }
    }

    return song;
  }
}
