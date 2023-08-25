export class CharHelpers {
  public processCharsAsString(sectionCharArr: ArrayBuffer): string {
    // console.groupCollapsed("processCharsAsString");
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

  public charToAscii(charCode: number): string {
    // if (this.charIsPrintableCharacter(charCode)) {
    //   // If the char code is a printable ASCII character, append to output string

    // } else
    if (charCode === 10) {
      // If the char code corresponds to a newline, add a newline character
      return '\n';
    }
    return String.fromCharCode(charCode);
    // return '';
  }

  public cleanString(str: string): string {
    //Remove random ending characters and whitespace
    return str.replace(/[$%'"]$/, '').trim();
  }

  public charIsNumber(charCode: number): boolean {
    //0-9
    return charCode >= 48 && charCode <= 57;
  }

  public charIsEnglishLetter(charCode: number): boolean {
    //A-Za-z
    return (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122);
  }

  public charIsLetter(charCode: number): boolean {
    //English letters or other non-symbol letter characters
    return this.charIsEnglishLetter(charCode) || charCode > 192;
  }

  public charIsPrintableCharacter(charCode: number): boolean {
    //letters, numbers, symbols. No control characters or newlines
    return (
      this.charIsLetter(charCode) ||
      this.charIsNumber(charCode) ||
      (charCode >= 32 && charCode <= 47) ||
      (charCode >= 58 && charCode <= 64)
    );
  }
}
