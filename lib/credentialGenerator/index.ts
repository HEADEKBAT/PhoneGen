/* ── Public API ────────────────────────────────────────────────────────── */

export { generateRandomPassword } from './generatePassword';
export type { RandomPasswordOptions } from './generatePassword';

export { generateHumanPassword } from './generateHumanPassword';
export type { HumanPasswordOptions } from './types';

export { generatePassphrase } from './generatePassphrase';
export type { PassphraseOptions } from './types';

export { generatePronounceable } from './generatePronounceable';
export type { PronounceableOptions } from './types';

export { generatePin } from './generatePin';
export type { PinOptions } from './types';

export {
  generateUUID,
  generateJWTSecret,
  generateApiKey,
  generateWebhookSecret,
  generateHex,
  generateBase64,
  generateDatabasePassword,
} from './generateSecrets';

export { generateCredentialPair, generateCredentialPairs } from './generatePair';
export type { CredentialPair } from './generatePair';

export {
  getCharsetSize,
  calculateRandomPasswordEntropy,
  calculatePassphraseEntropy,
  calculateHumanPasswordEntropy,
  calculatePronounceableEntropy,
  estimateCrackTime,
  getCrackTimeEstimates,
  scorePassword,
} from './entropy';
export type { CrackTimeEstimate, PasswordScore } from './entropy';

export { isCommonPassword } from './commonPasswords';

export type {
  CredentialResult,
  PasswordMode,
  ActiveTab,
  SecretMode,
} from './types';
