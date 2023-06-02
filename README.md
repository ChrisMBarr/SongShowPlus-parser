# SongShowPlus-parser
Parses and extracts data from SongShow Plus files
Currently only tested with SongShow Plus 7. I need test files from newer versions to add support.

## Installation

```
npm install songshowplus-parser --save
```

## Usage

TypeScript projects
```
import {readFile} from 'fs';
import { SongShowPlus } from 'songshowplus-parser';

const sspParser = new SongShowPlus();

readFile('my-song.sbsong', (contents) => {
  const song = sspParser.parse(contents);
  console.log(song);
});
```

JavaScript projects
```
const fs = require('fs');
const { SongShowPlus } = require('songshowplus-parser');

const sspParser = new SongShowPlus();

fs.readFile('my-song.sbsong', (contents) => {
  const song = sspParser.parse(contents);
  console.log(song);
});
```

## Notes
SongShow Plus files are in a binary format, which can make them difficult to extract song lyrics from sometimes. The majority of SongShow Plus files are formatted in a similar manner which we can try to figure out, but occasionally there are files with odd formatting. In these cases all the lyrics should be extracted, but it cannot be organized in any way. All I can do in this case is dump all the text onto a single section. In these cases you might have better luck exporting these problem files from SongShow Plus into other formats if possible.
