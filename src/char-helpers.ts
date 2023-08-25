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
    return this.cleanString(txt);
  }

  private cleanString(str: string): string {
    //decode character to UTF-8. Helps with accented characters.
    //This converts things like 'salvaciÃ³n' to 'salvación'
    return (
      unescape(this.escapeString(str))
        //Replace CRLF with a single \n
        .replace(/\r\n/g, '\n')
        //remove any trailing whitespace or newlines
        .trim()
    );
  }

  private escapeString(str: string): string {
    //A replacement for the deprecated escape method
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
}
