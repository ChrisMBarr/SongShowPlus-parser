import { readFileSync } from 'fs';
import { ISongShowPlusSong } from './models';
import { SongShowPlus } from '.';

describe('SongShowPlus', (): void => {
  let sspParser: SongShowPlus;

  beforeEach(() => {
    sspParser = new SongShowPlus();
  });

  it('should exist', () => {
    expect(sspParser).toBeDefined();
  });

  it('should return a song for an ENGLISH SongShow Plus 7 file: "Be Near.sbsong"', () => {
    const testFile = readFileSync('./sample-files/Be Near.sbsong');

    expect(sspParser.parse(testFile)).toEqual({
      songNumber: '0707',
      title: 'Be Near',
      artist: 'Barnard, Shane',
      copyright: '2003 Waiting Room Music',
      ccli: '4090362',
      key: 'B',
      keywords: ['Longing', 'Security'],
      lyricSections: [
        {
          title: 'Chorus 1',
          lyrics:
            'Be near O God\nBe near O God of us\nYour nearness is to us our good\nBe near O God\nBe near O God of us\nYour nearness is to us our good\nOur good',
        },
        { title: 'Other', lyrics: '' },
        {
          title: 'Verse 1',
          lyrics:
            "You are all big and small\nBeautiful\nAnd wonderful\nTo trust in grace through faith\nBut I'm asking to taste",
        },
        {
          title: 'Verse 2',
          lyrics:
            'For dark is light to You\nDepths are height to You\nFar is near\nBut Lord I need to hear from You',
        },
        {
          title: 'Verse 3',
          lyrics:
            'Your fullness is mine\nRevelation divine\nBut oh to taste\nTo know much more than a page\nTo feel Your embrace',
        },
        {
          title: 'Verse 4',
          lyrics:
            'For dark is light to You\nDepths are height to You\nFar is near\nBut Lord I need to hear from You',
        },
        {
          title: 'Ending',
          lyrics: 'My good',
        },
      ],
    } as ISongShowPlusSong);
  });

  it('should return a song for an ENGLISH SongShow Plus 7 file: "Give Us Clean Hands.sbsong"', () => {
    const testFile = readFileSync('./sample-files/Give Us Clean Hands.sbsong');

    expect(sspParser.parse(testFile)).toEqual({
      songNumber: '0707',
      title: 'Give Us Clean Hands',
      artist: 'Hall, Charlie',
      copyright: '2000 worshiptogether.com songs',
      ccli: '2060208',
      key: 'Ab',
      keywords: ['Prayer', 'Repentance'],
      lyricSections: [
        {
          title: 'Chorus 1',
          lyrics:
            'Give us clean hands\ngive us pure hearts\nLet us not lift our\nsouls to another\nGive us clean hands\ngive us pure hearts\nLet us not lift our\nsouls to another',
        },
        {
          title: 'Chorus',
          lyrics:
            'And oh God let us be\na generation that seeks\nThat seeks Your face\noh God of Jacob\nAnd oh God let us be\na generation that seeks\nThat seeks Your face\noh God of Jacob',
        },
        {
          title: 'Verse 1',
          lyrics:
            'We bow our hearts\nwe bend our knees\nOh Spirit come\nmake us humble\nWe turn our eyes\nfrom evil things\nOh Lord we cast\ndown our idols',
        },
      ],
    } as ISongShowPlusSong);
  });

  it('should return a song for an ENGLISH SongShow Plus 7 file: "Jesus Saves.sbsong"', () => {
    const testFile = readFileSync('./sample-files/Jesus Saves.sbsong');

    expect(sspParser.parse(testFile)).toEqual({
      songNumber: '0718',
      title: 'Jesus Saves (2)',
      artist: 'Eddie James',
      copyright: 'Fresh Wine Publishing',
      ccli: '',
      key: '',
      keywords: [],
      lyricSections: [
        {
          title: 'Verse 1',
          lyrics:
            'Jesus saves from the power\nAnd the penalty of sin\nJesus saves from the torment\nAnd the anguish within\nJesus saves from the bondage\nAnd control of the enemy\nHe heals the broken heart\nAnd set the captives free',
        },
        {
          title: 'Verse 2',
          lyrics:
            "Jesus saves from the guilt\nAnd the shame of what you've done\nJesus saves from a life\nFilled with lies and deception\nJesus saves from the pain of the memories \nThat have scarred your past",
        },
        {
          title: 'Pre-chorus 1',
          lyrics:
            'Gabriel came to Joseph in a dream\nFor by the Holy Spirit Mary conceived\nAnd with a message from heaven\nGabriel came declaring',
        },
        {
          title: 'Chorus 1',
          lyrics:
            'She shall bring forth a Son thou\nShalt call His name Jesus and He shall save\nSave His people from sin and give peace within\nWhat amazing grace - Jesus saves',
        },
        {
          title: 'Verse 3',
          lyrics:
            "Jesus saves, He's the One that has never known sin\nJesus saves, yet for us He took on the sins of men\nJesus saves for he became our sin that we \nMay become the righteousness of God\nJesus saves and now I'll see His face in peace\nJesus saves and I will live with Him eternally\nJesus saves and I will join with the angels\nAround the throne Singing Holy, Holy, Holy",
        },
        {
          title: 'Verse 4',
          lyrics:
            "Jesus saves and today you can leave here set free\nJesus saves and even now He will give you liberty\nJesus saves no matter what, no matter who, no\nMatter where just call Him, He'll answer your prayer\nJesus saves and your life will never be the same\nJesus saves and right now you can be born again\nJesus saves for he that be in Christ\nThe old has past and all is made new",
        },
        {
          title: 'Bridge 1',
          lyrics:
            "Redeemer, liberator, healer, emancipator \nChain-Breaker, strong deliverer, He fights for me\nWarrior, restorer, forgiver, peace make\nJustifier, Intercessor, through Him I'm free",
        },
        {
          title: 'Vamp 1',
          lyrics: 'Jesus saves (repeat) Hallelujah (repeat)',
        },
      ],
    } as ISongShowPlusSong);
  });

  it('should return a song for an ENGLISH SongShow Plus 7 file: "You Are.sbsong"', () => {
    const testFile = readFileSync('./sample-files/You Are.sbsong');

    expect(sspParser.parse(testFile)).toEqual({
      songNumber: '0718',
      title: 'You Are (2)',
      artist: '8Jobe, Caleb | Cohen, Ezra | Hesami, Josh | Trimble, Paul',
      copyright: '2010 CFN Music',
      ccli: '5715921',
      key: 'C',
      keywords: ['Appreciation', 'Breakthrough', 'Christ', 'Declaration', 'Jesus'],
      lyricSections: [
        {
          title: 'Verse 1',
          lyrics:
            "Bought back from a life in chains\nNow I can sing that I have been redeemed\nYour blood covers all of me\nI'm not ashamed to shout who You are\nI'm living in the light of grace\nMercy made a way to make things bright\nLove overcame the grave in victory in victory",
        },
        {
          title: 'Chorus 1',
          lyrics:
            'You are You are You are the Lord of all\nGave Your life to save us\nFreedom has embraced us\nYou are You are You are the Love for all\nHope of every nation\nAll creation shouts Your glory',
        },
        {
          title: 'Verse 2',
          lyrics:
            "I'm running with a heart that's changed\nEverything to see Your kingdom come\nYou guide every step I take\nI'm not ashamed to shout who You are\nI'm living in a brand new day\nA life to give a life to lift You high\nAll glory and power and praise\nTo You alone to You alone",
        },
        {
          title: 'Bridge',
          lyrics:
            "I'm not ashamed of who You are\nYour love broke through\nAnd grace has made me Yours\nNow upon this Rock I stand\nIn victory in victory\n(REPEAT 3X)",
        },
      ],
    } as ISongShowPlusSong);
  });

  it('should return a song for a SPANISH SongShow Plus 7 file: "Devuelveme El Gozo.sbsong"', () => {
    const testFile = readFileSync('./sample-files/Devuelveme El Gozo.sbsong');

    expect(sspParser.parse(testFile)).toEqual({
      songNumber: '0707',
      title: 'Devuelveme El Gozo',
      artist: '',
      copyright: '',
      ccli: '',
      key: '',
      keywords: [],
      lyricSections: [
        {
          title: 'Verse 1',
          lyrics:
            'En medio del dolor \nEn medio de la aflicción\nTu me das paz y \nMe enseñas tu amor \nTodo lo que perdí \nLo restauras Señor en mi \nMe das las fuerza para seguir',
        },
        {
          title: 'Chorus',
          lyrics:
            'Devuelve me el gozo \nDe Tu salvación y\nTu Espíritu noble me sustente \nTe necesito Dios \nSin ti no soy nada \nTe necesito Dios \nDame un nuevo corazón',
        },
      ],
    } as ISongShowPlusSong);
  });

  it('should return a song for a SPANISH SongShow Plus 7 file: "La Sangre (The Blood).sbsong"', () => {
    const testFile = readFileSync('./sample-files/La Sangre (The Blood).sbsong');

    expect(sspParser.parse(testFile)).toEqual({
      songNumber: '0707',
      title: 'La Sangre (The Blood)',
      artist: '',
      copyright: '',
      ccli: '',
      key: '',
      keywords: [],
      lyricSections: [
        {
          title: 'Verse 1',
          lyrics:
            'La sangre de mi Cristo\nque el vertio por mi en la cruz\naun es eficaz, para limpiar tu ser\nporque Cristo nunca perdera su fuerza',
        },
        {
          title: 'Chorus',
          lyrics:
            'Oh, porque alcanza a limpiar nuestras manchas\ny alcanza a curar nuestras llagas\npecador ven al manantial \nque fluyendo esta\ny lavara tu ser\nporque Cristo nunca perdera su fuerza!!"',
        },
      ],
    } as ISongShowPlusSong);
  });
});
