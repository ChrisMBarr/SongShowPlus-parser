//Based on: http://stackoverflow.com/questions/18222665/huge-string-replace-in-javascript/18223111
export class TextCleaner {
  //An object map to associate the UTF-8 string with the Windows1252 strings (as unicode) so we can look up a string and find it's replacement
  private readonly charMap: Record<string, string> = {
    '\\u00E2\\u201A\\u00AC': '€',
    '\\u00C3\\u20AC': 'À',
    '\\u00C3': 'à',
    '\\u00E2\\u20AC\\u0161': '‚',
    '\\u00C3\\u201A': 'Â',
    '\\u00C6\\u2019': 'ƒ',
    '\\u00C3\\u0192': 'Ã',
    '\\u00E2\\u20AC\\u017E': '„',
    '\\u00C3\\u201E': 'Ä',
    '\\u00E2\\u20AC\\u00A6': '…',
    '\\u00C3\\u2026': 'Å',
    '\\u00E2\\u20AC': '”',
    '\\u00C3\\u2020': 'Æ',
    '\\u00E2\\u20AC\\u00A1': '‡',
    '\\u00C3\\u2021': 'Ç',
    '\\u00CB\\u2020': 'ˆ',
    '\\u00C3\\u02C6': 'È',
    '\\u00E2\\u20AC\\u00B0': '‰',
    '\\u00C3\\u2030': 'É',
    '\\u00C5': 'Š',
    '\\u00C3\\u0160': 'Ê',
    '\\u00E2\\u20AC\\u00B9': '‹',
    '\\u00C3\\u2039': 'Ë',
    '\\u00C5\\u2019': 'Œ',
    '\\u00C3\\u0152': 'Ì',
    '\\u00C5\\u00BD': 'Ž',
    '\\u00C3\\u017D': 'Î',
    '\\u00E2\\u20AC\\u02DC': '‘',
    '\\u00C3\\u2018': 'Ñ',
    '\\u00E2\\u20AC\\u2122': '’',
    '\\u00C3\\u2019': 'Ò',
    '\\u00E2\\u20AC\\u0153': '“',
    '\\u00C3\\u201C': 'Ó',
    '\\u00C3\\u201D': 'Ô',
    '\\u00E2\\u20AC\\u00A2': '•',
    '\\u00C3\\u2022': 'Õ',
    '\\u00E2\\u20AC\\u201C': '–',
    '\\u00C3\\u2013': 'Ö',
    '\\u00E2\\u20AC\\u201D': '—',
    '\\u00C3\\u2014': '×',
    '\\u00CB\\u0153': '˜',
    '\\u00C3\\u02DC': 'Ø',
    '\\u00E2\\u201E\\u00A2': '™',
    '\\u00C3\\u2122': 'Ù',
    '\\u00C5\\u00A1': 'š',
    '\\u00C3\\u0161': 'Ú',
    '\\u00E2\\u20AC\\u00BA': '›',
    '\\u00C3\\u203A': 'Û',
    '\\u00C5\\u201C': 'œ',
    '\\u00C3\\u0153': 'Ü',
    '\\u00C5\\u00BE': 'ž',
    '\\u00C3\\u017E': 'Þ',
    '\\u00C5\\u00B8': 'Ÿ',
    '\\u00C3\\u0178': 'ß',
    '\\u00C2\\u00A1': '¡',
    '\\u00C3\\u00A1': 'á',
    '\\u00C2\\u00A2': '¢',
    '\\u00C3\\u00A2': 'â',
    '\\u00C2\\u00A3': '£',
    '\\u00C3\\u00A3': 'ã',
    '\\u00C2\\u00A4': '¤',
    '\\u00C3\\u00A4': 'ä',
    '\\u00C2\\u00A5': '¥',
    '\\u00C3\\u00A5': 'å',
    '\\u00C2\\u00A6': '¦',
    '\\u00C3\\u00A6': 'æ',
    '\\u00C2\\u00A7': '§',
    '\\u00C3\\u00A7': 'ç',
    '\\u00C2\\u00A8': '¨',
    '\\u00C3\\u00A8': 'è',
    '\\u00C2\\u00A9': '©',
    '\\u00C3\\u00A9': 'é',
    '\\u00C2\\u00AA': 'ª',
    '\\u00C3\\u00AA': 'ê',
    '\\u00C2\\u00AB': '«',
    '\\u00C3\\u00AB': 'ë',
    '\\u00C2\\u00AC': '¬',
    '\\u00C3\\u00AC': 'ì',
    '\\u00C2\\u00AD': '•',
    '\\u00C3\\u00AD': 'í',
    '\\u00C2\\u00AE': '®',
    '\\u00C3\\u00AE': 'î',
    '\\u00C2\\u00AF': '¯',
    '\\u00C3\\u00AF': 'ï',
    '\\u00C2\\u00B0': '°',
    '\\u00C3\\u00B0': 'ð',
    '\\u00C2\\u00B1': '±',
    '\\u00C3\\u00B1': 'ñ',
    '\\u00C2\\u00B2': '²',
    '\\u00C3\\u00B2': 'ò',
    '\\u00C2\\u00B3': '³',
    '\\u00C3\\u00B3': 'ó',
    '\\u00C2\\u00B4': '´',
    '\\u00C3\\u00B4': 'ô',
    '\\u00C2\\u00B5': 'µ',
    '\\u00C3\\u00B5': 'õ',
    '\\u00C2\\u00B6': '¶',
    '\\u00C3\\u00B6': 'ö',
    '\\u00C2\\u00B7': '·',
    '\\u00C3\\u00B7': '÷',
    '\\u00C2\\u00B8': '¸',
    '\\u00C3\\u00B8': 'ø',
    '\\u00C2\\u00B9': '¹',
    '\\u00C3\\u00B9': 'ù',
    '\\u00C2\\u00BA': 'º',
    '\\u00C3\\u00BA': 'ú',
    '\\u00C2\\u00BB': '»',
    '\\u00C3\\u00BB': 'û',
    '\\u00C2\\u00BC': '¼',
    '\\u00C3\\u00BC': 'ü',
    '\\u00C2\\u00BD': '½',
    '\\u00C3\\u00BD': 'ý',
    '\\u00C2\\u00BE': '¾',
    '\\u00C3\\u00BE': 'þ',
    '\\u00C2\\u00BF': '¿',
    '\\u00C3\\u00BF': 'ÿ',
  };

