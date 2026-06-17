export type PhoneFormat = "international" | "national" | "e164";

export interface Country {
  name: string;
  code: string;
  flag: string;
  countryCode: string;
  formats: {
    international: (number: string) => string;
    national: (number: string) => string;
    e164: (number: string) => string;
  };
  generateNumber: () => string;
}

const generateRandomDigits = (length: number): string => {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
};

export const COUNTRIES: Record<string, Country> = {
  NG: {
    name: "Nigeria",
    code: "NG",
    flag: "🇳🇬",
    countryCode: "+234",
    generateNumber: () => {
      const areaCode = ["701", "702", "703", "704", "705", "706", "707", "708", "709", "810", "811", "812", "813", "814", "815", "816", "817", "818", "819", "909"][Math.floor(Math.random() * 20)];
      const middleDigits = generateRandomDigits(3);
      const lastDigits = generateRandomDigits(2);
      const lastTwo = generateRandomDigits(2);
      return areaCode + middleDigits + lastDigits + lastTwo;
    },
    formats: {
      international: (number: string) => `+234 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6, 8)} ${number.slice(8)}`,
      national: (number: string) => `0${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6, 8)} ${number.slice(8)}`,
      e164: (number: string) => `+234${number}`,
    },
  },
  US: {
    name: "USA",
    code: "US",
    flag: "🇺🇸",
    countryCode: "+1",
    generateNumber: () => {
      const areaCode = generateRandomDigits(3);
      const exchange = generateRandomDigits(3);
      const number = generateRandomDigits(4);
      return areaCode + exchange + number;
    },
    formats: {
      international: (number: string) => `+1 (${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`,
      national: (number: string) => `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`,
      e164: (number: string) => `+1${number}`,
    },
  },
  DE: {
    name: "Germany",
    code: "DE",
    flag: "🇩🇪",
    countryCode: "+49",
    generateNumber: () => {
      const areaCode = Math.floor(Math.random() * 9000) + 1000;
      const subscriber = generateRandomDigits(8);
      return areaCode.toString() + subscriber;
    },
    formats: {
      international: (number: string) => `+49 ${number.slice(0, 4)} ${number.slice(4)}`,
      national: (number: string) => `0${number.slice(0, 4)} ${number.slice(4)}`,
      e164: (number: string) => `+49${number}`,
    },
  },
  RU: {
    name: "Russia",
    code: "RU",
    flag: "🇷🇺",
    countryCode: "+7",
    generateNumber: () => {
      const areaCode = ["901", "902", "903", "904", "905", "906", "908", "909", "910", "911", "912", "913", "914", "915", "916", "917", "918", "919", "920", "921", "922", "923", "924", "925", "926", "927", "928", "929", "930", "931", "932", "933", "934", "935", "936", "937", "938", "939"][Math.floor(Math.random() * 38)];
      const middleDigits = generateRandomDigits(3);
      const lastDigits = generateRandomDigits(2);
      const lastTwo = generateRandomDigits(2);
      return areaCode + middleDigits + lastDigits + lastTwo;
    },
    formats: {
      international: (number: string) => `+7 (${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6, 8)}-${number.slice(8)}`,
      national: (number: string) => `8 (${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6, 8)}-${number.slice(8)}`,
      e164: (number: string) => `+7${number}`,
    },
  },
  CN: {
    name: "China",
    code: "CN",
    flag: "🇨🇳",
    countryCode: "+86",
    generateNumber: () => {
      const carrier = ["13", "14", "15", "16", "17", "18", "19"][Math.floor(Math.random() * 7)];
      const middleDigits = generateRandomDigits(3);
      const lastDigits = generateRandomDigits(4);
      const lastFour = generateRandomDigits(4);
      return carrier + middleDigits + lastDigits + lastFour;
    },
    formats: {
      international: (number: string) => `+86 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5, 9)} ${number.slice(9)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5, 9)} ${number.slice(9)}`,
      e164: (number: string) => `+86${number}`,
    },
  },
  IN: {
    name: "India",
    code: "IN",
    flag: "🇮🇳",
    countryCode: "+91",
    generateNumber: () => {
      const areaCode = generateRandomDigits(5);
      const subscriber = generateRandomDigits(5);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+91 ${number.slice(0, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+91${number}`,
    },
  },
  BR: {
    name: "Brazil",
    code: "BR",
    flag: "🇧🇷",
    countryCode: "+55",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const firstPart = generateRandomDigits(5);
      const secondPart = generateRandomDigits(4);
      return areaCode + firstPart + secondPart;
    },
    formats: {
      international: (number: string) => `+55 (${number.slice(0, 2)}) ${number.slice(2, 7)}-${number.slice(7)}`,
      national: (number: string) => `(${number.slice(0, 2)}) ${number.slice(2, 7)}-${number.slice(7)}`,
      e164: (number: string) => `+55${number}`,
    },
  },
  FR: {
    name: "France",
    code: "FR",
    flag: "🇫🇷",
    countryCode: "+33",
    generateNumber: () => {
      const areaCode = ["6", "7", "9"][Math.floor(Math.random() * 3)];
      const middleDigits = generateRandomDigits(4);
      const lastDigits = generateRandomDigits(4);
      return areaCode + middleDigits + lastDigits;
    },
    formats: {
      international: (number: string) => `+33 ${number.slice(0, 1)} ${number.slice(1, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 1)} ${number.slice(1, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+33${number}`,
    },
  },
  ES: {
    name: "Spain",
    code: "ES",
    flag: "🇪🇸",
    countryCode: "+34",
    generateNumber: () => {
      const areaCode = generateRandomDigits(6);
      const subscriber = generateRandomDigits(4);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+34 ${number.slice(0, 6)} ${number.slice(6)}`,
      national: (number: string) => `0${number.slice(0, 6)} ${number.slice(6)}`,
      e164: (number: string) => `+34${number}`,
    },
  },
  PT: {
    name: "Portugal",
    code: "PT",
    flag: "🇵🇹",
    countryCode: "+351",
    generateNumber: () => {
      const areaCode = generateRandomDigits(3);
      const middleDigits = generateRandomDigits(3);
      const lastDigits = generateRandomDigits(3);
      return areaCode + middleDigits + lastDigits;
    },
    formats: {
      international: (number: string) => `+351 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      national: (number: string) => `0${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      e164: (number: string) => `+351${number}`,
    },
  },
  GB: {
    name: "United Kingdom",
    code: "GB",
    flag: "🇬🇧",
    countryCode: "+44",
    generateNumber: () => {
      const areaCode = generateRandomDigits(3);
      const subscriber = generateRandomDigits(7);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+44 ${number.slice(0, 3)} ${number.slice(3, 7)} ${number.slice(7)}`,
      national: (number: string) => `0${number.slice(0, 3)} ${number.slice(3, 7)} ${number.slice(7)}`,
      e164: (number: string) => `+44${number}`,
    },
  },
  JP: {
    name: "Japan",
    code: "JP",
    flag: "🇯🇵",
    countryCode: "+81",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const firstPart = generateRandomDigits(3);
      const secondPart = generateRandomDigits(4);
      return areaCode + firstPart + secondPart;
    },
    formats: {
      international: (number: string) => `+81 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+81${number}`,
    },
  },
  DK: {
    name: "Denmark",
    code: "DK",
    flag: "🇩🇰",
    countryCode: "+45",
    generateNumber: () => {
      const firstPart = generateRandomDigits(4);
      const secondPart = generateRandomDigits(4);
      return firstPart + secondPart;
    },
    formats: {
      international: (number: string) => `+45 ${number.slice(0, 4)} ${number.slice(4)}`,
      national: (number: string) => `${number.slice(0, 4)} ${number.slice(4)}`,
      e164: (number: string) => `+45${number}`,
    },
  },
  SE: {
    name: "Sweden",
    code: "SE",
    flag: "🇸🇪",
    countryCode: "+46",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+46 ${number.slice(0, 2)} ${number.slice(2, 6)} ${number.slice(6)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 6)} ${number.slice(6)}`,
      e164: (number: string) => `+46${number}`,
    },
  },
  NO: {
    name: "Norway",
    code: "NO",
    flag: "🇳🇴",
    countryCode: "+47",
    generateNumber: () => {
      const firstPart = generateRandomDigits(4);
      const secondPart = generateRandomDigits(4);
      return firstPart + secondPart;
    },
    formats: {
      international: (number: string) => `+47 ${number.slice(0, 4)} ${number.slice(4)}`,
      national: (number: string) => `${number.slice(0, 4)} ${number.slice(4)}`,
      e164: (number: string) => `+47${number}`,
    },
  },
  FI: {
    name: "Finland",
    code: "FI",
    flag: "🇫🇮",
    countryCode: "+358",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(7);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+358 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+358${number}`,
    },
  },
  IT: {
    name: "Italy",
    code: "IT",
    flag: "🇮🇹",
    countryCode: "+39",
    generateNumber: () => {
      const areaCode = generateRandomDigits(3);
      const subscriber = generateRandomDigits(7);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+39 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      national: (number: string) => `0${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      e164: (number: string) => `+39${number}`,
    },
  },
  NL: {
    name: "Netherlands",
    code: "NL",
    flag: "🇳🇱",
    countryCode: "+31",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+31 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+31${number}`,
    },
  },
  BE: {
    name: "Belgium",
    code: "BE",
    flag: "🇧🇪",
    countryCode: "+32",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+32 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+32${number}`,
    },
  },
  CA: {
    name: "Canada",
    code: "CA",
    flag: "🇨🇦",
    countryCode: "+1",
    generateNumber: () => {
      const areaCode = generateRandomDigits(3);
      const exchange = generateRandomDigits(3);
      const number = generateRandomDigits(4);
      return areaCode + exchange + number;
    },
    formats: {
      international: (number: string) => `+1 (${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`,
      national: (number: string) => `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`,
      e164: (number: string) => `+1${number}`,
    },
  },
  AU: {
    name: "Australia",
    code: "AU",
    flag: "🇦🇺",
    countryCode: "+61",
    generateNumber: () => {
      const areaCode = generateRandomDigits(1);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+61 ${number.slice(0, 1)} ${number.slice(1, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 1)} ${number.slice(1, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+61${number}`,
    },
  },
  NZ: {
    name: "New Zealand",
    code: "NZ",
    flag: "🇳🇿",
    countryCode: "+64",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(7);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+64 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+64${number}`,
    },
  },
  MX: {
    name: "Mexico",
    code: "MX",
    flag: "🇲🇽",
    countryCode: "+52",
    generateNumber: () => {
      const areaCode = generateRandomDigits(3);
      const subscriber = generateRandomDigits(7);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+52 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      national: (number: string) => `${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      e164: (number: string) => `+52${number}`,
    },
  },
  ZA: {
    name: "South Africa",
    code: "ZA",
    flag: "🇿🇦",
    countryCode: "+27",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+27 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+27${number}`,
    },
  },
  SG: {
    name: "Singapore",
    code: "SG",
    flag: "🇸🇬",
    countryCode: "+65",
    generateNumber: () => {
      const firstPart = generateRandomDigits(4);
      const secondPart = generateRandomDigits(4);
      return firstPart + secondPart;
    },
    formats: {
      international: (number: string) => `+65 ${number.slice(0, 4)} ${number.slice(4)}`,
      national: (number: string) => `${number.slice(0, 4)} ${number.slice(4)}`,
      e164: (number: string) => `+65${number}`,
    },
  },
  KR: {
    name: "South Korea",
    code: "KR",
    flag: "🇰🇷",
    countryCode: "+82",
    generateNumber: () => {
      const carrier = ["10", "11", "12", "13", "14", "15", "16", "17", "18", "19"][Math.floor(Math.random() * 10)];
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(4);
      return carrier + areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+82 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+82${number}`,
    },
  },
  TH: {
    name: "Thailand",
    code: "TH",
    flag: "🇹🇭",
    countryCode: "+66",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(7);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+66 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+66${number}`,
    },
  },
  MY: {
    name: "Malaysia",
    code: "MY",
    flag: "🇲🇾",
    countryCode: "+60",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+60 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+60${number}`,
    },
  },
  ID: {
    name: "Indonesia",
    code: "ID",
    flag: "🇮🇩",
    countryCode: "+62",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+62 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+62${number}`,
    },
  },
  PH: {
    name: "Philippines",
    code: "PH",
    flag: "🇵🇭",
    countryCode: "+63",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+63 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+63${number}`,
    },
  },
  TR: {
    name: "Turkey",
    code: "TR",
    flag: "🇹🇷",
    countryCode: "+90",
    generateNumber: () => {
      const areaCode = generateRandomDigits(3);
      const subscriber = generateRandomDigits(7);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+90 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      national: (number: string) => `0${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      e164: (number: string) => `+90${number}`,
    },
  },
  SA: {
    name: "Saudi Arabia",
    code: "SA",
    flag: "🇸🇦",
    countryCode: "+966",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(7);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+966 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+966${number}`,
    },
  },
  AE: {
    name: "UAE",
    code: "AE",
    flag: "🇦🇪",
    countryCode: "+971",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(7);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+971 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+971${number}`,
    },
  },
  PL: {
    name: "Poland",
    code: "PL",
    flag: "🇵🇱",
    countryCode: "+48",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+48 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+48${number}`,
    },
  },
  UA: {
    name: "Ukraine",
    code: "UA",
    flag: "🇺🇦",
    countryCode: "+380",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+380 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+380${number}`,
    },
  },
  GR: {
    name: "Greece",
    code: "GR",
    flag: "🇬🇷",
    countryCode: "+30",
    generateNumber: () => {
      const areaCode = generateRandomDigits(3);
      const subscriber = generateRandomDigits(7);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+30 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      national: (number: string) => `0${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      e164: (number: string) => `+30${number}`,
    },
  },
  CZ: {
    name: "Czech Republic",
    code: "CZ",
    flag: "🇨🇿",
    countryCode: "+420",
    generateNumber: () => {
      const areaCode = generateRandomDigits(3);
      const subscriber = generateRandomDigits(7);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+420 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      national: (number: string) => `${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      e164: (number: string) => `+420${number}`,
    },
  },
  HU: {
    name: "Hungary",
    code: "HU",
    flag: "🇭🇺",
    countryCode: "+36",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+36 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+36${number}`,
    },
  },
  RO: {
    name: "Romania",
    code: "RO",
    flag: "🇷🇴",
    countryCode: "+40",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+40 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+40${number}`,
    },
  },
  BG: {
    name: "Bulgaria",
    code: "BG",
    flag: "🇧🇬",
    countryCode: "+359",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+359 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+359${number}`,
    },
  },
  HR: {
    name: "Croatia",
    code: "HR",
    flag: "🇭🇷",
    countryCode: "+385",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+385 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+385${number}`,
    },
  },
  RS: {
    name: "Serbia",
    code: "RS",
    flag: "🇷🇸",
    countryCode: "+381",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+381 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+381${number}`,
    },
  },
  SI: {
    name: "Slovenia",
    code: "SI",
    flag: "🇸🇮",
    countryCode: "+386",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(7);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+386 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+386${number}`,
    },
  },
  SK: {
    name: "Slovakia",
    code: "SK",
    flag: "🇸🇰",
    countryCode: "+421",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+421 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+421${number}`,
    },
  },
  AT: {
    name: "Austria",
    code: "AT",
    flag: "🇦🇹",
    countryCode: "+43",
    generateNumber: () => {
      const areaCode = generateRandomDigits(3);
      const subscriber = generateRandomDigits(7);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+43 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      national: (number: string) => `0${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      e164: (number: string) => `+43${number}`,
    },
  },
  CH: {
    name: "Switzerland",
    code: "CH",
    flag: "🇨🇭",
    countryCode: "+41",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+41 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+41${number}`,
    },
  },
  IE: {
    name: "Ireland",
    code: "IE",
    flag: "🇮🇪",
    countryCode: "+353",
    generateNumber: () => {
      const areaCode = generateRandomDigits(3);
      const subscriber = generateRandomDigits(7);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+353 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      national: (number: string) => `0${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      e164: (number: string) => `+353${number}`,
    },
  },
  IL: {
    name: "Israel",
    code: "IL",
    flag: "🇮🇱",
    countryCode: "+972",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(7);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+972 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+972${number}`,
    },
  },
  EG: {
    name: "Egypt",
    code: "EG",
    flag: "🇪🇬",
    countryCode: "+20",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+20 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+20${number}`,
    },
  },
  MA: {
    name: "Morocco",
    code: "MA",
    flag: "🇲🇦",
    countryCode: "+212",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+212 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+212${number}`,
    },
  },
  PK: {
    name: "Pakistan",
    code: "PK",
    flag: "🇵🇰",
    countryCode: "+92",
    generateNumber: () => {
      const areaCode = generateRandomDigits(3);
      const subscriber = generateRandomDigits(7);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+92 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      national: (number: string) => `0${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      e164: (number: string) => `+92${number}`,
    },
  },
  BD: {
    name: "Bangladesh",
    code: "BD",
    flag: "🇧🇩",
    countryCode: "+880",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+880 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+880${number}`,
    },
  },
  VN: {
    name: "Vietnam",
    code: "VN",
    flag: "🇻🇳",
    countryCode: "+84",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+84 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+84${number}`,
    },
  },
  KH: {
    name: "Cambodia",
    code: "KH",
    flag: "🇰🇭",
    countryCode: "+855",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+855 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+855${number}`,
    },
  },
  LA: {
    name: "Laos",
    code: "LA",
    flag: "🇱🇦",
    countryCode: "+856",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+856 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+856${number}`,
    },
  },
  MM: {
    name: "Myanmar",
    code: "MM",
    flag: "🇲🇲",
    countryCode: "+95",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+95 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+95${number}`,
    },
  },
  LK: {
    name: "Sri Lanka",
    code: "LK",
    flag: "🇱🇰",
    countryCode: "+94",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+94 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+94${number}`,
    },
  },
  NP: {
    name: "Nepal",
    code: "NP",
    flag: "🇳🇵",
    countryCode: "+977",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+977 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+977${number}`,
    },
  },
  KZ: {
    name: "Kazakhstan",
    code: "KZ",
    flag: "🇰🇿",
    countryCode: "+7",
    generateNumber: () => {
      const areaCode = generateRandomDigits(3);
      const subscriber = generateRandomDigits(7);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+7 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      national: (number: string) => `8 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      e164: (number: string) => `+7${number}`,
    },
  },
  UZ: {
    name: "Uzbekistan",
    code: "UZ",
    flag: "🇺🇿",
    countryCode: "+998",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+998 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `8 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+998${number}`,
    },
  },
  TM: {
    name: "Turkmenistan",
    code: "TM",
    flag: "🇹🇲",
    countryCode: "+993",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+993 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `8 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+993${number}`,
    },
  },
  GE: {
    name: "Georgia",
    code: "GE",
    flag: "🇬🇪",
    countryCode: "+995",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+995 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `8 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+995${number}`,
    },
  },
  AM: {
    name: "Armenia",
    code: "AM",
    flag: "🇦🇲",
    countryCode: "+374",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+374 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+374${number}`,
    },
  },
  LB: {
    name: "Lebanon",
    code: "LB",
    flag: "🇱🇧",
    countryCode: "+961",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+961 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+961${number}`,
    },
  },
  JO: {
    name: "Jordan",
    code: "JO",
    flag: "🇯🇴",
    countryCode: "+962",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+962 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+962${number}`,
    },
  },
  IQ: {
    name: "Iraq",
    code: "IQ",
    flag: "🇮🇶",
    countryCode: "+964",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+964 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+964${number}`,
    },
  },
  IR: {
    name: "Iran",
    code: "IR",
    flag: "🇮🇷",
    countryCode: "+98",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+98 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+98${number}`,
    },
  },
  KW: {
    name: "Kuwait",
    code: "KW",
    flag: "🇰🇼",
    countryCode: "+965",
    generateNumber: () => {
      const firstPart = generateRandomDigits(4);
      const secondPart = generateRandomDigits(4);
      return firstPart + secondPart;
    },
    formats: {
      international: (number: string) => `+965 ${number.slice(0, 4)} ${number.slice(4)}`,
      national: (number: string) => `${number.slice(0, 4)} ${number.slice(4)}`,
      e164: (number: string) => `+965${number}`,
    },
  },
  QA: {
    name: "Qatar",
    code: "QA",
    flag: "🇶🇦",
    countryCode: "+974",
    generateNumber: () => {
      const firstPart = generateRandomDigits(4);
      const secondPart = generateRandomDigits(4);
      return firstPart + secondPart;
    },
    formats: {
      international: (number: string) => `+974 ${number.slice(0, 4)} ${number.slice(4)}`,
      national: (number: string) => `${number.slice(0, 4)} ${number.slice(4)}`,
      e164: (number: string) => `+974${number}`,
    },
  },
  OM: {
    name: "Oman",
    code: "OM",
    flag: "🇴🇲",
    countryCode: "+968",
    generateNumber: () => {
      const firstPart = generateRandomDigits(4);
      const secondPart = generateRandomDigits(4);
      return firstPart + secondPart;
    },
    formats: {
      international: (number: string) => `+968 ${number.slice(0, 4)} ${number.slice(4)}`,
      national: (number: string) => `${number.slice(0, 4)} ${number.slice(4)}`,
      e164: (number: string) => `+968${number}`,
    },
  },
  YE: {
    name: "Yemen",
    code: "YE",
    flag: "🇾🇪",
    countryCode: "+967",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+967 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+967${number}`,
    },
  },
  BH: {
    name: "Bahrain",
    code: "BH",
    flag: "🇧🇭",
    countryCode: "+973",
    generateNumber: () => {
      const firstPart = generateRandomDigits(4);
      const secondPart = generateRandomDigits(4);
      return firstPart + secondPart;
    },
    formats: {
      international: (number: string) => `+973 ${number.slice(0, 4)} ${number.slice(4)}`,
      national: (number: string) => `${number.slice(0, 4)} ${number.slice(4)}`,
      e164: (number: string) => `+973${number}`,
    },
  },
  KE: {
    name: "Kenya",
    code: "KE",
    flag: "🇰🇪",
    countryCode: "+254",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+254 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+254${number}`,
    },
  },
  UG: {
    name: "Uganda",
    code: "UG",
    flag: "🇺🇬",
    countryCode: "+256",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+256 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+256${number}`,
    },
  },
  TZ: {
    name: "Tanzania",
    code: "TZ",
    flag: "🇹🇿",
    countryCode: "+255",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+255 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+255${number}`,
    },
  },
  ET: {
    name: "Ethiopia",
    code: "ET",
    flag: "🇪🇹",
    countryCode: "+251",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+251 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+251${number}`,
    },
  },
  GH: {
    name: "Ghana",
    code: "GH",
    flag: "🇬🇭",
    countryCode: "+233",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+233 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+233${number}`,
    },
  },
  CM: {
    name: "Cameroon",
    code: "CM",
    flag: "🇨🇲",
    countryCode: "+237",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+237 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+237${number}`,
    },
  },
  CI: {
    name: "Ivory Coast",
    code: "CI",
    flag: "🇨🇮",
    countryCode: "+225",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+225 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+225${number}`,
    },
  },
  SN: {
    name: "Senegal",
    code: "SN",
    flag: "🇸🇳",
    countryCode: "+221",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+221 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+221${number}`,
    },
  },
  PE: {
    name: "Peru",
    code: "PE",
    flag: "🇵🇪",
    countryCode: "+51",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+51 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+51${number}`,
    },
  },
  CO: {
    name: "Colombia",
    code: "CO",
    flag: "🇨🇴",
    countryCode: "+57",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+57 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+57${number}`,
    },
  },
  EC: {
    name: "Ecuador",
    code: "EC",
    flag: "🇪🇨",
    countryCode: "+593",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+593 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+593${number}`,
    },
  },
  VE: {
    name: "Venezuela",
    code: "VE",
    flag: "🇻🇪",
    countryCode: "+58",
    generateNumber: () => {
      const areaCode = generateRandomDigits(3);
      const subscriber = generateRandomDigits(7);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+58 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      national: (number: string) => `0${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      e164: (number: string) => `+58${number}`,
    },
  },
  BO: {
    name: "Bolivia",
    code: "BO",
    flag: "🇧🇴",
    countryCode: "+591",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+591 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+591${number}`,
    },
  },
  CL: {
    name: "Chile",
    code: "CL",
    flag: "🇨🇱",
    countryCode: "+56",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+56 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+56${number}`,
    },
  },
  AR: {
    name: "Argentina",
    code: "AR",
    flag: "🇦🇷",
    countryCode: "+54",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+54 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+54${number}`,
    },
  },
  PY: {
    name: "Paraguay",
    code: "PY",
    flag: "🇵🇾",
    countryCode: "+595",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+595 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+595${number}`,
    },
  },
  UY: {
    name: "Uruguay",
    code: "UY",
    flag: "🇺🇾",
    countryCode: "+598",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+598 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+598${number}`,
    },
  },
  CU: {
    name: "Cuba",
    code: "CU",
    flag: "🇨🇺",
    countryCode: "+53",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+53 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+53${number}`,
    },
  },
  JM: {
    name: "Jamaica",
    code: "JM",
    flag: "🇯🇲",
    countryCode: "+1",
    generateNumber: () => {
      const areaCode = generateRandomDigits(3);
      const exchange = generateRandomDigits(3);
      const number = generateRandomDigits(4);
      return areaCode + exchange + number;
    },
    formats: {
      international: (number: string) => `+1 (${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`,
      national: (number: string) => `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`,
      e164: (number: string) => `+1${number}`,
    },
  },
  DO: {
    name: "Dominican Republic",
    code: "DO",
    flag: "🇩🇴",
    countryCode: "+1",
    generateNumber: () => {
      const areaCode = generateRandomDigits(3);
      const exchange = generateRandomDigits(3);
      const number = generateRandomDigits(4);
      return areaCode + exchange + number;
    },
    formats: {
      international: (number: string) => `+1 (${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`,
      national: (number: string) => `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`,
      e164: (number: string) => `+1${number}`,
    },
  },
  TW: {
    name: "Taiwan",
    code: "TW",
    flag: "🇹🇼",
    countryCode: "+886",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+886 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+886${number}`,
    },
  },
  HK: {
    name: "Hong Kong",
    code: "HK",
    flag: "🇭🇰",
    countryCode: "+852",
    generateNumber: () => {
      const firstPart = generateRandomDigits(4);
      const secondPart = generateRandomDigits(4);
      return firstPart + secondPart;
    },
    formats: {
      international: (number: string) => `+852 ${number.slice(0, 4)} ${number.slice(4)}`,
      national: (number: string) => `${number.slice(0, 4)} ${number.slice(4)}`,
      e164: (number: string) => `+852${number}`,
    },
  },
  MO: {
    name: "Macau",
    code: "MO",
    flag: "🇲🇴",
    countryCode: "+853",
    generateNumber: () => {
      const firstPart = generateRandomDigits(4);
      const secondPart = generateRandomDigits(4);
      return firstPart + secondPart;
    },
    formats: {
      international: (number: string) => `+853 ${number.slice(0, 4)} ${number.slice(4)}`,
      national: (number: string) => `${number.slice(0, 4)} ${number.slice(4)}`,
      e164: (number: string) => `+853${number}`,
    },
  },
  MN: {
    name: "Mongolia",
    code: "MN",
    flag: "🇲🇳",
    countryCode: "+976",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+976 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+976${number}`,
    },
  },
  AZ: {
    name: "Azerbaijan",
    code: "AZ",
    flag: "🇦🇿",
    countryCode: "+994",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+994 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+994${number}`,
    },
  },
  LU: {
    name: "Luxembourg",
    code: "LU",
    flag: "🇱🇺",
    countryCode: "+352",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+352 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+352${number}`,
    },
  },
  CY: {
    name: "Cyprus",
    code: "CY",
    flag: "🇨🇾",
    countryCode: "+357",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+357 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+357${number}`,
    },
  },
  MT: {
    name: "Malta",
    code: "MT",
    flag: "🇲🇹",
    countryCode: "+356",
    generateNumber: () => {
      const firstPart = generateRandomDigits(4);
      const secondPart = generateRandomDigits(4);
      return firstPart + secondPart;
    },
    formats: {
      international: (number: string) => `+356 ${number.slice(0, 4)} ${number.slice(4)}`,
      national: (number: string) => `${number.slice(0, 4)} ${number.slice(4)}`,
      e164: (number: string) => `+356${number}`,
    },
  },
  IS: {
    name: "Iceland",
    code: "IS",
    flag: "🇮🇸",
    countryCode: "+354",
    generateNumber: () => {
      const firstPart = generateRandomDigits(3);
      const secondPart = generateRandomDigits(4);
      return firstPart + secondPart;
    },
    formats: {
      international: (number: string) => `+354 ${number.slice(0, 3)} ${number.slice(3)}`,
      national: (number: string) => `${number.slice(0, 3)} ${number.slice(3)}`,
      e164: (number: string) => `+354${number}`,
    },
  },
  GI: {
    name: "Gibraltar",
    code: "GI",
    flag: "🇬🇮",
    countryCode: "+350",
    generateNumber: () => {
      const firstPart = generateRandomDigits(5);
      return firstPart;
    },
    formats: {
      international: (number: string) => `+350 ${number}`,
      national: (number: string) => `${number}`,
      e164: (number: string) => `+350${number}`,
    },
  },
  AF: {
    name: "Afghanistan",
    code: "AF",
    flag: "🇦🇫",
    countryCode: "+93",
    generateNumber: () => {
      const areaCode = generateRandomDigits(2);
      const subscriber = generateRandomDigits(8);
      return areaCode + subscriber;
    },
    formats: {
      international: (number: string) => `+93 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+93${number}`,
    },
  },
};

export const generatePhoneNumbers = (
  countryCode: string,
  quantity: number,
  format: PhoneFormat
): string[] => {
  const country = COUNTRIES[countryCode];
  if (!country) {
    throw new Error(`Country ${countryCode} not found`);
  }

  const numbers: string[] = [];
  for (let i = 0; i < quantity; i++) {
    const rawNumber = country.generateNumber();
    const formattedNumber = country.formats[format](rawNumber);
    numbers.push(formattedNumber);
  }

  return numbers;
};
