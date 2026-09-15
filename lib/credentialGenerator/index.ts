/* ── Public API ────────────────────────────────────────────────────────── */

export { generateRandomPassword, resolveCharsets } from './generatePassword';
export type { RandomPasswordOptions } from './generatePassword';

export { generatePassphrase, BITS_PER_WORD } from './generatePassphrase';
export type { PassphraseOptions } from './types';

export { generatePronounceable, SYLLABLE_SHAPES } from './generatePronounceable';
export type { PronounceableOptions } from './types';

export { generatePin } from './generatePin';
export type { PinOptions } from './types';

export {
  generateUUID,
  generateUUIDv7,
  generateJWTSecret,
  generateApiKey,
  generateWebhookSecret,
  generateHex,
  generateBase64,
  generateDatabasePassword,
  generateRandomToken,
  generateSessionSecret,
  generateOAuthSecret,
  ALPHABET_SIZES,
} from './generateSecrets';

export { generateCredentialPair, generateCredentialPairs } from './generatePair';
export type { CredentialPair } from './generatePair';

export {
  getCharsetSize,
  calculateRandomPasswordEntropy,
  calculatePassphraseEntropy,
  calculatePronounceableEntropy,
  calculatePinEntropy,
  calculateStringEntropy,
  estimateCrackSeconds,
  getCrackEstimates,
  describeDuration,
  bandForBits,
  scorePassword,
  ATTACK_SCENARIOS,
  STRENGTH_BANDS,
} from './entropy';
export type {
  CrackEstimate,
  Duration,
  PasswordScore,
  AttackScenarioId,
  StrengthBandId,
  StrengthNote,
} from './entropy';

export { isCommonPassword } from './commonPasswords';

export { randomInt, pickOne, pickChar, randomString, shuffled, distinctIndices } from './random';

export type {
  CredentialResult,
  PasswordMode,
  ActiveTab,
  SecretMode,
} from './types';
