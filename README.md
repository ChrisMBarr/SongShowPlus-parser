[![GitHub - release](https://img.shields.io/github/v/release/FiniteLooper/SongShowPlus-parser?style=flat)](https://github.com/FiniteLooper/SongShowPlus-parser/releases/latest)

# SongShowPlus-parser

[SongShow Plus](https://www.songshowplus.com/) is a worship presentation software package use by many churches to present song lyrics (and many other things) on screens. When moving to a different software package it may be needed to get your song lyrics out into some other format.

This project will parses and extract data from SongShow Plus files. It is currently only tested with SongShow Plus 7. I need test files from newer versions to add support.

This project is used by my [LyricConverter](htt://github.com/FiniteLooper/LyricConverter) project which can convert your song lyric files between many common formats. If you need to convert some songs to another existing format I encourage you to check this project out first.

## Installation

```txt
npm install songshowplus-parser --save
```

## Usage

Simply import and create a new instance of `SongShowPlus`, then pass the contents of a SSP7 file as a string to the `.parse()` method.

### For TypeScript projects

```typescript
import { readFile } from 'fs';
import { SongShowPlus } from 'songshowplus-parser';
import { ISongShowPlusSong } from 'songshowplus-parser/dist/main/model';

const sspParser = new SongShowPlus();

readFile('Be Near.sbsong', (contents): void => {
  const song: ISongShowPlusSong = sspParser.parse(contents.toString());
  console.log(song);
});
```

### For JavaScript projects

```javascript
const { readFile } = require('fs');
const { SongShowPlus } = require('songshowplus-parser');

const sspParser = new SongShowPlus();

readFile('Be Near.sbsong', (contents) => {
  const song = sspParser.parse(contents.toString());
  console.log(song);
});
```

## Example Output

Note that for any properties the parser is unable to find an empty string or empty array will be returned instead. This way all properties are always the types they are supposed to be, nothing is nullable or optional on the returned object.

```javascript
{
  title: 'Be Near',
  keywords: ['Longing', "Security'"],
  artist: 'Barnard, Shane',
  copyright: '2003 Waiting Room Music',
  ccli: '4090362',
  sections: [
    {
      title: 'Chorus 1',
      lyrics:
        'Be near O God\r\nBe near O God of us\r\nYour nearness is to us our good\r\nBe near O God\r\nBe near O God of us\r\nYour nearness is to us our good\r\nOur good',
    },
    {
      title: 'Verse 1',
      lyrics:
        "You are all big and small\r\nBeautiful\r\nAnd wonderful\r\nTo trust in grace through faith\r\nBut I'm asking to taste",
    },
    {
      title: 'Verse 2',
      lyrics:
        'For dark is light to You\r\nDepths are height to You\r\nFar is near\r\nBut Lord I need to hear from You',
    },
    {
      title: 'Verse 3',
      lyrics:
        'Your fullness is mine\r\nRevelation divine\r\nBut oh to taste\r\nTo know much more than a page\r\nTo feel Your embrace',
    },
    {
      title: 'Verse 4',
      lyrics:
        'For dark is light to You\r\nDepths are height to You\r\nFar is near\r\nBut Lord I need to hear from You',
    },
    {
      title: 'Ending',
      lyrics: 'My good',
    },
  ],
}
```

## Notes

SongShow Plus files are in a binary format, and I never would have been able to figure this out if it wasn't for [this SSP parser written in python](https://github.com/mhamann/songshow-converter/blob/master/songshowplus.py) by @mhamann
