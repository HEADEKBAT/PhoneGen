import { parsePhoneNumberFromString } from "libphonenumber-js";
import { getPhoneMetadata, COUNTRY_METADATA } from './countryMetadata';
import type { GenerationMode, PhoneMetadata } from './countryMetadata';

export type { GenerationMode };
export type PhoneFormat = "international" | "national" | "e164" | "rfc3966";

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

export interface CountryInfo {
  countryCode: string;
  numberLength: number;
  exampleInternational: string;
}

// ── Seeded PRNG (mulberry32) ──────────────────────────────────────────
function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) || 1;
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
      const lastDigits = generateRandomDigits(4);
      return areaCode + middleDigits + lastDigits;
    },
    formats: {
      international: (number: string) => `+234 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      national: (number: string) => `0${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      e164: (number: string) => `+234${number}`,
    },
  },
  US: {
    name: "USA",
    code: "US",
    flag: "🇺🇸",
    countryCode: "+1",
    generateNumber: () => {
      const nxx = () => (Math.floor(Math.random() * 8) + 2).toString() + generateRandomDigits(2);
      const areaCode = nxx();
      const exchange = nxx();
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
      const prefix = ["151", "152", "155", "156", "157", "159", "160", "162", "163", "170", "171", "172", "173", "174", "175", "176", "177", "178", "179"][Math.floor(Math.random() * 19)];
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
    },
    formats: {
      international: (number: string) => `+49 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      national: (number: string) => `0${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
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
      const prefix = ["130", "131", "132", "133", "134", "135", "136", "137", "138", "139", "150", "151", "152", "153", "155", "156", "157", "158", "159", "186", "187", "188", "189", "176", "177", "178", "180", "181", "182", "183", "184", "185", "170", "171", "172", "173", "175", "190", "191", "192", "193", "195", "196", "197", "198", "199"][Math.floor(Math.random() * 46)];
      const subscriber = generateRandomDigits(8);
      return prefix + subscriber;
    },
    formats: {
      international: (number: string) => `+86 ${number.slice(0, 3)} ${number.slice(3, 7)} ${number.slice(7)}`,
      national: (number: string) => `${number.slice(0, 3)} ${number.slice(3, 7)} ${number.slice(7)}`,
      e164: (number: string) => `+86${number}`,
    },
  },
  IN: {
    name: "India",
    code: "IN",
    flag: "🇮🇳",
    countryCode: "+91",
    generateNumber: () => {
      const firstDigit = (Math.floor(Math.random() * 4) + 6).toString();
      const rest = generateRandomDigits(9);
      return firstDigit + rest;
    },
    formats: {
      international: (number: string) => `+91 ${number.slice(0, 5)} ${number.slice(5)}`,
      national: (number: string) => `${number.slice(0, 5)} ${number.slice(5)}`,
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
      const prefix = ["6", "7"][Math.floor(Math.random() * 2)];
      const subscriber = generateRandomDigits(8);
      return prefix + subscriber;
    },
    formats: {
      international: (number: string) => `+34 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      national: (number: string) => `${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      e164: (number: string) => `+34${number}`,
    },
  },
  PT: {
    name: "Portugal",
    code: "PT",
    flag: "🇵🇹",
    countryCode: "+351",
    generateNumber: () => {
      const prefix = ["91", "92", "93", "96"][Math.floor(Math.random() * 4)];
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
    },
    formats: {
      international: (number: string) => `+351 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+351${number}`,
    },
  },
  GB: {
    name: "United Kingdom",
    code: "GB",
    flag: "🇬🇧",
    countryCode: "+44",
    generateNumber: () => {
      const prefix = "7" + generateRandomDigits(3);
      const subscriber = generateRandomDigits(6);
      return prefix + subscriber;
    },
    formats: {
      international: (number: string) => `+44 ${number.slice(0, 4)} ${number.slice(4, 7)} ${number.slice(7)}`,
      national: (number: string) => `0${number.slice(0, 4)} ${number.slice(4, 7)} ${number.slice(7)}`,
      e164: (number: string) => `+44${number}`,
    },
  },
  JP: {
    name: "Japan",
    code: "JP",
    flag: "🇯🇵",
    countryCode: "+81",
    generateNumber: () => {
      const prefix = ["70", "80", "90"][Math.floor(Math.random() * 3)];
      const subscriber = generateRandomDigits(8);
      return prefix + subscriber;
    },
    formats: {
      international: (number: string) => `+81 ${number.slice(0, 2)} ${number.slice(2, 6)} ${number.slice(6)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 6)} ${number.slice(6)}`,
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
      const prefix = ["70", "71", "72", "73", "76", "79"][Math.floor(Math.random() * 6)];
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
    },
    formats: {
      international: (number: string) => `+46 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
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
      const prefix = ["320", "322", "323", "327", "328", "329", "330", "331", "333", "334", "335", "336", "337", "338", "339", "340", "341", "342", "343", "344", "345", "346", "347", "348", "349", "350", "351", "352", "353", "354", "355", "356", "357", "358", "359", "360", "366", "368", "370", "371", "372", "373", "374", "375", "376", "377", "378", "379", "380", "381", "383", "385", "388", "389", "391", "392", "393"][Math.floor(Math.random() * 57)];
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
    },
    formats: {
      international: (number: string) => `+39 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      national: (number: string) => `${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      e164: (number: string) => `+39${number}`,
    },
  },
  NL: {
    name: "Netherlands",
    code: "NL",
    flag: "🇳🇱",
    countryCode: "+31",
    generateNumber: () => {
      const subscriber = generateRandomDigits(8);
      return "6" + subscriber;
    },
    formats: {
      international: (number: string) => `+31 ${number.slice(0, 1)} ${number.slice(1, 5)} ${number.slice(5)}`,
      national: (number: string) => `06 ${number.slice(1, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+31${number}`,
    },
  },
  BE: {
    name: "Belgium",
    code: "BE",
    flag: "🇧🇪",
    countryCode: "+32",
    generateNumber: () => {
      const prefix = ["45", "46", "47", "48", "49"][Math.floor(Math.random() * 5)];
      const thirdDigit = Math.floor(Math.random() * 10).toString();
      const subscriber = generateRandomDigits(6);
      return prefix + thirdDigit + subscriber;
    },
    formats: {
      international: (number: string) => `+32 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      national: (number: string) => `0${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      e164: (number: string) => `+32${number}`,
    },
  },
  CA: {
    name: "Canada",
    code: "CA",
    flag: "🇨🇦",
    countryCode: "+1",
    generateNumber: () => {
      const nxx = () => (Math.floor(Math.random() * 8) + 2).toString() + generateRandomDigits(2);
      const areaCode = nxx();
      const exchange = nxx();
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
      const prefix = "4";
      const subscriber = generateRandomDigits(8);
      return prefix + subscriber;
    },
    formats: {
      international: (number: string) => `+61 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      national: (number: string) => `0${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
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
      const prefix = ["71", "72", "73", "74", "76", "78", "79", "81", "82", "83", "84"][Math.floor(Math.random() * 11)];
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
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
      const carrier = ["10", "11", "16", "17", "18", "19"][Math.floor(Math.random() * 6)];
      const subscriber = generateRandomDigits(8);
      return carrier + subscriber;
    },
    formats: {
      international: (number: string) => `+82 ${number.slice(0, 2)} ${number.slice(2, 6)} ${number.slice(6)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 6)} ${number.slice(6)}`,
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
      const prefix = "1" + generateRandomDigits(1);
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
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
      const prefix = ["905", "906", "907", "908", "909", "915", "916", "917", "918", "919", "920", "921", "922", "923", "925", "926", "927", "928", "929", "930", "935", "936", "937", "938", "939", "940", "942", "943", "944", "945", "946", "947", "948", "949", "955", "956", "957", "958", "959", "965", "966", "967", "968", "969", "970", "973", "975", "976", "977", "978", "979", "980", "985", "986", "987", "988", "989", "994", "995", "996", "997", "998", "999"][Math.floor(Math.random() * 63)];
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
    },
    formats: {
      international: (number: string) => `+63 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      national: (number: string) => `0${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
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
      const prefix = ["45", "50", "51", "53", "57", "60", "66", "69", "72", "73", "78", "79", "88"][Math.floor(Math.random() * 13)];
      const thirdDigit = Math.floor(Math.random() * 10).toString();
      const subscriber = generateRandomDigits(6);
      return prefix + thirdDigit + subscriber;
    },
    formats: {
      international: (number: string) => `+48 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      national: (number: string) => `${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      e164: (number: string) => `+48${number}`,
    },
  },
  UA: {
    name: "Ukraine",
    code: "UA",
    flag: "🇺🇦",
    countryCode: "+380",
    generateNumber: () => {
      const prefix = ["39", "50", "63", "66", "67", "68", "73", "91", "92", "93", "94", "95", "96", "97", "98", "99"][Math.floor(Math.random() * 16)];
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
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
      const prefix = ["601", "602", "603", "604", "605", "606", "607", "608", "609", "70", "72", "73", "77", "79"][Math.floor(Math.random() * 14)];
      if (prefix.length === 2) return prefix + generateRandomDigits(7);
      return prefix + generateRandomDigits(6);
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
      const prefix = ["20", "30", "31", "50", "70"][Math.floor(Math.random() * 5)];
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
    },
    formats: {
      international: (number: string) => `+36 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `06 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+36${number}`,
    },
  },
  RO: {
    name: "Romania",
    code: "RO",
    flag: "🇷🇴",
    countryCode: "+40",
    generateNumber: () => {
      const prefix = ["72", "73", "74", "75", "76", "77", "78"][Math.floor(Math.random() * 7)];
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
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
      const prefix = ["87", "88", "89", "98", "99"][Math.floor(Math.random() * 5)];
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
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
      const prefix = ["91", "92", "95", "97", "98", "99"][Math.floor(Math.random() * 6)];
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
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
      const prefix = ["60", "61", "62", "63", "64", "65", "66", "68", "69"][Math.floor(Math.random() * 9)];
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
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
      const prefix = ["30", "31", "40", "41", "49", "50", "51", "61", "64", "65", "66", "67", "68", "69", "70"][Math.floor(Math.random() * 15)];
      const subscriber = generateRandomDigits(6);
      return prefix + subscriber;
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
      const prefix = ["90", "91", "94", "95", "99"][Math.floor(Math.random() * 5)];
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
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
      const prefix = ["74", "75", "76", "77", "78", "79"][Math.floor(Math.random() * 6)];
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
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
      const prefix = ["82", "83", "84", "85", "86", "87", "88", "89"][Math.floor(Math.random() * 8)];
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
    },
    formats: {
      international: (number: string) => `+353 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+353${number}`,
    },
  },
  IL: {
    name: "Israel",
    code: "IL",
    flag: "🇮🇱",
    countryCode: "+972",
    generateNumber: () => {
      const prefix = ["50", "51", "52", "53", "54", "55", "56", "57", "58", "59"][Math.floor(Math.random() * 10)];
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
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
      const prefix = ["6", "7"][Math.floor(Math.random() * 2)];
      const subscriber = generateRandomDigits(8);
      return prefix + subscriber;
    },
    formats: {
      international: (number: string) => `+212 ${number.slice(0, 1)} ${number.slice(1, 4)} ${number.slice(4, 7)} ${number.slice(7)}`,
      national: (number: string) => `0${number.slice(0, 1)} ${number.slice(1, 4)} ${number.slice(4, 7)} ${number.slice(7)}`,
      e164: (number: string) => `+212${number}`,
    },
  },
  DZ: {
    name: "Algeria",
    code: "DZ",
    flag: "🇩🇿",
    countryCode: "+213",
    generateNumber: () => {
      const prefix = ["551", "552", "553", "554", "555", "556", "557", "558", "559", "561", "562", "563", "564", "565", "566", "567", "568", "569", "661", "662", "663", "664", "665", "666", "667", "668", "669", "671", "672", "673", "674", "675", "676", "677", "678", "679", "690", "691", "692", "693", "694", "695", "696", "697", "698", "699", "770", "771", "772", "773", "774", "775", "776", "777", "778", "779", "780", "781", "782", "783", "784", "785", "786", "787", "788", "789", "790", "791", "792", "793", "794", "795", "796", "797", "798", "799"][Math.floor(Math.random() * 75)];
      const subscriber = generateRandomDigits(6);
      return prefix + subscriber;
    },
    formats: {
      international: (number: string) => `+213 ${number.slice(0, 3)} ${number.slice(3, 5)} ${number.slice(5, 7)} ${number.slice(7)}`,
      national: (number: string) => `0${number.slice(0, 3)} ${number.slice(3, 5)} ${number.slice(5, 7)} ${number.slice(7)}`,
      e164: (number: string) => `+213${number}`,
    },
  },
  TN: {
    name: "Tunisia",
    code: "TN",
    flag: "🇹🇳",
    countryCode: "+216",
    generateNumber: () => {
      const prefix = ["20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "50", "52", "55", "56", "57", "58", "59", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99"][Math.floor(Math.random() * 27)];
      const subscriber = generateRandomDigits(6);
      return prefix + subscriber;
    },
    formats: {
      international: (number: string) => `+216 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+216${number}`,
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
      const prefix = ["10", "11", "12", "15", "16", "17", "60", "66", "67", "68", "69", "77", "78", "81", "85", "86", "87", "88", "89", "90", "92", "95", "96", "97", "98", "99"][Math.floor(Math.random() * 26)];
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
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
      const prefix = ["71", "72", "74", "75", "76", "77", "78", "79"][Math.floor(Math.random() * 8)];
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
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
      const prefix = ["970", "971", "972", "973", "974", "975", "976", "977", "978", "979", "980", "981", "982", "984", "985", "986"][Math.floor(Math.random() * 16)];
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
    },
    formats: {
      international: (number: string) => `+977 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      national: (number: string) => `0${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
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
      const prefix = ["90", "91", "93", "94", "95", "97", "98", "99"][Math.floor(Math.random() * 8)];
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
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
      const prefix = ["61", "62", "63", "64", "65", "66", "67", "68"][Math.floor(Math.random() * 8)];
      const subscriber = generateRandomDigits(6);
      return prefix + subscriber;
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
      const prefix = ["51", "55", "56", "57", "58", "59", "79", "95"][Math.floor(Math.random() * 8)];
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
    },
    formats: {
      international: (number: string) => `+995 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+995${number}`,
    },
  },
  AM: {
    name: "Armenia",
    code: "AM",
    flag: "🇦🇲",
    countryCode: "+374",
    generateNumber: () => {
      const prefix = ["33", "41", "43", "44", "77", "91", "93", "94", "95", "96", "97", "98", "99"][Math.floor(Math.random() * 13)];
      const subscriber = generateRandomDigits(6);
      return prefix + subscriber;
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
      const prefix = ["70", "71", "76", "78", "79", "80", "81"][Math.floor(Math.random() * 7)];
      const subscriber = generateRandomDigits(6);
      return prefix + subscriber;
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
      const prefix = ["77", "78", "79"][Math.floor(Math.random() * 3)];
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
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
      const prefix = ["73", "74", "75", "76", "77", "78", "79"][Math.floor(Math.random() * 7)];
      const subscriber = generateRandomDigits(8);
      return prefix + subscriber;
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
      const prefix = ["71", "73", "77"][Math.floor(Math.random() * 3)];
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
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
      const prefix = ["71", "74", "75", "76", "77", "78", "79"][Math.floor(Math.random() * 7)];
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
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
      const prefix = ["70", "71", "72", "74", "75", "76", "77", "78"][Math.floor(Math.random() * 8)];
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
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
      const prefix = ["71", "74", "75", "76", "77", "78"][Math.floor(Math.random() * 6)];
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
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
      const prefix = ["91", "92", "93", "94", "96", "97", "98"][Math.floor(Math.random() * 7)];
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
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
      const prefix = ["20", "23", "24", "26", "27", "50", "54", "55", "56", "57", "59"][Math.floor(Math.random() * 11)];
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
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
      const prefix = ["6", "7", "8"][Math.floor(Math.random() * 3)];
      const subscriber = generateRandomDigits(8);
      return prefix + subscriber;
    },
    formats: {
      international: (number: string) => `+237 ${number.slice(0, 1)} ${number.slice(1, 4)} ${number.slice(4, 7)} ${number.slice(7)}`,
      national: (number: string) => `${number.slice(0, 1)} ${number.slice(1, 4)} ${number.slice(4, 7)} ${number.slice(7)}`,
      e164: (number: string) => `+237${number}`,
    },
  },
  CI: {
    name: "Ivory Coast",
    code: "CI",
    flag: "🇨🇮",
    countryCode: "+225",
    generateNumber: () => {
      const prefix = ["01", "02", "03", "04", "05", "06", "07", "08"][Math.floor(Math.random() * 8)];
      const subscriber = generateRandomDigits(6);
      return prefix + subscriber;
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
      const prefix = ["70", "75", "76", "77", "78"][Math.floor(Math.random() * 5)];
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
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
      const prefix = ["9"][Math.floor(Math.random() * 1)];
      const subscriber = generateRandomDigits(8);
      return prefix + subscriber;
    },
    formats: {
      international: (number: string) => `+51 ${number.slice(0, 1)} ${number.slice(1, 4)} ${number.slice(4, 7)} ${number.slice(7)}`,
      national: (number: string) => `${number.slice(0, 1)} ${number.slice(1, 4)} ${number.slice(4, 7)} ${number.slice(7)}`,
      e164: (number: string) => `+51${number}`,
    },
  },
  CO: {
    name: "Colombia",
    code: "CO",
    flag: "🇨🇴",
    countryCode: "+57",
    generateNumber: () => {
      const prefix = ["300", "301", "302", "310", "311", "312", "313", "314", "315", "316", "317", "318", "319", "320", "321", "322"][Math.floor(Math.random() * 16)];
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
    },
    formats: {
      international: (number: string) => `+57 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      national: (number: string) => `${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      e164: (number: string) => `+57${number}`,
    },
  },
  EC: {
    name: "Ecuador",
    code: "EC",
    flag: "🇪🇨",
    countryCode: "+593",
    generateNumber: () => {
      const prefix = ["9"][Math.floor(Math.random() * 1)];
      const subscriber = generateRandomDigits(8);
      return prefix + subscriber;
    },
    formats: {
      international: (number: string) => `+593 ${number.slice(0, 1)} ${number.slice(1, 4)} ${number.slice(4, 7)} ${number.slice(7)}`,
      national: (number: string) => `0${number.slice(0, 1)} ${number.slice(1, 4)} ${number.slice(4, 7)} ${number.slice(7)}`,
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
      const prefix = ["7"][Math.floor(Math.random() * 1)];
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
    },
    formats: {
      international: (number: string) => `+591 ${number.slice(0, 1)} ${number.slice(1, 4)} ${number.slice(4)}`,
      national: (number: string) => `${number.slice(0, 1)} ${number.slice(1, 4)} ${number.slice(4)}`,
      e164: (number: string) => `+591${number}`,
    },
  },
  CL: {
    name: "Chile",
    code: "CL",
    flag: "🇨🇱",
    countryCode: "+56",
    generateNumber: () => {
      const prefix = ["9"][Math.floor(Math.random() * 1)];
      const subscriber = generateRandomDigits(8);
      return prefix + subscriber;
    },
    formats: {
      international: (number: string) => `+56 ${number.slice(0, 1)} ${number.slice(1, 4)} ${number.slice(4, 7)} ${number.slice(7)}`,
      national: (number: string) => `${number.slice(0, 1)} ${number.slice(1, 4)} ${number.slice(4, 7)} ${number.slice(7)}`,
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
      const prefix = ["961", "962", "963", "964", "965", "966", "967", "968", "969", "971", "972", "973", "974", "975", "976", "977", "978", "979", "981", "982", "983", "984", "985", "986", "987", "988", "989", "991", "992", "993", "994", "995", "996", "997", "998", "999"][Math.floor(Math.random() * 36)];
      const subscriber = generateRandomDigits(6);
      return prefix + subscriber;
    },
    formats: {
      international: (number: string) => `+595 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      national: (number: string) => `0${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      e164: (number: string) => `+595${number}`,
    },
  },
  UY: {
    name: "Uruguay",
    code: "UY",
    flag: "🇺🇾",
    countryCode: "+598",
    generateNumber: () => {
      const prefix = ["9"][Math.floor(Math.random() * 1)];
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
    },
    formats: {
      international: (number: string) => `+598 ${number.slice(0, 1)} ${number.slice(1, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 1)} ${number.slice(1, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+598${number}`,
    },
  },
  CU: {
    name: "Cuba",
    code: "CU",
    flag: "🇨🇺",
    countryCode: "+53",
    generateNumber: () => {
      const prefix = ["5"][Math.floor(Math.random() * 1)];
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
    },
    formats: {
      international: (number: string) => `+53 ${number.slice(0, 1)} ${number.slice(1, 4)} ${number.slice(4)}`,
      national: (number: string) => `0${number.slice(0, 1)} ${number.slice(1, 4)} ${number.slice(4)}`,
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
      const prefix = ["9"][Math.floor(Math.random() * 1)];
      const subscriber = generateRandomDigits(8);
      return prefix + subscriber;
    },
    formats: {
      international: (number: string) => `+886 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      national: (number: string) => `0${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
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
      return "6" + generateRandomDigits(7);
    },
    formats: {
      international: (number: string) => `+853 ${number.slice(0, 1)} ${number.slice(1, 4)} ${number.slice(4)}`,
      national: (number: string) => `${number.slice(0, 1)} ${number.slice(1, 4)} ${number.slice(4)}`,
      e164: (number: string) => `+853${number}`,
    },
  },
  MN: {
    name: "Mongolia",
    code: "MN",
    flag: "🇲🇳",
    countryCode: "+976",
    generateNumber: () => {
      const prefix = ["8", "9"][Math.floor(Math.random() * 2)];
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
    },
    formats: {
      international: (number: string) => `+976 ${number.slice(0, 1)} ${number.slice(1, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 1)} ${number.slice(1, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+976${number}`,
    },
  },
  AZ: {
    name: "Azerbaijan",
    code: "AZ",
    flag: "🇦🇿",
    countryCode: "+994",
    generateNumber: () => {
      const prefix = ["50", "51", "55", "60", "70", "77"][Math.floor(Math.random() * 6)];
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
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
      const prefix = ["6"][Math.floor(Math.random() * 1)];
      const subscriber = generateRandomDigits(8);
      return prefix + subscriber;
    },
    formats: {
      international: (number: string) => `+352 ${number.slice(0, 1)} ${number.slice(1, 4)} ${number.slice(4, 7)} ${number.slice(7)}`,
      national: (number: string) => `${number.slice(0, 1)} ${number.slice(1, 4)} ${number.slice(4, 7)} ${number.slice(7)}`,
      e164: (number: string) => `+352${number}`,
    },
  },
  CY: {
    name: "Cyprus",
    code: "CY",
    flag: "🇨🇾",
    countryCode: "+357",
    generateNumber: () => {
      const prefix = ["9"][Math.floor(Math.random() * 1)];
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
    },
    formats: {
      international: (number: string) => `+357 ${number.slice(0, 1)} ${number.slice(1, 5)} ${number.slice(5)}`,
      national: (number: string) => `${number.slice(0, 1)} ${number.slice(1, 5)} ${number.slice(5)}`,
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
      const prefix = ["2", "5"][Math.floor(Math.random() * 2)];
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
    },
    formats: {
      international: (number: string) => `+350 ${number.slice(0, 4)} ${number.slice(4)}`,
      national: (number: string) => `${number.slice(0, 4)} ${number.slice(4)}`,
      e164: (number: string) => `+350${number}`,
    },
  },
  AF: {
    name: "Afghanistan",
    code: "AF",
    flag: "🇦🇫",
    countryCode: "+93",
    generateNumber: () => {
      const prefix = ["70", "71", "72", "73", "74", "75", "76", "77", "78", "79"][Math.floor(Math.random() * 10)];
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
    },
    formats: {
      international: (number: string) => `+93 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      national: (number: string) => `0${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`,
      e164: (number: string) => `+93${number}`,
    },
  },
  KG: {
    name: "Kyrgyzstan",
    code: "KG",
    flag: "🇰🇬",
    countryCode: "+996",
    generateNumber: () => {
      const prefix = ["500", "501", "502", "503", "504", "505", "506", "507", "508", "509", "550", "551", "552", "553", "554", "555", "556", "557", "558", "559", "700", "701", "702", "703", "704", "705", "706", "707", "708", "709", "770", "771", "772", "773", "774", "775", "776", "777", "778", "779", "990", "991", "992", "993", "994", "995", "996", "997", "998", "999"][Math.floor(Math.random() * 50)];
      const subscriber = generateRandomDigits(7);
      return prefix + subscriber;
    },
    formats: {
      international: (number: string) => `+996 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      national: (number: string) => `0${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`,
      e164: (number: string) => `+996${number}`,
    },
  },
};

/* ── Dynamic country lookup (hardcoded dict + metadata fallback) ─────── */

/**
 * Get flag emoji from ISO 3166-1 Alpha-2 code.
 * Algorithmic — no lookup table needed.
 */
function getFlagEmoji(isoCode: string): string {
  const base = 0x1f1e6;
  const code = isoCode.toUpperCase();
  return String.fromCodePoint(
    ...code.split('').map((c) => base + c.charCodeAt(0) - 65),
  );
}

/**
 * Get a Country object for any supported region code.
 *
 * Returns the hardcoded entry when available (richer carrier-prefix data
 * for generation), otherwise builds a dynamic Country from libphonenumber
 * metadata so every supported region shows a correct name, flag, and
 * country code in the UI.
 *
 * Never throws — falls back to US on unknown codes.
 */
export function getCountry(isoCode: string): Country {
  const code = isoCode.toUpperCase();

  // Hardcoded entries take priority
  if (COUNTRIES[code]) return COUNTRIES[code];

  // Dynamic fallback from metadata
  const meta = getPhoneMetadata(code);
  if (meta) {
    return {
      name: code,
      code,
      flag: getFlagEmoji(code),
      countryCode: `+${meta.countryCode}`,
      generateNumber: () => {
        const len = meta.primaryLength;
        return Array.from({ length: len }, () => Math.floor(Math.random() * 10)).join('');
      },
      formats: {
        international: (n: string) => `+${meta.countryCode} ${n}`,
        national: (n: string) => n,
        e164: (n: string) => `+${meta.countryCode}${n}`,
      },
    };
  }

  // Ultimate fallback
  return COUNTRIES['US']!;
}

/**
 * Get Country objects for every supported region.
 *
 * Merges the ~80 hardcoded entries (which have richer carrier-prefix data)
 * with all ~165 metadata-only regions from libphonenumber.
 * Result is sorted alphabetically by ISO code.
 */
export function getAllCountries(): Country[] {
  const seen = new Set<string>();
  const result: Country[] = [];

  /* Hardcoded entries first */
  for (const code of Object.keys(COUNTRIES)) {
    seen.add(code);
    result.push(COUNTRIES[code]);
  }

  /* Metadata-only regions */
  for (const code of Object.keys(COUNTRY_METADATA)) {
    if (!seen.has(code)) {
      seen.add(code);
      // Use getCountry to get the dynamic Country object
    }
  }

  /* Build dynamic Country objects for all seen codes and sort */
  return [...seen]
    .sort()
    .map((code) => getCountry(code));
}

/**
 * Generate a single phone number without any validation (fast, for random mode).
 * Uses the primary NSN length from libphonenumber metadata to produce
 * plausible numbers without the overhead of full validation.
 */
function generateRandomNumber(meta: PhoneMetadata | undefined, isoCode: string): string {
  if (meta) {
    const len = meta.primaryLength;
    return Array.from({ length: len }, () => Math.floor(Math.random() * 10)).join('');
  }
  // Fallback: use existing generateNumber
  return COUNTRIES[isoCode].generateNumber();
}

/**
 * Generate a validated phone number (for valid mode).
 * Generates random NSNs at the primary length from libphonenumber metadata
 * and validates each one via parsePhoneNumberFromString().isValid().
 * Retries up to MAX_ATTEMPTS per invocation.
 */
const VALID_MAX_ATTEMPTS = 200;

function generateValidNumber(meta: PhoneMetadata | undefined, isoCode: string): string {
  if (!meta) {
    // No metadata — fallback to random + validation
    const country = COUNTRIES[isoCode];
    if (!country) throw new Error(`Country ${isoCode} not found`);
    for (let attempts = 0; attempts < VALID_MAX_ATTEMPTS; attempts++) {
      const raw = country.generateNumber();
      const e164 = country.formats.e164(raw);
      const parsed = parsePhoneNumberFromString(e164);
      if (parsed && parsed.isValid()) return raw;
    }
    return country.generateNumber();
  }

  const len = meta.primaryLength;
  const cc = meta.countryCode;
  // Start with the example number's prefix to increase hit rate
  const examplePrefix = meta.exampleNumber.slice(0, Math.min(3, Math.floor(len / 3)));

  for (let round = 0; round < 3; round++) {
    for (let attempts = 0; attempts < Math.ceil(VALID_MAX_ATTEMPTS / 3); attempts++) {
      let nsn: string;
      if (round === 0 && examplePrefix) {
        // First round: seed with example prefix
        const restLen = len - examplePrefix.length;
        const rest = Array.from({ length: restLen }, () => Math.floor(Math.random() * 10)).join('');
        nsn = examplePrefix + rest;
      } else {
        // Subsequent rounds: fully random
        nsn = Array.from({ length: len }, () => Math.floor(Math.random() * 10)).join('');
      }
      const e164 = '+' + cc + nsn;
      const parsed = parsePhoneNumberFromString(e164);
      if (parsed && parsed.isValid()) return nsn;
    }
  }

  // Ultimate fallback
  return COUNTRIES[isoCode].generateNumber();
}

/**
 * Generate an example/test phone number (for example mode).
 * Uses example numbers from libphonenumber-js official dataset.
 */
const exampleCounters: Record<string, number> = {};

function generateExampleNumber(meta: PhoneMetadata | undefined, isoCode: string): string {
  if (meta?.exampleNumber) {
    const counter = exampleCounters[isoCode] ?? 0;
    exampleCounters[isoCode] = counter + 1;
    return meta.exampleNumber;
  }

  // Fallback: deterministic generation from existing generator
  const country = COUNTRIES[isoCode];
  if (!country) throw new Error(`Country ${isoCode} not found`);
  return country.generateNumber();
}

/**
 * Fallback formatter for regions not in the hardcoded COUNTRIES dict.
 * Uses libphonenumber metadata to produce basic formatting.
 */
function formatForMetadata(
  rawNumber: string,
  meta: import('./phoneMetadata').PhoneMetadata | undefined,
  format: PhoneFormat,
): string {
  if (!meta) return rawNumber;

  switch (format) {
    case 'e164':
      return `+${meta.countryCode}${rawNumber}`;
    case 'international':
      return `+${meta.countryCode} ${rawNumber}`;
    case 'national':
      return rawNumber;
    case 'rfc3966':
      return `tel:+${meta.countryCode}${rawNumber}`;
    default:
      return rawNumber;
  }
}

export const generatePhoneNumbers = (
  countryCode: string,
  quantity: number,
  format: PhoneFormat,
  seed?: string,
  mode: GenerationMode = 'valid',
): string[] => {
  const country = COUNTRIES[countryCode];

  const numbers: string[] = [];
  const originalRandom = Math.random;
  const meta = getPhoneMetadata(countryCode);

  if (seed !== undefined && seed !== '') {
    Math.random = mulberry32(hashSeed(seed));
    // Reset example counters for deterministic example mode
    if (mode === 'example') {
      exampleCounters[countryCode] = 0;
    }
  }

  try {
    for (let i = 0; i < quantity; i++) {
      let rawNumber: string;

      switch (mode) {
        case 'random':
          rawNumber = generateRandomNumber(meta, countryCode);
          break;
        case 'valid':
        case 'mobile':
        case 'fixedLine':
        case 'tollFree':
        case 'voip':
          rawNumber = generateValidNumber(meta, countryCode);
          break;
        case 'example':
          rawNumber = generateExampleNumber(meta, countryCode);
          break;
        default:
          rawNumber = generateRandomNumber(meta, countryCode);
      }

      let formattedNumber: string;
      if (country) {
        if (format === 'rfc3966') {
          formattedNumber = 'tel:' + country.formats.e164(rawNumber);
        } else {
          formattedNumber = country.formats[format](rawNumber);
        }
      } else {
        formattedNumber = formatForMetadata(rawNumber, meta, format);
      }
      numbers.push(formattedNumber);
    }
  } finally {
    Math.random = originalRandom;
  }

  return numbers;
};

/** @deprecated Use generatePhoneNumbers with mode parameter */
export function getCountryInfo(countryCode: string): CountryInfo {
  const country = getCountry(countryCode);
  const meta = getPhoneMetadata(countryCode);

  const originalRandom = Math.random;
  Math.random = mulberry32(hashSeed("country-info-example"));
  const example = country.generateNumber();
  Math.random = originalRandom;

  return {
    countryCode: country.countryCode,
    numberLength: example.length,
    exampleInternational: country.formats.international(example),
  };
}
