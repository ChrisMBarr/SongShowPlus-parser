# SongShowPlus-parser
Parses and extracts data from SongShow Plus files
Currently only tested with SongShow Plus 7. I need test files from newer versions to add support.

## Installation

```
npm install songshowplus-parser --save
```

## Usage
Simply import and create a new instance of `SongShowPlus`, then pass the contents of a SSP7 file as a string to the `.parse()` method.

### For TypeScript projects
```
import {readFile} from 'fs';
import { SongShowPlus } from 'songshowplus-parser';

const sspParser = new SongShowPlus();

readFile('Be Near.sbsong', (contents) => {
  const song = sspParser.parse(contents.toString());
  console.log(song);
});
```

### For JavaScript projects
```
const fs = require('fs');
const { SongShowPlus } = require('songshowplus-parser');

const sspParser = new SongShowPlus();

fs.readFile('Be Near.sbsong', (contents) => {
  const song = sspParser.parse(contents.toString());
  console.log(song);
});
```

## Example Output
```
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
SongShow Plus files are in a binary format, which can make them difficult to extract song lyrics from sometimes. The majority of SongShow Plus files are formatted in a similar manner which we can try to figure out, but occasionally there are files with odd formatting. In these cases all the lyrics should be extracted, but it cannot be organized in any way. All I can do in this case is dump all the text onto a single section. In these cases you might have better luck exporting these problem files from SongShow Plus into other formats if possible.
