[![GitHub - release](https://img.shields.io/github/v/release/FiniteLooper/SongShowPlus-parser?style=flat)](https://github.com/FiniteLooper/SongShowPlus-parser/releases/latest)

# SongShowPlus-parser

[SongShow Plus](https://www.songshowplus.com/) is a worship presentation software package use by many churches to present song lyrics (and many other things) on screens. When moving to a different software package it may be needed to get your song lyrics out into some other format.

This project will parses and extract data from SongShow Plus files. It is currently only tested with SongShow Plus 7 as far as I know. I need test files from newer versions to be sure. The song files I test against do not contain a version number in them, so perhaps these files are standard across all versions of SongShow Plus, I am not sure. If you have any song files you are able and willing to share with me, I would love to try them.

This project is used by my [LyricConverter](htt://github.com/FiniteLooper/LyricConverter) project which can convert your song lyric files between many common formats. If you need to convert some songs to another existing format I encourage you to check this project out first.

## Installation

```txt
npm install songshowplus-parser --save
```

## Usage

Simply import and create a new instance of `SongShowPlus`, then pass the contents of a SSP file as a `Buffer` or an `ArrayBuffer` to the `.parse()` method. Basically you can just pass in the raw output from reading the file without converting it to a string first. If you are using a `FileReader` be sure to use the `readAsArrayBuffer(yourFile)` method

### For TypeScript projects

```typescript
import { readFile } from 'fs';
import { SongShowPlus } from 'songshowplus-parser';
import { ISongShowPlusSong } from 'songshowplus-parser/dist/main/model'; //Add only if you need the type defs

const sspParser = new SongShowPlus();

readFile('Be Near.sbsong', (contents): void => {
  const song: ISongShowPlusSong = sspParser.parse(contents);
  console.log(song);
});
```

### For JavaScript projects

```javascript
const { readFile } = require('fs');
const { SongShowPlus } = require('songshowplus-parser');

const sspParser = new SongShowPlus();

readFile('Be Near.sbsong', (contents) => {
  const song = sspParser.parse(contents);
  console.log(song);
});
```

## Output

Note that for any properties the parser is unable to find an empty string or empty array will be returned instead. This way all properties are always the types they are supposed to be, nothing is nullable or optional on the returned object.

```javascript
{
  id: '0707',
  title: 'Be Near',
  author: 'Barnard, Shane',
  copyright: '2003 Waiting Room Music',
  ccli: '4090362',
  key: 'B',
  comments: '',
  verseOrder: '',
  songBook: '',
  songNumber: '',
  topics: ['Longing', 'Security'],
  lyricSections: [
    {
      title: 'Chorus 1',
      lyrics: 'Be near O God\nBe near O God of us\nYour nearness is to us our good\nBe near O God\nBe near O God of us\nYour nearness is to us our good\nOur good',
    },
    { title: 'Other', lyrics: '' },
    {
      title: 'Verse 1',
      lyrics: "You are all big and small\nBeautiful\nAnd wonderful\nTo trust in grace through faith\nBut I'm asking to taste",
    },
    {
      title: 'Verse 2',
      lyrics: 'For dark is light to You\nDepths are height to You\nFar is near\nBut Lord I need to hear from You',
    },
    {
      title: 'Verse 3',
      lyrics: 'Your fullness is mine\nRevelation divine\nBut oh to taste\nTo know much more than a page\nTo feel Your embrace',
    },
    {
      title: 'Verse 4',
      lyrics: 'For dark is light to You\nDepths are height to You\nFar is near\nBut Lord I need to hear from You',
    },
    {
      title: 'Ending',
      lyrics: 'My good',
    },
  ],
}
```

## Notes

SongShow Plus files are in a binary format, and I never would have been able to figure out the meaning of if it wasn't for [this SSP parser written in python](https://github.com/mhamann/songshow-converter/blob/master/songshowplus.py) by [Matt Hamann (@mhamann)](https://github.com/mhamann/) which described the format and structure of these files. I have no idea how he figured it out, but I'm glad he did!
