import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { type SupportedLanguage, DEFAULT_LANGUAGE } from './i18n/locales';
import type { GeneratedUser } from './userGenerator/types';
import type { ActiveTab, PasswordMode, SecretMode } from './credentialGenerator/types';

interface CountryStore {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
}

interface LanguageStore {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
}

interface FavoritesStore {
  favorites: string[];
  toggleFavorite: (code: string) => void;
  isFavorite: (code: string) => boolean;
}

interface RecentlyUsedStore {
  recentlyUsed: string[];
  addRecentlyUsed: (code: string) => void;
}

/* ── UserGenerator Store ──────────────────────────────────────────────── */

interface UserGeneratorStore {
  users: GeneratedUser[];
  selectedCountry: string;
  quantity: number;
  gender: 'male' | 'female' | 'any';
  ageMin: number;
  ageMax: number;
  filterQuery: string;
  setUsers: (users: GeneratedUser[]) => void;
  setSelectedCountry: (code: string) => void;
  setQuantity: (n: number) => void;
  setGender: (g: 'male' | 'female' | 'any') => void;
  setAgeRange: (min: number, max: number) => void;
  setFilterQuery: (q: string) => void;
  clearUsers: () => void;
}

export const useCountryStore = create<CountryStore>()(
  persist(
    (set) => ({
      selectedCountry: 'NG',
      setSelectedCountry: (country: string) => set({ selectedCountry: country }),
    }),
    {
      name: 'country-store',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);

export const useLanguageStore = create<LanguageStore>()((set) => ({
  language: DEFAULT_LANGUAGE,
  setLanguage: (lang: SupportedLanguage) => set({ language: lang }),
}));

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (code: string) => {
        const current = get().favorites;
        if (current.includes(code)) {
          set({ favorites: current.filter((c) => c !== code) });
        } else {
          set({ favorites: [...current, code] });
        }
      },
      isFavorite: (code: string) => get().favorites.includes(code),
    }),
    {
      name: 'favorites-store',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);