  //A Regex pattern to find any of the above listed UTF-8 strings
  //prettier-ignore
  private readonly charMapExpression: RegExp = /\u00E2\u201A\u00AC|\u00E2\u20AC\u0161|\u00E2\u20AC\u017E|\u00E2\u20AC\u00A6|\u00E2\u20AC\u00A1|\u00E2\u20AC\u00B0|\u00E2\u20AC\u00B9|\u00E2\u20AC\u02DC|\u00E2\u20AC\u2122|\u00E2\u20AC\u0153|\u00E2\u20AC\u00A2|\u00E2\u20AC\u201C|\u00E2\u20AC\u201D|\u00E2\u201E\u00A2|\u00E2\u20AC\u00BA|\u00C3\u20AC|\u00C3\u201A|\u00C6\u2019|\u00C3\u0192|\u00C3\u201E|\u00C3\u2026|\u00E2\u20AC|\u00C3\u2020|\u00C3\u2021|\u00CB\u2020|\u00C3\u02C6|\u00C3\u2030|\u00C3\u0160|\u00C3\u2039|\u00C5\u2019|\u00C3\u0152|\u00C5\u00BD|\u00C3\u017D|\u00C3\u2018|\u00C3\u2019|\u00C3\u201C|\u00E2\u20AC|\u00C3\u201D|\u00C3\u2022|\u00C3\u2013|\u00C3\u2014|\u00CB\u0153|\u00C3\u02DC|\u00C3\u2122|\u00C5\u00A1|\u00C3\u0161|\u00C3\u203A|\u00C5\u201C|\u00C3\u0153|\u00C5\u00BE|\u00C3\u017E|\u00C5\u00B8|\u00C3\u0178|\u00C2\u00A1|\u00C3\u00A1|\u00C2\u00A2|\u00C3\u00A2|\u00C2\u00A3|\u00C3\u00A3|\u00C2\u00A4|\u00C3\u00A4|\u00C2\u00A5|\u00C3\u00A5|\u00C2\u00A6|\u00C3\u00A6|\u00C2\u00A7|\u00C3\u00A7|\u00C2\u00A8|\u00C3\u00A8|\u00C2\u00A9|\u00C3\u00A9|\u00C2\u00AA|\u00C3\u00AA|\u00C2\u00AB|\u00C3\u00AB|\u00C2\u00AC|\u00C3\u00AC|\u00C2\u00AD|\u00C3\u00AD|\u00C2\u00AE|\u00C3\u00AE|\u00C2\u00AF|\u00C3\u00AF|\u00C2\u00B0|\u00C3\u00B0|\u00C2\u00B1|\u00C3\u00B1|\u00C2\u00B2|\u00C3\u00B2|\u00C2\u00B3|\u00C3\u00B3|\u00C2\u00B4|\u00C3\u00B4|\u00C2\u00B5|\u00C3\u00B5|\u00C2\u00B6|\u00C3\u00B6|\u00C2\u00B7|\u00C3\u00B7|\u00C2\u00B8|\u00C3\u00B8|\u00C2\u00B9|\u00C3\u00B9|\u00C2\u00BA|\u00C3\u00BA|\u00C2\u00BB|\u00C3\u00BB|\u00C2\u00BC|\u00C3\u00BC|\u00C2\u00BD|\u00C3\u00BD|\u00C2\u00BE|\u00C3\u00BE|\u00C2\u00BF|\u00C3\u00BF|\u00C3|\u00C5|\u00C3|\u00C3|\u00C3|\u00C3|\u00C3/g

  /**
   * @description //Converts all characters in a passed string to Unicode characters
   * @tutorial http://buildingonmud.blogspot.com/2009/06/convert-string-to-unicode-in-javascript.html
   */
  toUnicode(str: string): string {
    let unicodeString = '';
    for (let i = 0; i < str.length; i++) {
      let theUnicode = str.charCodeAt(i).toString(16).toUpperCase();
      while (theUnicode.length < 4) {
        theUnicode = '0' + theUnicode;
      }
      theUnicode = '\\u' + theUnicode;
      unicodeString += theUnicode;
    }
    return unicodeString;
  }

  /**
   * @description //Converts all win1252 characters to UTF-8 characters in the passed string
   */
  convertWin1252ToUtf8(source: string): string {
    //Use the RegEx to search the string for matches, then replace any of them with the corresponding replacement string
    return source.replace(this.charMapExpression, (m) => {
      const unicodeVal = this.toUnicode(m);
      return this.charMap[unicodeVal];
    });
  }
}
