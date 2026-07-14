import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { ActiveTab, PasswordMode, SecretMode } from '@/lib/credentialGenerator/types';

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
    },
  ),
);
