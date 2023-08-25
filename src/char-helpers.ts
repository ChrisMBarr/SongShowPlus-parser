import { unescape } from 'querystring';

export class CharHelpers {
  public processCharsAsString(sectionCharArr: ArrayBuffer): string {
    // console.groupCollapsed("processCharsAsString");
    let txt = '';
    let offset = 0;
    const charArr = new Uint8Array(sectionCharArr);
    while (offset < sectionCharArr.byteLength) {
      const char = charArr[offset];
      // console.log(char, String.fromCharCode(char));
      txt += String.fromCharCode(char);
      offset++;
    }
    // console.groupEnd();

    //decode character to UTF-8. Helps with accented characters.
    //This converts things like 'salvaciÃ³n' to 'salvación'
    return unescape(this.escapeString(txt));
  }

  private escapeString(str: string): string {
    //https://stackoverflow.com/a/37303214/79677
    const allowed = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@*_+-./,';
    str = str.toString();
    const len = str.length;
    let R = '';
    let k = 0;
    let S = '';
    let chr = '';
    let ord = 0;
    while (k < len) {
      chr = str[k];
      if (allowed.indexOf(chr) !== -1) {
        S = chr;
      } else {
        ord = str.charCodeAt(k);
        if (ord < 256) {
          S = '%' + ('00' + ord.toString(16)).toUpperCase().slice(-2);
        } else {
          S = '%u' + ('0000' + ord.toString(16)).toUpperCase().slice(-4);
        }
      }
      R += S;
      k++;
    }
    return R;
  }

  // public charToAscii(charCode: number): string {
  //   // if (this.charIsPrintableCharacter(charCode)) {
  //   //   // If the char code is a printable ASCII character, append to output string

  //   // } else
  //   if (charCode === 10) {
  //     // If the char code corresponds to a newline, add a newline character
  //     return '\n';
  //   }
  //   return String.fromCharCode(charCode);
  //   // return '';
  // }

  // public cleanString(str: string): string {
  //   //Remove random ending characters and whitespace
  //   return str.replace(/[$%'"]$/, '').trim();
  // }

  // public charIsNumber(charCode: number): boolean {
  //   //0-9
  //   return charCode >= 48 && charCode <= 57;
  // }

  // public charIsEnglishLetter(charCode: number): boolean {
  //   //A-Za-z
  //   return (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122);
  // }

  // public charIsLetter(charCode: number): boolean {
  //   //English letters or other non-symbol letter characters
  //   return this.charIsEnglishLetter(charCode) || charCode > 192;
  // }

  // public charIsPrintableCharacter(charCode: number): boolean {
  //   //letters, numbers, symbols. No control characters or newlines
  //   return (
  //     this.charIsLetter(charCode) ||
  //     this.charIsNumber(charCode) ||
  //     (charCode >= 32 && charCode <= 47) ||
  //     (charCode >= 58 && charCode <= 64)
  //   );
  // }
}