export const useRecentlyUsedStore = create<RecentlyUsedStore>()(
  persist(
    (set, get) => ({
      recentlyUsed: [],
      addRecentlyUsed: (code: string) => {
        const current = get().recentlyUsed.filter((c) => c !== code);
        const updated = [code, ...current].slice(0, 5);
        set({ recentlyUsed: updated });
      },
    }),
    {
      name: 'recently-used-store',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);

/* ── UserGenerator ──────────────────────────────────────────────────────── */

const UG_DEFAULTS = {
  selectedCountry: 'US',
  quantity: 5,
  gender: 'any' as const,
  ageMin: 18,
  ageMax: 65,
};

export const useUserGeneratorStore = create<UserGeneratorStore>()(
  persist(
    (set) => ({
      /* ── State ──────────────────────────────────────────────────── */
      users: [],
      selectedCountry: UG_DEFAULTS.selectedCountry,
      quantity: UG_DEFAULTS.quantity,
      gender: UG_DEFAULTS.gender,
      ageMin: UG_DEFAULTS.ageMin,
      ageMax: UG_DEFAULTS.ageMax,
      filterQuery: '',

      /* ── Actions ────────────────────────────────────────────────── */
      setUsers: (users) => set({ users, filterQuery: '' }),
      setSelectedCountry: (selectedCountry) => set({ selectedCountry }),
      setQuantity: (quantity) => set({ quantity }),
      setGender: (gender) => set({ gender }),
      setAgeRange: (ageMin, ageMax) => set({ ageMin, ageMax }),
      setFilterQuery: (filterQuery) => set({ filterQuery }),
      clearUsers: () => set({ users: [], filterQuery: '' }),
    }),
    {
      name: 'user-generator-store',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      /* Only persist settings — users are in-memory to keep storage lean */
      partialize: (state) => ({
        selectedCountry: state.selectedCountry,
        quantity: state.quantity,
        gender: state.gender,
        ageMin: state.ageMin,
        ageMax: state.ageMax,
      }),
    }
  )
);

/* ── Credential Generator Store ─────────────────────────────────────────── */

const _ = {
  selectedCountry: 'US',
  quantity: 5,
  passwordLength: 16,
  passwordUppercase: true,
  passwordLowercase: true,
  passwordNumbers: true,
  passwordSymbols: true,
  passwordExcludeChars: '',
  passwordAvoidAmbiguous: false,
  humanCapitalize: true,
  humanIncludeNumber: true,
  humanIncludeSymbol: true,
  passphraseWordCount: 4,
  passphraseSeparator: '-' as const,
  passphraseCapitalize: false,
  passphraseIncludeNumber: true,
  pronounceableSyllables: 3,
  pinLength: 6 as const,
  pinNoRepeat: false,
  secretMode: 'uuid' as const,
  hexLength: 32,
  base64Length: 32,
  tokenLength: 32,
  tokenType: 'hex' as const,
  pairCountry: 'US',
};

export interface CredentialGeneratorStore {
  /* Tab */
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  /* Password mode */
  passwordMode: PasswordMode;
  setPasswordMode: (mode: PasswordMode) => void;

  /* Random password settings */
  passwordLength: number;
  passwordUppercase: boolean;
  passwordLowercase: boolean;
  passwordNumbers: boolean;
  passwordSymbols: boolean;
  passwordExcludeChars: string;
  passwordAvoidAmbiguous: boolean;
  setPasswordLength: (n: number) => void;
  setPasswordUppercase: (v: boolean) => void;
  setPasswordLowercase: (v: boolean) => void;
  setPasswordNumbers: (v: boolean) => void;
  setPasswordSymbols: (v: boolean) => void;
  setPasswordExcludeChars: (s: string) => void;
  setPasswordAvoidAmbiguous: (v: boolean) => void;

  /* Human Password settings */
  humanCapitalize: boolean;
  humanIncludeNumber: boolean;
  humanIncludeSymbol: boolean;
  setHumanCapitalize: (v: boolean) => void;
  setHumanIncludeNumber: (v: boolean) => void;
  setHumanIncludeSymbol: (v: boolean) => void;

  /* Passphrase settings */
  passphraseWordCount: number;
  passphraseSeparator: '-' | '_' | '.' | ' ';
  passphraseCapitalize: boolean;
  passphraseIncludeNumber: boolean;
  setPassphraseWordCount: (n: number) => void;
  setPassphraseSeparator: (s: '-' | '_' | '.' | ' ') => void;
  setPassphraseCapitalize: (v: boolean) => void;
  setPassphraseIncludeNumber: (v: boolean) => void;

  /* Pronounceable settings */
  pronounceableSyllables: number;
  setPronounceableSyllables: (n: number) => void;

  /* PIN settings */
  pinLength: 4 | 6 | 8;
  pinNoRepeat: boolean;
  setPinLength: (n: 4 | 6 | 8) => void;
  setPinNoRepeat: (v: boolean) => void;

  /* Secrets settings */
  secretMode: SecretMode;
  hexLength: number;
  base64Length: number;
  tokenLength: number;
  tokenType: 'hex' | 'base64' | 'base64url';
  setSecretMode: (m: SecretMode) => void;
  setHexLength: (n: number) => void;
  setBase64Length: (n: number) => void;
  setTokenLength: (n: number) => void;
  setTokenType: (t: 'hex' | 'base64' | 'base64url') => void;

  /* Pair settings */
  pairQuantity: number;
  pairCountry: string;
  setPairQuantity: (n: number) => void;
  setPairCountry: (c: string) => void;

  /* Results (in-memory only — not persisted) */
  results: string[];
  setResults: (r: string[]) => void;

  /* History (persisted to localStorage) */
  history: string[];
  addToHistory: (entry: string) => void;
  clearHistory: () => void;
}

export const useCredentialGeneratorStore = create<CredentialGeneratorStore>()(
  persist(
    (set, get) => ({
      /* Tab */
      activeTab: 'passwords',
      setActiveTab: (activeTab) => set({ activeTab }),

      /* Password mode */
      passwordMode: 'random',
      setPasswordMode: (passwordMode) => set({ passwordMode }),

      /* Random password */
      selectedCountry: 'US',
      quantity: 5,
      passwordLength: 16,
      passwordUppercase: true,
      passwordLowercase: true,
      passwordNumbers: true,
      passwordSymbols: true,
      passwordExcludeChars: '',
      passwordAvoidAmbiguous: false,
      humanCapitalize: true,
      humanIncludeNumber: true,
      humanIncludeSymbol: true,
      passphraseWordCount: 4,
      passphraseSeparator: '-' as const,
      passphraseCapitalize: false,
      passphraseIncludeNumber: true,
      pronounceableSyllables: 3,
      pinLength: 6 as const,
      pinNoRepeat: false,
      secretMode: 'uuid' as const,
      hexLength: 32,
      base64Length: 32,
      pairQuantity: 5,
      pairCountry: 'US',
      tokenLength: 32,
      tokenType: 'hex' as const,
      setPasswordLength: (passwordLength) => set({ passwordLength }),
      setPasswordUppercase: (passwordUppercase) => set({ passwordUppercase }),
      setPasswordLowercase: (passwordLowercase) => set({ passwordLowercase }),
      setPasswordNumbers: (passwordNumbers) => set({ passwordNumbers }),
      setPasswordSymbols: (passwordSymbols) => set({ passwordSymbols }),
      setPasswordExcludeChars: (passwordExcludeChars) => set({ passwordExcludeChars }),
      setPasswordAvoidAmbiguous: (passwordAvoidAmbiguous) => set({ passwordAvoidAmbiguous }),

      /* Human Password */
      setHumanCapitalize: (humanCapitalize) => set({ humanCapitalize }),
      setHumanIncludeNumber: (humanIncludeNumber) => set({ humanIncludeNumber }),
      setHumanIncludeSymbol: (humanIncludeSymbol) => set({ humanIncludeSymbol }),

      /* Passphrase */
      setPassphraseWordCount: (passphraseWordCount) => set({ passphraseWordCount }),
      setPassphraseSeparator: (passphraseSeparator) => set({ passphraseSeparator }),
      setPassphraseCapitalize: (passphraseCapitalize) => set({ passphraseCapitalize }),
      setPassphraseIncludeNumber: (passphraseIncludeNumber) => set({ passphraseIncludeNumber }),

      /* Pronounceable */
      setPronounceableSyllables: (pronounceableSyllables) => set({ pronounceableSyllables }),

      /* PIN */
      setPinLength: (pinLength) => set({ pinLength }),
      setPinNoRepeat: (pinNoRepeat) => set({ pinNoRepeat }),

      /* Secrets */
      setSecretMode: (secretMode) => set({ secretMode }),
      setHexLength: (hexLength) => set({ hexLength }),
      setBase64Length: (base64Length) => set({ base64Length }),
      setTokenLength: (tokenLength) => set({ tokenLength }),
      setTokenType: (tokenType) => set({ tokenType }),

      /* Pairs */
      setPairQuantity: (pairQuantity) => set({ pairQuantity }),
      setPairCountry: (pairCountry) => set({ pairCountry }),

      /* Results (in-memory only) */
      results: [],
      setResults: (results) => set({ results }),

      /* History (persisted) */
      history: [],
      addToHistory: (entry) => {
        const history = [entry, ...get().history.filter((h) => h !== entry)].slice(0, 20);
        set({ history });
      },
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'credential-generator-store',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      /* Persist settings + history, but NOT results */
      partialize: (state) => ({
        activeTab: state.activeTab,
        passwordMode: state.passwordMode,
        passwordLength: state.passwordLength,
        passwordUppercase: state.passwordUppercase,
        passwordLowercase: state.passwordLowercase,
        passwordNumbers: state.passwordNumbers,
        passwordSymbols: state.passwordSymbols,
        passwordExcludeChars: state.passwordExcludeChars,
        passwordAvoidAmbiguous: state.passwordAvoidAmbiguous,
        humanCapitalize: state.humanCapitalize,
        humanIncludeNumber: state.humanIncludeNumber,
        humanIncludeSymbol: state.humanIncludeSymbol,
        passphraseWordCount: state.passphraseWordCount,
        passphraseSeparator: state.passphraseSeparator,
        passphraseCapitalize: state.passphraseCapitalize,
        passphraseIncludeNumber: state.passphraseIncludeNumber,
        pronounceableSyllables: state.pronounceableSyllables,
        pinLength: state.pinLength,
        pinNoRepeat: state.pinNoRepeat,
        secretMode: state.secretMode,
        hexLength: state.hexLength,
        base64Length: state.base64Length,
        tokenLength: state.tokenLength,
        tokenType: state.tokenType,
        pairQuantity: state.pairQuantity,
        pairCountry: state.pairCountry,
        history: state.history,
      }),
    }
  )
);